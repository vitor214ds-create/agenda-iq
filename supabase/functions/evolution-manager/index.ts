import { createClient } from "https://esm.sh/@supabase/supabase-js@2.116.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
const digits = (value: unknown) =>
  String(value || "")
    .replace(/\D/g, "")
    .slice(0, 15);

async function evolution(baseUrl: string, apiKey: string, path: string, init: RequestInit = {}) {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", apikey: apiKey, ...(init.headers || {}) },
  });
  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!response.ok)
    throw new Error(
      (data as { message?: string; error?: string })?.message ||
        (data as { error?: string })?.error ||
        `Evolution API respondeu ${response.status}`,
    );
  return data as Record<string, unknown>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);
  const url = Deno.env.get("SUPABASE_URL");
  const publishable = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !publishable || !serviceRole) return json({ error: "Backend não configurado" }, 500);
  const authorization = req.headers.get("Authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Não autenticado" }, 401);
  const userClient = createClient(url, publishable, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });
  const admin = createClient(url, serviceRole, { auth: { persistSession: false } });
  const { data: userData } = await admin.auth.getUser(token);
  if (!userData.user) return json({ error: "Sessão inválida" }, 401);
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }
  const organizationId = String(body.organizationId || "");
  const action = String(body.action || "status");
  if (!organizationId) return json({ error: "Empresa não informada" }, 400);
  const { data: membership } = await admin
    .from("organization_members")
    .select("role")
    .eq("organization_id", organizationId)
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (!membership || !["owner", "admin"].includes(membership.role))
    return json({ error: "Sem permissão" }, 403);

  if (action === "configure") {
    const baseUrl = String(body.baseUrl || "").trim();
    const apiKey = String(body.apiKey || "").trim();
    const publicBaseUrl = String(body.publicBaseUrl || "")
      .trim()
      .replace(/\/$/, "");
    const { error } = await userClient.rpc("set_evolution_gateway_config", {
      p_organization_id: organizationId,
      p_base_url: baseUrl,
      p_api_key: apiKey,
    });
    if (error)
      return json(
        { error: "Não foi possível salvar o servidor Evolution. Verifique URL HTTPS e API Key." },
        400,
      );
    if (publicBaseUrl)
      await admin
        .from("organizations")
        .update({ public_app_url: publicBaseUrl })
        .eq("id", organizationId);
    try {
      await evolution(baseUrl, apiKey, "/instance/fetchInstances");
    } catch (error) {
      return json(
        { error: error instanceof Error ? error.message : "Servidor Evolution inacessível" },
        400,
      );
    }
    return json({ ok: true, configured: true });
  }

  const { data: config, error: configError } = await userClient.rpc(
    "get_evolution_gateway_config",
    { p_organization_id: organizationId },
  );
  const gateway = Array.isArray(config) ? config[0] : config;
  const baseUrl = gateway?.base_url as string | undefined;
  const apiKey = gateway?.api_key as string | undefined;
  const { data: accounts } = await admin
    .from("whatsapp_accounts")
    .select(
      "id,internal_name,phone,session_id,connection_status,session_status,reconnect_required,connected_at,qr_expires_at,updated_at",
    )
    .eq("organization_id", organizationId)
    .eq("provider", "evolution_baileys")
    .order("created_at", { ascending: false });
  if (action === "status")
    return json({
      configured: !configError && Boolean(baseUrl && apiKey),
      accounts: accounts || [],
    });
  if (!baseUrl || !apiKey)
    return json({ error: "Configure o servidor Evolution antes de conectar." }, 409);

  const accountId = String(body.accountId || "");
  const existing = accountId ? accounts?.find((item) => item.id === accountId) : accounts?.[0];

  try {
    if (action === "connect") {
      const sessionId =
        existing?.session_id ||
        `zapflow-${organizationId.slice(0, 8)}-${crypto.randomUUID().slice(0, 8)}`;
      let account = existing;
      if (!account) {
        const { data: reserved, error } = await userClient.rpc("zapflow_reserve_whatsapp_account", {
          p_organization_id: organizationId,
          p_session_id: sessionId,
        });
        if (error || !reserved?.[0])
          throw new Error(error?.message || "Não foi possível reservar a sessão");
        account = { id: reserved[0].account_id, session_id: sessionId };
      }
      const { data: secret, error: secretError } = await userClient.rpc(
        "get_or_create_evolution_webhook_secret",
        { p_organization_id: organizationId },
      );
      if (secretError || !secret) throw new Error("Não foi possível proteger o webhook");
      const webhookUrl = `${url}/functions/v1/evolution-webhook?organizationId=${encodeURIComponent(organizationId)}&secret=${encodeURIComponent(secret)}`;
      let created: Record<string, unknown> = {};
      try {
        created = await evolution(baseUrl, apiKey, "/instance/create", {
          method: "POST",
          body: JSON.stringify({
            instanceName: sessionId,
            integration: "WHATSAPP-BAILEYS",
            qrcode: true,
            number: digits(body.phone),
            webhook: {
              url: webhookUrl,
              byEvents: false,
              base64: false,
              events: [
                "APPLICATION_STARTUP",
                "QRCODE_UPDATED",
                "CONNECTION_UPDATE",
                "MESSAGES_UPSERT",
              ],
            },
          }),
        });
      } catch (error) {
        if (!String(error).toLowerCase().includes("already") && !String(error).includes("403"))
          throw error;
      }
      try {
        await evolution(baseUrl, apiKey, `/webhook/set/${encodeURIComponent(sessionId)}`, {
          method: "POST",
          body: JSON.stringify({
            webhook: {
              enabled: true,
              url: webhookUrl,
              webhookByEvents: false,
              webhookBase64: false,
              events: ["QRCODE_UPDATED", "CONNECTION_UPDATE", "MESSAGES_UPSERT"],
            },
          }),
        });
      } catch {
        /* API versions differ; create payload may already configure it. */
      }
      let connect: Record<string, unknown> = {};
      try {
        connect = await evolution(
          baseUrl,
          apiKey,
          `/instance/connect/${encodeURIComponent(sessionId)}${digits(body.phone) ? `?number=${digits(body.phone)}` : ""}`,
        );
      } catch {
        connect = created;
      }
      const qr = (connect.base64 ||
        (connect.qrcode as Record<string, unknown>)?.base64 ||
        created.base64 ||
        (created.qrcode as Record<string, unknown>)?.base64) as string | undefined;
      const pairingCode = (connect.pairingCode ||
        connect.code ||
        created.pairingCode ||
        created.code) as string | undefined;
      await admin
        .from("whatsapp_accounts")
        .update({
          internal_name: String(body.name || "WhatsApp principal").slice(0, 80),
          phone: digits(body.phone) || null,
          status: "CONNECTING",
          connection_status: "CONNECTING",
          session_status: "CONNECTING",
          reconnect_required: false,
          qr_expires_at: new Date(Date.now() + 60_000).toISOString(),
        })
        .eq("id", account.id);
      return json({
        accountId: account.id,
        sessionId,
        qrCode: qr || null,
        pairingCode: pairingCode || null,
        expiresIn: 60,
      });
    }
    if (!existing) return json({ error: "Sessão não encontrada" }, 404);
    if (action === "refresh") {
      const state = await evolution(
        baseUrl,
        apiKey,
        `/instance/connectionState/${encodeURIComponent(existing.session_id)}`,
      );
      const raw = String(
        (state.instance as Record<string, unknown>)?.state || state.state || "close",
      ).toLowerCase();
      const normalized =
        raw === "open" || raw === "connected"
          ? "CONNECTED"
          : raw === "connecting"
            ? "CONNECTING"
            : "DISCONNECTED";
      await admin
        .from("whatsapp_accounts")
        .update({
          connection_status: normalized,
          session_status: normalized,
          reconnect_required: normalized === "DISCONNECTED",
          last_seen_at: new Date().toISOString(),
          connected_at:
            normalized === "CONNECTED" ? new Date().toISOString() : existing.connected_at,
        })
        .eq("id", existing.id);
      return json({ state: normalized });
    }
    if (action === "qr") {
      const connect = await evolution(
        baseUrl,
        apiKey,
        `/instance/connect/${encodeURIComponent(existing.session_id)}`,
      );
      return json({
        qrCode: connect.base64 || (connect.qrcode as Record<string, unknown>)?.base64 || null,
        pairingCode: connect.pairingCode || connect.code || null,
        expiresIn: 60,
      });
    }
    if (action === "disconnect") {
      try {
        await evolution(
          baseUrl,
          apiKey,
          `/instance/logout/${encodeURIComponent(existing.session_id)}`,
          { method: "DELETE" },
        );
      } catch {
        /* continue cleanup */
      }
      await admin
        .from("whatsapp_accounts")
        .update({
          connection_status: "DISCONNECTED",
          session_status: "DISCONNECTED",
          reconnect_required: true,
          status: "DISCONNECTED",
        })
        .eq("id", existing.id);
      return json({ ok: true });
    }
    return json({ error: "Ação inválida" }, 400);
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : "Falha na Evolution API" }, 502);
  }
});
