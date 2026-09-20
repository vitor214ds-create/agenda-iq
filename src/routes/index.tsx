import { createFileRoute } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Eye,
  EyeOff,
  Home,
  Link2,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  QrCode,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { BrandLogo, BrandMark } from "../components/brand";
import {
  supabase,
  type Appointment,
  type Client,
  type Organization,
  type Professional,
  type Service,
} from "../lib/supabase";

export const Route = createFileRoute("/")({ component: App });
type View = "inicio" | "agenda" | "clientes" | "servicos" | "whatsapp" | "configuracoes";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [login, setLogin] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);
  if (!ready) return <FullLoader />;
  if (session) return <Dashboard session={session} />;
  if (login) return <Login back={() => setLogin(false)} />;
  return <Landing login={() => setLogin(true)} />;
}

function FullLoader() {
  return (
    <main className="full-loader">
      <BrandLogo />
      <LoaderCircle className="spin" />
      <span>Carregando sua conta…</span>
    </main>
  );
}

function Landing({ login }: { login: () => void }) {
  const [menu, setMenu] = useState(false);
  return (
    <main className="landing">
      <nav className="nav container">
        <BrandLogo />
        <div className={`nav__links ${menu ? "is-open" : ""}`}>
          <a href="#como-funciona">Como funciona</a>
          <a href="#recursos">Recursos</a>
          <a href="#preco">Preço</a>
        </div>
        <div className="nav__actions">
          <button className="btn btn--ghost" onClick={login}>
            Entrar
          </button>
          <a className="btn btn--dark" href="#preco">
            Começar agora <ChevronRight size={17} />
          </a>
        </div>
        <button className="nav__menu" aria-label="Abrir menu" onClick={() => setMenu((v) => !v)}>
          {menu ? <X /> : <Menu />}
        </button>
      </nav>
      <section className="hero container">
        <div className="hero__copy">
          <div className="eyebrow">
            <Sparkles size={15} /> Atendimento inteligente, agenda organizada
          </div>
          <h1>
            Transforme conversas em <span>agendamentos confirmados.</span>
          </h1>
          <p>
            O AgendaIQ responde seus clientes, envia o link de atendimento, encontra horários livres
            e confirma tudo automaticamente pelo WhatsApp.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary btn--lg" href="#preco">
              Assinar por R$ 49,90 <ChevronRight />
            </a>
            <button className="btn btn--soft btn--lg" onClick={login}>
              <LockKeyhole /> Já sou cliente
            </button>
          </div>
          <div className="hero__trust">
            <span>
              <CheckCircle2 /> Sem fidelidade
            </span>
            <span>
              <CheckCircle2 /> Dados protegidos
            </span>
            <span>
              <CheckCircle2 /> Configuração guiada
            </span>
          </div>
        </div>
        <div className="hero__visual">
          <div className="orbit orbit--one" />
          <div className="orbit orbit--two" />
          <div className="phone-card">
            <div className="phone-card__top">
              <span>9:41</span>
              <span>● ● ●</span>
            </div>
            <div className="wa-head">
              <div className="mini-logo">
                <BrandMark />
              </div>
              <div>
                <strong>Seu negócio</strong>
                <small>online agora</small>
              </div>
            </div>
            <div className="chat-wall">
              <div className="bubble bubble--in">Olá! Gostaria de agendar um horário.</div>
              <div className="bubble bubble--out">
                Olá! 👋 Vou te ajudar. Acesse seu atendimento e escolha o melhor horário:
              </div>
              <div className="booking-link">
                <CalendarDays />
                <span>
                  <strong>Escolher meu horário</strong>
                  <small>Atendimento seguro AgendaIQ</small>
                </span>
                <ChevronRight />
              </div>
              <div className="bubble bubble--out">
                <strong>Tudo certo!</strong>
                <br />
                Seu horário foi confirmado. ✅
              </div>
            </div>
          </div>
          <div className="float-card float-card--top">
            <span className="status-pulse" />
            <div>
              <strong>IA atendendo agora</strong>
              <small>24 horas por dia</small>
            </div>
          </div>
        </div>
      </section>
      <section id="como-funciona" className="section container">
        <SectionTitle label="FLUXO AUTOMÁTICO" title="Do primeiro olá ao horário confirmado." />
        <div className="steps">
          {[
            [MessageCircle, "Mensagem recebida", "O cliente chama no WhatsApp."],
            [Link2, "Link inteligente", "O AgendaIQ envia o atendimento."],
            [Bot, "Escolha assistida", "A IA consulta horários reais."],
            [CheckCircle2, "Confirmação", "Tudo entra na agenda."],
          ].map(([Icon, title, text], i) => (
            <article className="step-card" key={String(title)}>
              <div className="step-card__number">0{i + 1}</div>
              <div className="step-card__icon">
                <Icon />
              </div>
              <h3>{String(title)}</h3>
              <p>{String(text)}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="recursos" className="section section--ink">
        <div className="container feature-stage">
          <div className="feature-stage__copy">
            <span className="overline">OPERAÇÃO COMPLETA</span>
            <h2>Agenda, clientes e WhatsApp em um só lugar.</h2>
            <p>
              Gerencie serviços, profissionais e horários com dados em tempo real e isolamento
              seguro entre empresas.
            </p>
          </div>
          <div className="feature-grid">
            {[
              [CalendarDays, "Agenda real"],
              [Bot, "IA de atendimento"],
              [Smartphone, "WhatsApp oficial"],
              [ShieldCheck, "Acesso protegido"],
            ].map(([Icon, t]) => (
              <div className="mini-feature" key={String(t)}>
                <Icon />
                <strong>{String(t)}</strong>
                <Check />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="preco" className="section container pricing-wrap">
        <SectionTitle label="PLANO SIMPLES" title="Tudo por R$ 49,90 por mês." />
        <div className="price-card">
          <span>AgendaIQ Essencial</span>
          <strong>
            <small>R$</small> 49,90<small>/mês</small>
          </strong>
          <ul>
            <li>
              <Check />
              Agenda online
            </li>
            <li>
              <Check />
              Clientes e serviços
            </li>
            <li>
              <Check />
              Atendimento com IA
            </li>
            <li>
              <Check />
              Integração WhatsApp
            </li>
          </ul>
          <button
            className="btn btn--primary btn--lg"
            onClick={() => toast.info("O checkout Cakto será conectado na próxima etapa.")}
          >
            Quero contratar <ChevronRight />
          </button>
          <small>Checkout Cakto será conectado antes da abertura das vendas.</small>
        </div>
      </section>
      <footer>
        <div className="container">
          <BrandLogo />
          <span>© 2026 AgendaIQ. Todos os direitos reservados.</span>
          <button className="btn btn--ghost" onClick={login}>
            Entrar
          </button>
        </div>
      </footer>
    </main>
  );
}
function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className="section-title">
      <span>{label}</span>
      <h2>{title}</h2>
    </div>
  );
}

function Login({ back }: { back: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error)
      toast.error(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : "Não foi possível entrar. Tente novamente.",
      );
  }
  async function reset() {
    if (!email.trim()) return toast.error("Digite seu e-mail primeiro.");
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin,
    });
    setBusy(false);
    if (error) toast.error("Não foi possível enviar o link.");
    else {
      toast.success("Link de redefinição enviado.");
      setForgot(false);
    }
  }
  return (
    <main className="auth-page">
      <button className="auth-back" onClick={back}>
        ← Voltar
      </button>
      <section className="auth-card">
        <BrandLogo />
        <div>
          <span className="overline">ACESSO SEGURO</span>
          <h1>Entre na sua conta</h1>
          <p>Use o acesso enviado após a confirmação da sua assinatura.</p>
        </div>
        <form onSubmit={submit}>
          <label>
            E-mail
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@empresa.com.br"
            />
          </label>
          <label>
            Senha
            <div className="password-field">
              <input
                type={show ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
              />
              <button type="button" aria-label="Mostrar senha" onClick={() => setShow((v) => !v)}>
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>
          <button type="button" className="text-button" onClick={() => setForgot((v) => !v)}>
            Esqueci minha senha
          </button>
          {forgot && (
            <button type="button" className="btn btn--soft" onClick={reset}>
              Enviar link de redefinição
            </button>
          )}
          <button className="btn btn--primary btn--lg" disabled={busy}>
            {busy ? <LoaderCircle className="spin" /> : <LockKeyhole />}
            {busy ? "Entrando…" : "Entrar no AgendaIQ"}
          </button>
        </form>
        <div className="auth-security">
          <ShieldCheck />
          <span>Conexão segura. Não há conta de demonstração ou senha pública.</span>
        </div>
      </section>
    </main>
  );
}

function Dashboard({ session }: { session: Session }) {
  const [view, setView] = useState<View>("inicio"),
    [mobile, setMobile] = useState(false),
    [loading, setLoading] = useState(true),
    [org, setOrg] = useState<Organization | null>(null),
    [services, setServices] = useState<Service[]>([]),
    [professionals, setProfessionals] = useState<Professional[]>([]),
    [clients, setClients] = useState<Client[]>([]),
    [appointments, setAppointments] = useState<Appointment[]>([]),
    [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data: member, error: memberError } = await supabase
      .from("organization_members")
      .select("organization_id, organizations(*)")
      .eq("user_id", session.user.id)
      .limit(1)
      .maybeSingle();
    if (memberError || !member) {
      setLoading(false);
      setError(
        "Sua conta ainda não está vinculada a uma empresa. O acesso precisa ser liberado após o pagamento.",
      );
      return;
    }
    const organization = (
      Array.isArray(member.organizations) ? member.organizations[0] : member.organizations
    ) as Organization;
    setOrg(organization);
    const id = member.organization_id;
    const [s, p, c, a] = await Promise.all([
      supabase.from("services").select("*").eq("organization_id", id).order("name"),
      supabase.from("professionals").select("*").eq("organization_id", id).order("name"),
      supabase
        .from("clients")
        .select("*")
        .eq("organization_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("appointments")
        .select("*,clients(name,phone),services(name),professionals(name)")
        .eq("organization_id", id)
        .order("starts_at"),
    ]);
    if ([s.error, p.error, c.error, a.error].some(Boolean))
      setError("Não foi possível carregar todos os dados. Atualize a página.");
    setServices((s.data || []) as Service[]);
    setProfessionals((p.data || []) as Professional[]);
    setClients((c.data || []) as Client[]);
    setAppointments((a.data || []) as Appointment[]);
    setLoading(false);
  }, [session.user.id]);
  useEffect(() => {
    void load();
  }, [load]);
  if (loading) return <FullLoader />;
  if (error && !org)
    return (
      <main className="empty-account">
        <BrandLogo />
        <ShieldCheck />
        <h1>Acesso protegido</h1>
        <p>{error}</p>
        <button className="btn btn--soft" onClick={() => supabase.auth.signOut()}>
          Sair
        </button>
      </main>
    );
  const nav: Array<[View, typeof Home, string]> = [
    ["inicio", Home, "Início"],
    ["agenda", CalendarDays, "Agenda"],
    ["clientes", Users, "Clientes"],
    ["servicos", Sparkles, "Serviços"],
    ["whatsapp", Smartphone, "WhatsApp"],
    ["configuracoes", Settings, "Configurações"],
  ];
  return (
    <main className="dashboard">
      <aside className={`sidebar ${mobile ? "is-open" : ""}`}>
        <div className="sidebar__brand">
          <BrandLogo />
          <button onClick={() => setMobile(false)}>
            <X />
          </button>
        </div>
        <nav>
          {nav.map(([key, Icon, label]) => (
            <button
              key={key}
              className={view === key ? "active" : ""}
              onClick={() => {
                setView(key);
                setMobile(false);
              }}
            >
              <Icon />
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar__footer">
          <div className="account-chip">
            <div>{org?.name?.slice(0, 2).toUpperCase()}</div>
            <span>
              <strong>{org?.name}</strong>
              <small>{session.user.email}</small>
            </span>
          </div>
          <button onClick={() => supabase.auth.signOut()}>
            <LogOut /> Sair
          </button>
        </div>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <button className="mobile-trigger" onClick={() => setMobile(true)}>
            <Menu />
          </button>
          <div>
            <span className="overline">AGENDAIQ</span>
            <h1>{nav.find((n) => n[0] === view)?.[2]}</h1>
          </div>
          <button className="icon-btn" aria-label="Atualizar" onClick={() => void load()}>
            <RefreshCw />
          </button>
        </header>
        {error && <div className="inline-error">{error}</div>}
        <div className="workspace__body">
          {view === "inicio" && (
            <Overview
              org={org!}
              appointments={appointments}
              clients={clients}
              services={services}
            />
          )}{" "}
          {view === "agenda" && (
            <Agenda
              org={org!}
              appointments={appointments}
              clients={clients}
              services={services}
              professionals={professionals}
              reload={load}
            />
          )}{" "}
          {view === "clientes" && <Clients org={org!} items={clients} reload={load} />}{" "}
          {view === "servicos" && (
            <Services org={org!} items={services} professionals={professionals} reload={load} />
          )}{" "}
          {view === "whatsapp" && <WhatsApp org={org!} />}{" "}
          {view === "configuracoes" && <Configuration org={org!} reload={load} />}
        </div>
      </section>
    </main>
  );
}

function Overview({
  org,
  appointments,
  clients,
  services,
}: {
  org: Organization;
  appointments: Appointment[];
  clients: Client[];
  services: Service[];
}) {
  const today = new Date().toDateString(),
    todayItems = appointments.filter(
      (a) => new Date(a.starts_at).toDateString() === today && a.status !== "cancelado",
    );
  return (
    <>
      <div className="welcome">
        <div>
          <span className="eyebrow">
            <Sparkles /> Operação em tempo real
          </span>
          <h2>Olá! Sua agenda está pronta.</h2>
          <p>Todos os números abaixo vêm diretamente da sua conta.</p>
        </div>
        <div className="live-pill">
          <span />
          Dados sincronizados
        </div>
      </div>
      <div className="stats">
        <Stat icon={CalendarDays} label="Hoje" value={todayItems.length} />
        <Stat icon={Users} label="Clientes" value={clients.length} />
        <Stat
          icon={Sparkles}
          label="Serviços ativos"
          value={services.filter((s) => s.is_active).length}
        />
        <Stat
          icon={Bot}
          label="Agendados pela IA"
          value={appointments.filter((a) => a.created_by_ai).length}
        />
      </div>
      <div className="panel">
        <div className="panel__head">
          <div>
            <span>PRÓXIMOS HORÁRIOS</span>
            <h3>Agenda de hoje</h3>
          </div>
        </div>
        {todayItems.length ? (
          <div className="rows">
            {todayItems.slice(0, 6).map((a) => (
              <AppointmentRow key={a.id} item={a} />
            ))}
          </div>
        ) : (
          <Empty
            icon={CalendarDays}
            title="Nenhum horário para hoje"
            text={`A agenda da ${org.name} está livre hoje.`}
          />
        )}
      </div>
    </>
  );
}
function Stat({ icon: Icon, label, value }: { icon: typeof Home; label: string; value: number }) {
  return (
    <div className="stat">
      <div>
        <Icon />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function AppointmentRow({ item }: { item: Appointment }) {
  return (
    <div className="data-row">
      <div className="time-block">
        <strong>
          {new Date(item.starts_at).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </strong>
        <small>{new Date(item.starts_at).toLocaleDateString("pt-BR")}</small>
      </div>
      <div>
        <strong>{item.clients?.name || "Cliente"}</strong>
        <small>
          {item.services?.name || "Serviço"} · {item.professionals?.name || "Profissional"}
        </small>
      </div>
      <span className={`status status--${item.status}`}>{item.status}</span>
    </div>
  );
}

function Agenda({
  org,
  appointments,
  clients,
  services,
  professionals,
  reload,
}: {
  org: Organization;
  appointments: Appointment[];
  clients: Client[];
  services: Service[];
  professionals: Professional[];
  reload: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false);
  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      service = services.find((s) => s.id === f.get("service_id"));
    if (!service) return;
    const start = new Date(String(f.get("starts_at")));
    setBusy(true);
    const { error } = await supabase.from("appointments").insert({
      organization_id: org.id,
      client_id: f.get("client_id"),
      service_id: service.id,
      professional_id: f.get("professional_id") || null,
      starts_at: start.toISOString(),
      ends_at: new Date(start.getTime() + service.duration_minutes * 60000).toISOString(),
      status: "agendado",
      notes: String(f.get("notes") || ""),
    });
    setBusy(false);
    if (error) toast.error("Não foi possível criar. Verifique conflito de horário.");
    else {
      toast.success("Agendamento criado.");
      setOpen(false);
      await reload();
    }
  }
  async function cancel(id: string) {
    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelado" })
      .eq("id", id);
    if (error) toast.error("Não foi possível cancelar.");
    else await reload();
  }
  return (
    <>
      <PageHead
        title="Agenda"
        text="Crie e acompanhe compromissos reais."
        action={
          <button className="btn btn--primary" onClick={() => setOpen((v) => !v)}>
            <Plus />
            Novo agendamento
          </button>
        }
      />
      {open && (
        <form className="editor" onSubmit={add}>
          <Select
            name="client_id"
            label="Cliente"
            required
            items={clients.map((x) => [x.id, x.name])}
          />
          <Select
            name="service_id"
            label="Serviço"
            required
            items={services.filter((x) => x.is_active).map((x) => [x.id, x.name])}
          />
          <Select
            name="professional_id"
            label="Profissional"
            required
            items={professionals.filter((x) => x.is_active).map((x) => [x.id, x.name])}
          />
          <label>
            Data e hora
            <input name="starts_at" type="datetime-local" required />
          </label>
          <label>
            Observação
            <input name="notes" placeholder="Opcional" />
          </label>
          <button className="btn btn--primary" disabled={busy}>
            <Save />
            {busy ? "Salvando…" : "Salvar"}
          </button>
        </form>
      )}
      <div className="panel">
        {appointments.length ? (
          <div className="rows">
            {appointments.map((a) => (
              <div className="row-actions" key={a.id}>
                <AppointmentRow item={a} />
                {a.status !== "cancelado" && (
                  <button
                    className="icon-btn danger"
                    title="Cancelar"
                    onClick={() => void cancel(a.id)}
                  >
                    <X />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Empty icon={CalendarDays} title="Agenda vazia" text="Cadastre o primeiro agendamento." />
        )}
      </div>
    </>
  );
}

function Clients({
  org,
  items,
  reload,
}: {
  org: Organization;
  items: Client[];
  reload: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const { error } = await supabase.from("clients").insert({
      organization_id: org.id,
      name: f.get("name"),
      phone: f.get("phone") || null,
      email: f.get("email") || null,
    });
    if (error) toast.error("Não foi possível cadastrar o cliente.");
    else {
      toast.success("Cliente cadastrado.");
      setOpen(false);
      await reload();
    }
  }
  return (
    <>
      <PageHead
        title="Clientes"
        text="Base atualizada em tempo real."
        action={
          <button className="btn btn--primary" onClick={() => setOpen((v) => !v)}>
            <Plus />
            Novo cliente
          </button>
        }
      />
      {open && (
        <form className="editor" onSubmit={add}>
          <label>
            Nome
            <input name="name" required />
          </label>
          <label>
            WhatsApp
            <input name="phone" inputMode="tel" placeholder="5511999999999" />
          </label>
          <label>
            E-mail
            <input name="email" type="email" />
          </label>
          <button className="btn btn--primary">
            <Save />
            Salvar
          </button>
        </form>
      )}
      <div className="panel">
        <div className="table-head">
          <span>Cliente</span>
          <span>Contato</span>
          <span>Status</span>
        </div>
        {items.map((x) => (
          <div className="table-line" key={x.id}>
            <strong>{x.name}</strong>
            <span>{x.phone || x.email || "Não informado"}</span>
            <span className="status">{x.status}</span>
          </div>
        ))}
        {!items.length && (
          <Empty
            icon={Users}
            title="Nenhum cliente"
            text="Os clientes criados pelo WhatsApp e pela agenda aparecerão aqui."
          />
        )}
      </div>
    </>
  );
}

function Services({
  org,
  items,
  professionals,
  reload,
}: {
  org: Organization;
  items: Service[];
  professionals: Professional[];
  reload: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const { error } = await supabase.from("services").insert({
      organization_id: org.id,
      name: f.get("name"),
      description: f.get("description") || null,
      duration_minutes: Number(f.get("duration")),
      price_cents: Math.round(Number(f.get("price")) * 100),
      professional_id: f.get("professional_id") || null,
    });
    if (error) toast.error("Não foi possível salvar o serviço.");
    else {
      toast.success("Serviço salvo.");
      setOpen(false);
      await reload();
    }
  }
  async function remove(id: string) {
    const { error } = await supabase.from("services").update({ is_active: false }).eq("id", id);
    if (error) toast.error("Não foi possível desativar.");
    else await reload();
  }
  return (
    <>
      <PageHead
        title="Serviços"
        text="A IA usa estes dados para orientar seus clientes."
        action={
          <button className="btn btn--primary" onClick={() => setOpen((v) => !v)}>
            <Plus />
            Novo serviço
          </button>
        }
      />
      {open && (
        <form className="editor" onSubmit={add}>
          <label>
            Nome
            <input name="name" required />
          </label>
          <label>
            Preço (R$)
            <input name="price" type="number" min="0" step="0.01" required />
          </label>
          <label>
            Duração (min)
            <input name="duration" type="number" min="5" step="5" defaultValue="30" required />
          </label>
          <Select
            name="professional_id"
            label="Profissional"
            items={professionals.map((x) => [x.id, x.name])}
          />
          <label className="wide">
            Descrição
            <input name="description" />
          </label>
          <button className="btn btn--primary">
            <Save />
            Salvar
          </button>
        </form>
      )}
      <div className="cards-grid">
        {items.map((x) => (
          <article className={`service-card ${!x.is_active ? "muted" : ""}`} key={x.id}>
            <div>
              <Sparkles />
              <span className="status">{x.is_active ? "Ativo" : "Inativo"}</span>
            </div>
            <h3>{x.name}</h3>
            <p>{x.description || "Sem descrição"}</p>
            <footer>
              <strong>
                {(x.price_cents / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
              <span>
                <Clock3 />
                {x.duration_minutes} min
              </span>
              {x.is_active && (
                <button
                  className="icon-btn danger"
                  title="Desativar"
                  onClick={() => void remove(x.id)}
                >
                  <Trash2 />
                </button>
              )}
            </footer>
          </article>
        ))}
      </div>
    </>
  );
}

type WhatsAppAccount = {
  id: string;
  phone: string | null;
  internal_name: string | null;
  connection_status: string | null;
};

function WhatsApp({ org }: { org: Organization }) {
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]),
    [configured, setConfigured] = useState(false),
    [busy, setBusy] = useState(true),
    [setup, setSetup] = useState(false),
    [method, setMethod] = useState<"qr" | "code">("qr"),
    [qrCode, setQrCode] = useState<string | null>(null),
    [pairingCode, setPairingCode] = useState<string | null>(null),
    [activeAccount, setActiveAccount] = useState<string | null>(null);
  const call = useCallback(
    async (action: string, extra = {}) => {
      setBusy(true);
      const { data, error } = await supabase.functions.invoke("evolution-manager", {
        body: { action, organizationId: org.id, ...extra },
      });
      setBusy(false);
      if (error || data?.error) {
        toast.error(data?.error || "Falha na integração.");
        return null;
      }
      if (action === "status") {
        setAccounts(data.accounts || []);
        setConfigured(Boolean(data.configured));
      }
      return data;
    },
    [org.id],
  );
  useEffect(() => {
    void call("status");
  }, [call]);
  async function configure(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = await call("configure", {
      baseUrl: f.get("baseUrl"),
      apiKey: f.get("apiKey"),
      publicBaseUrl: window.location.origin,
    });
    if (data) {
      setConfigured(true);
      toast.success("Servidor Evolution validado e protegido.");
    }
  }
  async function connect(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = await call("connect", {
      name: f.get("name"),
      phone: method === "code" ? f.get("phone") : "",
    });
    if (data) {
      setActiveAccount(data.accountId);
      setQrCode(data.qrCode);
      setPairingCode(data.pairingCode);
      toast.success(method === "qr" ? "QR Code gerado." : "Código de pareamento gerado.");
      await call("status");
    }
  }
  async function refresh(accountId: string) {
    const data = await call("refresh", { accountId });
    if (data?.state === "CONNECTED") toast.success("WhatsApp conectado com sucesso.");
    await call("status");
  }
  async function disconnect(accountId: string) {
    if (await call("disconnect", { accountId })) {
      toast.success("WhatsApp desconectado.");
      await call("status");
    }
  }
  const connected = accounts.find((item) => item.connection_status === "CONNECTED");
  return (
    <>
      <PageHead title="WhatsApp" text="Conecte pelo QR Code ou pelo código exibido no celular." />
      <div className="connection-card">
        <div className={`connection-icon ${connected ? "ok" : ""}`}>
          <Wifi />
        </div>
        <div>
          <span className="overline">STATUS DA CONEXÃO</span>
          <h2>{busy ? "Verificando…" : connected ? "WhatsApp conectado" : "Aguardando conexão"}</h2>
          <p>
            {connected
              ? `${connected.internal_name || "WhatsApp principal"}${connected.phone ? ` · +${connected.phone}` : ""}`
              : "Escaneie o QR Code ou use o código de pareamento para ativar as respostas automáticas."}
          </p>
        </div>
        <div className="connection-actions">
          {connected ? (
            <>
              <span className="live-pill">
                <span />
                Online
              </span>
              <button className="btn btn--soft" onClick={() => void disconnect(connected.id)}>
                Desconectar
              </button>
            </>
          ) : (
            <button className="btn btn--primary" onClick={() => setSetup((v) => !v)}>
              <Smartphone />
              Conectar WhatsApp
            </button>
          )}
        </div>
      </div>
      {setup && !configured && (
        <form className="editor whatsapp-form" onSubmit={configure}>
          <div className="wide setup-note">
            <ShieldCheck />
            <span>
              Configuração única do servidor Evolution. A chave fica criptografada no Vault e nunca
              é devolvida ao navegador.
            </span>
          </div>
          <label>
            URL HTTPS da Evolution API
            <input
              name="baseUrl"
              type="url"
              placeholder="https://evolution.seudominio.com"
              required
            />
          </label>
          <label>
            API Key global
            <input name="apiKey" type="password" required />
          </label>
          <button className="btn btn--primary" disabled={busy}>
            <Wifi />
            {busy ? "Validando…" : "Salvar servidor"}
          </button>
        </form>
      )}
      {setup && configured && !qrCode && !pairingCode && (
        <form className="editor whatsapp-form" onSubmit={connect}>
          <div className="wide connect-tabs">
            <button
              type="button"
              className={method === "qr" ? "active" : ""}
              onClick={() => setMethod("qr")}
            >
              <QrCode />
              QR Code
            </button>
            <button
              type="button"
              className={method === "code" ? "active" : ""}
              onClick={() => setMethod("code")}
            >
              <Smartphone />
              Código no celular
            </button>
          </div>
          <label>
            Nome da conexão
            <input name="name" defaultValue="WhatsApp principal" required />
          </label>
          {method === "code" && (
            <label>
              Número com DDD
              <input name="phone" inputMode="tel" placeholder="5511999999999" required />
            </label>
          )}
          <button className="btn btn--primary" disabled={busy}>
            {method === "qr" ? <QrCode /> : <Smartphone />}
            {busy ? "Gerando…" : "Gerar conexão"}
          </button>
        </form>
      )}
      {(qrCode || pairingCode) && (
        <div className="pairing-panel">
          <span className="overline">CONECTE AGORA</span>
          {qrCode && (
            <img
              src={qrCode.startsWith("data:") ? qrCode : `data:image/png;base64,${qrCode}`}
              alt="QR Code real para conectar o WhatsApp"
            />
          )}
          {pairingCode && (
            <>
              <p>No WhatsApp, abra Aparelhos conectados → Conectar com número de telefone.</p>
              <strong>{pairingCode}</strong>
            </>
          )}
          <p>Depois de concluir no celular, confirme o status.</p>
          <button
            className="btn btn--primary"
            onClick={() => activeAccount && void refresh(activeAccount)}
          >
            <RefreshCw />
            Já conectei
          </button>
        </div>
      )}
      {accounts
        .filter((a) => a.connection_status !== "CONNECTED")
        .map((account) => (
          <div className="session-row" key={account.id}>
            <span>
              <strong>{account.internal_name || "WhatsApp"}</strong>
              <small>{account.connection_status || "DISCONNECTED"}</small>
            </span>
            <button className="btn btn--soft" onClick={() => void refresh(account.id)}>
              <RefreshCw />
              Verificar
            </button>
          </div>
        ))}
      <div className="info-grid">
        <article>
          <ShieldCheck />
          <h3>Integração real</h3>
          <p>
            A sessão Evolution fica isolada por empresa e o acesso ao gateway permanece no Vault.
          </p>
        </article>
        <article>
          <Link2 />
          <h3>Link automático</h3>
          <p>Ao receber uma mensagem, o webhook envia o link individual do atendimento.</p>
        </article>
        <article>
          <Bot />
          <h3>IA + agenda</h3>
          <p>A conversa usa serviços, profissionais e disponibilidade reais da sua empresa.</p>
        </article>
      </div>
      <div className="notice">
        <strong>Conexão não oficial</strong>
        <p>
          Essa modalidade depende do WhatsApp Web e pode desconectar ou sofrer bloqueio. Use um
          número dedicado, evite disparos em massa e mantenha consentimento dos contatos.
        </p>
      </div>
    </>
  );
}

function Configuration({ org, reload }: { org: Organization; reload: () => Promise<void> }) {
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      slug = String(f.get("slug"))
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "-");
    const { error } = await supabase
      .from("organizations")
      .update({
        name: f.get("name"),
        slug,
        phone: f.get("phone") || null,
        email: f.get("email") || null,
        description: f.get("description") || null,
        onboarding_completed: true,
      })
      .eq("id", org.id);
    if (error) toast.error("Não foi possível salvar. O endereço pode já estar em uso.");
    else {
      toast.success("Configurações salvas.");
      await reload();
    }
  }
  return (
    <>
      <PageHead title="Configurações" text="Dados usados na página pública e pela IA." />
      <form className="settings-card" onSubmit={save}>
        <label>
          Nome da empresa
          <input name="name" defaultValue={org.name} required />
        </label>
        <label>
          Endereço público
          <input name="slug" defaultValue={org.slug || ""} required />
          <small>Use letras, números e hífen.</small>
        </label>
        <label>
          Telefone
          <input name="phone" defaultValue={org.phone || ""} />
        </label>
        <label>
          E-mail
          <input name="email" type="email" defaultValue={org.email || ""} />
        </label>
        <label className="wide">
          Descrição
          <textarea name="description" defaultValue={org.description || ""} />
        </label>
        <button className="btn btn--primary">
          <Save />
          Salvar alterações
        </button>
        {org.slug && (
          <a className="btn btn--soft" href={`/chat/${org.slug}`} target="_blank" rel="noreferrer">
            <ExternalLink />
            Abrir atendimento público
          </a>
        )}
      </form>
    </>
  );
}

function PageHead({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      {action}
    </div>
  );
}
function Empty({ icon: Icon, title, text }: { icon: typeof Home; title: string; text: string }) {
  return (
    <div className="empty">
      <Icon />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
function Select({
  name,
  label,
  items,
  required = false,
}: {
  name: string;
  label: string;
  items: Array<[string, string]>;
  required?: boolean;
}) {
  return (
    <label>
      {label}
      <select name={name} required={required}>
        <option value="">Selecione</option>
        {items.map(([id, text]) => (
          <option value={id} key={id}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}
