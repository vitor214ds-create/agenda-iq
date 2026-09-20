/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.116.0";
import postgres from "https://deno.land/x/postgresjs@v3.4.5/mod.js";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const digits = (value: unknown) =>
  String(value || "")
    .replace(/\D/g, "")
    .slice(0, 20);
const pickText = (data: Record<string, any>) =>
  String(
    data?.message?.conversation ||
      data?.message?.extendedTextMessage?.text ||
      data?.message?.imageMessage?.caption ||
      "",
  ).trim();

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Not found", { status: 404 });
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const dbUrl = Deno.env.get("SUPABASE_DB_URL");
  if (!supabaseUrl || !serviceRole || !dbUrl)
    return json({ error: "Backend não configurado" }, 500);
  const url = new URL(req.url);
  const organizationId = url.searchParams.get("organizationId") || "";
  const secret = url.searchParams.get("secret") || "";
  if (!organizationId || secret.length < 32) return new Response("Not found", { status: 404 });
  let payload: Record<string, any>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }
  const instanceName = String(payload.instance || payload.instanceName || payload.sender || "");
  const event = String(payload.event || payload.type || "UNKNOWN");
  const admin = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });
  const sql = postgres(dbUrl, { prepare: false });
  try {
    const accepted =
      await sql`select public.ingest_evolution_webhook(${organizationId}::uuid, ${secret}, ${instanceName}, ${event}, ${JSON.stringify(payload)}::jsonb) as ok`;
    if (!accepted[0]?.ok) return new Response("Forbidden", { status: 403 });
    if (!event.toUpperCase().includes("MESSAGES_UPSERT")) return json({ ok: true });
    const data = (payload.data || {}) as Record<string, any>;
    if (data?.key?.fromMe === true || data?.key?.fromMe === "true")
      return json({ ok: true, ignored: true });
    const remoteJid = String(data?.key?.remoteJidAlt || data?.key?.remoteJid || "");
    if (!remoteJid.endsWith("@s.whatsapp.net") && !remoteJid.endsWith("@lid"))
      return json({ ok: true, ignored: true });
    const phone = digits(remoteJid.split("@")[0]);
    const inbound = pickText(data) || `[Mensagem ${data.messageType || "recebida"}]`;
    if (!phone) return json({ ok: true, ignored: true });
    const { data: organization } = await admin
      .from("organizations")
      .select("id,name,slug,is_blocked,public_app_url")
      .eq("id", organizationId)
      .single();
    if (!organization || organization.is_blocked || !organization.slug)
      return json({ ok: true, ignored: true });
    let { data: conversation } = await admin
      .from("conversations")
      .select("id,public_token,contact_name,contact_phone")
      .eq("organization_id", organizationId)
      .eq("channel", "whatsapp")
      .eq("contact_phone", phone)
      .neq("status", "encerrada")
      .order("last_message_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const contactName = String(data.pushName || payload.pushName || "").trim() || null;
    if (!conversation) {
      const created = await admin
        .from("conversations")
        .insert({
          organization_id: organizationId,
          channel: "whatsapp",
          status: "ia",
          contact_name: contactName,
          contact_phone: phone,
        })
        .select("id,public_token,contact_name,contact_phone")
        .single();
      conversation = created.data;
    }
    if (!conversation) return json({ error: "Não foi possível criar a conversa" }, 500);
    const providerId = String(data?.key?.id || "");
    if (providerId) {
      const { data: duplicate } = await admin
        .from("messages")
        .select("id")
        .eq("conversation_id", conversation.id)
        .eq("metadata->>provider_message_id", providerId)
        .limit(1);
      if (duplicate?.length) return json({ ok: true, duplicate: true });
    }
    await admin.from("messages").insert({
      organization_id: organizationId,
      conversation_id: conversation.id,
      role: "client",
      content: inbound,
      metadata: { channel: "whatsapp", provider_message_id: providerId || null },
    });
    await admin
      .from("conversations")
      .update({
        contact_name: contactName || conversation.contact_name,
        last_message_at: new Date().toISOString(),
      })
      .eq("id", conversation.id);
    const cutoff = new Date(Date.now() - 15 * 60_000).toISOString();
    const { data: recent } = await admin
      .from("messages")
      .select("id")
      .eq("conversation_id", conversation.id)
      .eq("metadata->>kind", "assistant_handoff_link")
      .gte("created_at", cutoff)
      .limit(1);
    if (recent?.length) return json({ ok: true, deduplicated: true });
    const config =
      await sql`select (select decrypted_secret from vault.decrypted_secrets where name=${`zapflow:evolution:url:${organizationId}`} limit 1) base_url, (select decrypted_secret from vault.decrypted_secrets where name=${`zapflow:evolution:key:${organizationId}`} limit 1) api_key`;
    if (!config[0]?.base_url || !config[0]?.api_key)
      return json({ error: "Gateway não configurado" }, 500);
    const appBaseUrl = organization.public_app_url || Deno.env.get("PUBLIC_APP_URL");
    if (!appBaseUrl) return json({ error: "PUBLIC_APP_URL não configurada" }, 500);
    const assistantUrl = new URL(`/chat/${encodeURIComponent(organization.slug)}`, appBaseUrl);
    assistantUrl.searchParams.set("handoff", conversation.public_token);
    if (contactName) assistantUrl.searchParams.set("name", contactName);
    assistantUrl.searchParams.set("phone", phone);
    assistantUrl.searchParams.set("source", "whatsapp");
    const message = `Olá${contactName ? `, ${contactName}` : ""}! 👋 Para tirar dúvidas, consultar horários disponíveis e fazer seu agendamento, acesse:\n\n${assistantUrl.toString()}`;
    const response = await fetch(
      `${String(config[0].base_url).replace(/\/$/, "")}/message/sendText/${encodeURIComponent(instanceName)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: String(config[0].api_key) },
        body: JSON.stringify({ number: phone, text: message, delay: 900, linkPreview: true }),
      },
    );
    if (!response.ok) throw new Error(`Falha ao enviar link: ${response.status}`);
    await admin.from("messages").insert({
      organization_id: organizationId,
      conversation_id: conversation.id,
      role: "system",
      content: message,
      metadata: { channel: "whatsapp", kind: "assistant_handoff_link" },
    });
    return json({ ok: true });
  } catch (error) {
    console.error(error);
    return json({ error: "Falha ao processar webhook" }, 500);
  } finally {
    await sql.end({ timeout: 2 });
  }
});
