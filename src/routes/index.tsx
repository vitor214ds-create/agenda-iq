import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  CreditCard,
  ExternalLink,
  Eye,
  EyeOff,
  Home,
  Link2,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Plus,
  QrCode,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  UserRound,
  WandSparkles,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { BrandLogo, BrandMark, Mascot } from "../components/brand";
import {
  appointments,
  conversations,
  demoCredentials,
  services,
  timeSlots,
  weekDays,
} from "../data/demo";

export const Route = createFileRoute("/")({ component: App });
type Screen = "landing" | "login" | "dashboard" | "booking";
type View =
  | "inicio"
  | "agenda"
  | "conversas"
  | "clientes"
  | "servicos"
  | "whatsapp"
  | "relatorios"
  | "configuracoes";

function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  return (
    <main className="app-shell">
      {screen === "landing" && <Landing go={setScreen} />}
      {screen === "login" && (
        <Login back={() => setScreen("landing")} success={() => setScreen("dashboard")} />
      )}
      {screen === "dashboard" && (
        <Dashboard exit={() => setScreen("landing")} booking={() => setScreen("booking")} />
      )}
      {screen === "booking" && <Booking back={() => setScreen("landing")} />}
    </main>
  );
}

function Landing({ go }: { go: (s: Screen) => void }) {
  const [menu, setMenu] = useState(false);
  return (
    <div className="landing">
      <nav className="nav container">
        <BrandLogo />
        <div className={`nav__links ${menu ? "is-open" : ""}`}>
          <a href="#como-funciona">Como funciona</a>
          <a href="#recursos">Recursos</a>
          <a href="#preco">Preço</a>
          <button className="btn btn--ghost mobile-only" onClick={() => go("login")}>
            Entrar
          </button>
        </div>
        <div className="nav__actions">
          <button className="btn btn--ghost" onClick={() => go("login")}>
            Entrar
          </button>
          <button className="btn btn--dark" onClick={() => go("dashboard")}>
            Ver demonstração <ArrowRight size={16} />
          </button>
        </div>
        <button className="nav__menu" onClick={() => setMenu(!menu)}>
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
            O AgendaIQ responde seus clientes, envia o link de agendamento, organiza horários e
            confirma tudo automaticamente pelo WhatsApp.
          </p>
          <div className="hero__actions">
            <button className="btn btn--primary btn--lg" onClick={() => go("dashboard")}>
              Experimentar o AgendaIQ <ArrowRight />
            </button>
            <button className="btn btn--soft btn--lg" onClick={() => go("booking")}>
              <CalendarDays /> Testar agendamento
            </button>
          </div>
          <div className="hero__trust">
            <span>
              <CheckCircle2 /> 7 dias grátis
            </span>
            <span>
              <CheckCircle2 /> Sem fidelidade
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
                <strong>Studio Atlas</strong>
                <small>online agora</small>
              </div>
              <MoreHorizontal />
            </div>
            <div className="chat-wall">
              <div className="bubble bubble--in">
                Olá! Gostaria de agendar um corte para amanhã.
              </div>
              <div className="bubble bubble--out">
                Oi, Lucas! 👋 Encontrei os horários disponíveis para você. Toque no link para
                escolher:
              </div>
              <button className="booking-link" onClick={() => go("booking")}>
                <CalendarDays />
                <span>
                  <strong>Escolher meu horário</strong>
                  <small>agendaiq.com.br/studio-atlas</small>
                </span>
                <ChevronRight />
              </button>
              <div className="bubble bubble--in bubble--short">Agendado! ✅</div>
              <div className="bubble bubble--out">
                <strong>Tudo certo!</strong>
                <br />
                Seu Corte + Barba está confirmado para amanhã, às 10h.
              </div>
            </div>
          </div>
          <div className="float-card float-card--top">
            <span className="status-pulse" />
            <div>
              <strong>IA atendendo agora</strong>
              <small>Resposta em 3 segundos</small>
            </div>
          </div>
          <div className="float-card float-card--bottom">
            <CheckCircle2 />
            <div>
              <strong>+32 agendamentos</strong>
              <small>esta semana</small>
            </div>
          </div>
        </div>
      </section>
      <section className="social-proof">
        <div className="container proof-grid">
          <div>
            <strong>24h</strong>
            <span>atendendo por você</span>
          </div>
          <div>
            <strong>3s</strong>
            <span>tempo médio de resposta</span>
          </div>
          <div>
            <strong>+38%</strong>
            <span>mais horários preenchidos</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>responsivo e online</span>
          </div>
        </div>
      </section>
      <section id="como-funciona" className="section container">
        <Title
          eyebrow="FLUXO AUTOMÁTICO"
          title="Do primeiro “olá” ao horário confirmado."
          text="Uma experiência simples para o cliente e uma operação muito mais leve para sua equipe."
        />
        <div className="steps">
          {[
            [
              MessageCircle,
              "Mensagem recebida",
              "O cliente chama sua empresa no WhatsApp normalmente.",
            ],
            [Link2, "Link inteligente", "O AgendaIQ responde e envia o seu link personalizado."],
            [
              Bot,
              "Escolha assistida",
              "A IA tira dúvidas e apresenta apenas horários realmente livres.",
            ],
            [
              CheckCircle2,
              "Tudo confirmado",
              "O horário entra na agenda e o cliente recebe a confirmação.",
            ],
          ].map(([Icon, t, p], i) => (
            <div className="step-card" key={String(t)}>
              <div className="step-card__number">0{i + 1}</div>
              <div className="step-card__icon">
                <Icon />
              </div>
              <h3>{String(t)}</h3>
              <p>{String(p)}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="recursos" className="section section--ink">
        <div className="container feature-stage">
          <div className="feature-stage__copy">
            <span className="overline">FEITO PARA GANHAR TEMPO</span>
            <h2>Menos mensagens repetidas. Mais clientes atendidos.</h2>
            <p>
              Centralize sua agenda, equipe, serviços e conversas em um único lugar — com
              inteligência que trabalha junto com você.
            </p>
            <div className="feature-list">
              {[
                ["Agenda em tempo real", "Sem horários duplicados ou conflitos."],
                ["Atendimento com IA", "Respostas baseadas nas informações da sua empresa."],
                ["WhatsApp conectado", "QR Code no computador ou código pelo celular."],
                ["Lembretes automáticos", "Reduza faltas sem trabalho manual."],
              ].map((x) => (
                <div key={x[0]}>
                  <Check />
                  <span>
                    <strong>{x[0]}</strong>
                    <small>{x[1]}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <DashboardPreview />
        </div>
      </section>
      <section id="preco" className="section container price-section">
        <div className="price-copy">
          <span className="overline">PREÇO SIMPLES</span>
          <h2>Tudo o que você precisa por menos de dois reais por dia.</h2>
          <p>Comece com sete dias gratuitos. Cancele quando quiser.</p>
        </div>
        <div className="price-card">
          <div className="price-card__badge">PLANO COMPLETO</div>
          <BrandMark />
          <h3>AgendaIQ Profissional</h3>
          <div className="price">
            <sup>R$</sup>
            <strong>49</strong>
            <span>
              ,90
              <br />
              <small>/mês</small>
            </span>
          </div>
          <ul>
            {[
              "Agenda online completa",
              "Atendimento inteligente",
              "Link personalizado",
              "Conexão com WhatsApp",
              "Clientes e serviços ilimitados",
              "Relatórios essenciais",
            ].map((x) => (
              <li key={x}>
                <Check /> {x}
              </li>
            ))}
          </ul>
          <button className="btn btn--primary btn--lg" onClick={() => go("dashboard")}>
            Começar gratuitamente <ArrowRight />
          </button>
        </div>
      </section>
      <section className="cta">
        <Mascot className="cta__mascot" />
        <div>
          <span>SEU TEMPO, BEM CUIDADO.</span>
          <h2>Sua agenda pode começar a trabalhar por você hoje.</h2>
          <p>Teste o painel completo e veja como o AgendaIQ transforma seu atendimento.</p>
        </div>
        <button className="btn btn--light btn--lg" onClick={() => go("dashboard")}>
          Conhecer por dentro <ArrowRight />
        </button>
      </section>
      <footer className="footer container">
        <BrandLogo />
        <p>Conversas que viram agendamentos.</p>
        <span>© 2026 AgendaIQ</span>
      </footer>
    </div>
  );
}

function Title({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}
function DashboardPreview() {
  return (
    <div className="dashboard-preview">
      <div className="preview-side">
        <BrandLogo compact inverse />
        <Home />
        <CalendarDays />
        <MessageCircle />
        <Users />
        <BarChart3 />
      </div>
      <div className="preview-main">
        <div className="preview-head">
          <div>
            <small>Visão geral</small>
            <h3>Bom dia, Mariana! 👋</h3>
          </div>
          <button>
            <Plus /> Novo agendamento
          </button>
        </div>
        <div className="preview-stats">
          <div>
            <span>Hoje</span>
            <strong>12</strong>
            <small>+3 que ontem</small>
          </div>
          <div>
            <span>Confirmados</span>
            <strong>10</strong>
            <small>83% da agenda</small>
          </div>
          <div>
            <span>Conversão da IA</span>
            <strong>78%</strong>
            <small>+12% no mês</small>
          </div>
        </div>
        <div className="preview-chart">
          <div className="chart-title">
            <strong>Agendamentos</strong>
            <span>Últimos 7 dias</span>
          </div>
          <div className="bars">
            {[38, 64, 50, 82, 70, 94, 72].map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Login({ back, success }: { back: () => void; success: () => void }) {
  const [email, setEmail] = useState(demoCredentials.email);
  const [password, setPassword] = useState(demoCredentials.password);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === demoCredentials.email && password === demoCredentials.password) {
      success();
      return;
    }
    setError("Use os dados da conta demonstrativa exibidos abaixo.");
  };
  return (
    <div className="auth-page">
      <button className="back-button" onClick={back}>
        <ArrowLeft /> Voltar ao site
      </button>
      <div className="auth-art">
        <BrandLogo inverse />
        <div className="auth-quote">
          <Mascot className="auth-mascot" />
          <span>CONVERSAS QUE VIRAM AGENDAMENTOS</span>
          <h2>Bem-vindo ao futuro do seu atendimento.</h2>
          <p>Organize sua operação e deixe a IA cuidar das tarefas repetitivas.</p>
        </div>
      </div>
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <div className="mobile-brand">
            <BrandLogo />
          </div>
          <span className="overline">ÁREA DO CLIENTE</span>
          <h1>Acesse sua conta</h1>
          <p>Entre para acompanhar sua agenda e seus atendimentos.</p>
          <label>
            E-mail
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </label>
          <label>
            Senha
            <div className="password-field">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={show ? "text" : "password"}
              />
              <button type="button" onClick={() => setShow(!show)}>
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>
          {error && <div className="form-error">{error}</div>}
          <button className="btn btn--primary btn--lg">
            Entrar no AgendaIQ <ArrowRight />
          </button>
          <div className="demo-box">
            <span>CONTA DE DEMONSTRAÇÃO</span>
            <div>
              <code>{demoCredentials.email}</code>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(demoCredentials.email)}
              >
                <Copy />
              </button>
            </div>
            <div>
              <code>{demoCredentials.password}</code>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(demoCredentials.password)}
              >
                <Copy />
              </button>
            </div>
          </div>
          <small className="auth-safe">
            <ShieldCheck /> Ambiente demonstrativo seguro
          </small>
        </form>
      </div>
    </div>
  );
}

const nav: Array<[View, typeof Home, string]> = [
  ["inicio", Home, "Início"],
  ["agenda", CalendarDays, "Agenda"],
  ["conversas", MessageCircle, "Conversas"],
  ["clientes", Users, "Clientes"],
  ["servicos", WandSparkles, "Serviços"],
  ["whatsapp", Smartphone, "WhatsApp"],
  ["relatorios", BarChart3, "Relatórios"],
  ["configuracoes", Settings, "Configurações"],
];
function Dashboard({ exit, booking }: { exit: () => void; booking: () => void }) {
  const [view, setView] = useState<View>("inicio");
  const [side, setSide] = useState(false);
  const labels: Record<View, string> = {
    inicio: "Visão geral",
    agenda: "Agenda",
    conversas: "Conversas",
    clientes: "Clientes",
    servicos: "Serviços",
    whatsapp: "Conectar WhatsApp",
    relatorios: "Relatórios",
    configuracoes: "Configurações",
  };
  return (
    <div className="dash">
      <aside className={`sidebar ${side ? "is-open" : ""}`}>
        <div className="sidebar__logo">
          <BrandLogo inverse />
          <button onClick={() => setSide(false)}>
            <X />
          </button>
        </div>
        <div className="company-switch">
          <div>SA</div>
          <span>
            <strong>Studio Atlas</strong>
            <small>Plano Profissional</small>
          </span>
          <ChevronRight />
        </div>
        <nav>
          {nav.map(([id, Icon, label]) => (
            <button
              key={id}
              className={view === id ? "active" : ""}
              onClick={() => {
                setView(id);
                setSide(false);
              }}
            >
              <Icon />
              {label}
              {id === "conversas" && <b>3</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar__bottom">
          <div className="trial-card">
            <Sparkles />
            <strong>7 dias gratuitos</strong>
            <span>Teste todos os recursos.</span>
            <i>
              <em style={{ width: "62%" }} />
            </i>
            <small>4 dias restantes</small>
          </div>
          <button onClick={exit}>
            <LogOut /> Sair da demonstração
          </button>
        </div>
      </aside>
      <section className="dash-content">
        <header className="dash-top">
          <button className="dash-menu" onClick={() => setSide(true)}>
            <Menu />
          </button>
          <div>
            <small>STUDIO ATLAS</small>
            <h1>{labels[view]}</h1>
          </div>
          <div className="dash-top__actions">
            <button className="icon-btn">
              <Search />
            </button>
            <button className="icon-btn notification">
              <Bell />
              <i />
            </button>
            <button className="profile">
              <span>MS</span>
              <div>
                <strong>Mariana Silva</strong>
                <small>Proprietária</small>
              </div>
              <ChevronRight />
            </button>
          </div>
        </header>
        <div className="dash-body">
          {view === "inicio" && <HomeView go={setView} />} {view === "agenda" && <AgendaView />}{" "}
          {view === "conversas" && <ConversationsView />} {view === "clientes" && <ClientsView />}{" "}
          {view === "servicos" && <ServicesView />} {view === "whatsapp" && <WhatsAppView />}{" "}
          {view === "relatorios" && <ReportsView />}{" "}
          {view === "configuracoes" && <SettingsView booking={booking} />}
        </div>
      </section>
    </div>
  );
}

function HomeView({ go }: { go: (v: View) => void }) {
  return (
    <>
      <div className="welcome-row">
        <div>
          <span>QUARTA-FEIRA, 23 DE SETEMBRO</span>
          <h2>Bom dia, Mariana! 👋</h2>
          <p>Sua agenda está movimentada. O Q já confirmou 8 clientes hoje.</p>
        </div>
        <button className="btn btn--primary">
          <Plus /> Novo agendamento
        </button>
      </div>
      <div className="stat-grid">
        {[
          [CalendarDays, "12", "Agendamentos hoje", "+3", "indigo"],
          [CheckCircle2, "10", "Confirmados", "83%", "mint"],
          [MessageCircle, "24", "Conversas da IA", "+18%", "coral"],
          [Zap, "78%", "Conversão em agenda", "+12%", "indigo"],
        ].map(([Icon, n, l, d, c]) => (
          <div className="stat-card" key={String(l)}>
            <div className={`stat-icon ${c}`}>
              <Icon />
            </div>
            <span>{String(l)}</span>
            <strong>{String(n)}</strong>
            <small>
              {String(d)} <em>esta semana</em>
            </small>
          </div>
        ))}
      </div>
      <div className="home-grid">
        <Panel
          title="Próximos agendamentos"
          subtitle="Agenda de hoje"
          action={
            <button onClick={() => go("agenda")}>
              Ver agenda <ArrowRight />
            </button>
          }
        >
          <div className="appointment-list">
            {appointments.slice(0, 4).map((a) => (
              <div className="appointment" key={a.time}>
                <div className="appointment__time">
                  <strong>{a.time}</strong>
                  <span>HOJE</span>
                </div>
                <i className={a.color} />
                <div>
                  <strong>{a.name}</strong>
                  <span>
                    {a.service} · {a.professional}
                  </span>
                </div>
                <b className={a.status === "Confirmado" ? "ok" : "wait"}>{a.status}</b>
                <MoreHorizontal />
              </div>
            ))}
          </div>
        </Panel>
        <Panel
          title="Atendimento inteligente"
          subtitle="Desempenho do Q hoje"
          className="ai-panel"
          action={
            <span className="live">
              <i /> ONLINE
            </span>
          }
        >
          <div className="ai-summary">
            <Mascot className="ai-mascot" />
            <div>
              <strong>18 clientes atendidos</strong>
              <span>14 agendaram sem ajuda humana</span>
            </div>
          </div>
          <div className="ai-metrics">
            <div>
              <span>Tempo médio</span>
              <strong>3s</strong>
            </div>
            <div>
              <span>Resolvidas pela IA</span>
              <strong>78%</strong>
            </div>
          </div>
          <button className="btn btn--soft" onClick={() => go("conversas")}>
            Abrir conversas <ArrowRight />
          </button>
        </Panel>
      </div>
      <Panel title="Movimento da semana" subtitle="Agendamentos confirmados" className="activity">
        <div className="activity-chart">
          <div className="activity-y">
            <span>40</span>
            <span>30</span>
            <span>20</span>
            <span>10</span>
            <span>0</span>
          </div>
          <div className="activity-bars">
            {[
              ["SEG", 18],
              ["TER", 25],
              ["QUA", 31],
              ["QUI", 22],
              ["SEX", 36],
              ["SÁB", 29],
              ["DOM", 12],
            ].map(([d, h]) => (
              <div key={d}>
                <i style={{ height: `${Number(h) * 3.6}px` }} />
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </>
  );
}
function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-head">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function AgendaView() {
  const [selected, setSelected] = useState(2);
  return (
    <>
      <div className="toolbar">
        <div className="segmented">
          <button className="active">Semana</button>
          <button>Dia</button>
          <button>Mês</button>
        </div>
        <button className="btn btn--primary">
          <Plus /> Novo horário
        </button>
      </div>
      <div className="calendar-week">
        {weekDays.map((d, i) => (
          <button
            key={d.day}
            className={selected === i ? "active" : ""}
            onClick={() => setSelected(i)}
          >
            <span>{d.week}</span>
            <strong>{d.day}</strong>
            <small>{d.appointments} horários</small>
          </button>
        ))}
      </div>
      <Panel
        title="Quarta-feira, 23 de setembro"
        subtitle="5 agendamentos · 2 horários disponíveis"
        className="agenda-panel"
      >
        <div className="timeline">
          {appointments.map((a) => (
            <div className="timeline-row" key={a.time}>
              <time>{a.time}</time>
              <div className={`timeline-event ${a.color}`}>
                <span className="avatar">
                  {a.name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </span>
                <div>
                  <strong>{a.name}</strong>
                  <small>
                    {a.service} · {a.professional}
                  </small>
                </div>
                <b>{a.status}</b>
                <MoreHorizontal />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function ConversationsView() {
  const [active, setActive] = useState(0);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  return (
    <div className="inbox">
      <aside>
        <div className="inbox-search">
          <Search />
          <input placeholder="Buscar conversas" />
        </div>
        <div className="inbox-tabs">
          <button className="active">Todas</button>
          <button>Não lidas</button>
          <button>Humano</button>
        </div>
        {conversations.map((c, i) => (
          <button
            key={c.name}
            className={`conversation-row ${active === i ? "active" : ""}`}
            onClick={() => setActive(i)}
          >
            <span>{c.initials}</span>
            <div>
              <strong>
                {c.name}
                <small>{c.time}</small>
              </strong>
              <p>{c.message}</p>
              <em>{c.state}</em>
            </div>
            {c.unread > 0 && <b>{c.unread}</b>}
          </button>
        ))}
      </aside>
      <section className="chat">
        <header>
          <span>{conversations[active].initials}</span>
          <div>
            <strong>{conversations[active].name}</strong>
            <small>Cliente desde setembro de 2026</small>
          </div>
          <button className="btn btn--soft">
            <UserRound /> Assumir conversa
          </button>
        </header>
        <div className="chat-area">
          <div className="chat-day">HOJE</div>
          <div className="chat-message incoming">
            Olá! Gostaria de saber se tem horário para amanhã.
          </div>
          <div className="chat-message outgoing">
            Olá! 👋 Temos horários disponíveis. Você gostaria de agendar qual serviço?
            <small>09:14 · Q</small>
          </div>
          <div className="chat-message incoming">Corte e barba com o Rafael.</div>
          <div className="chat-message outgoing">
            Encontrei três opções: 9h, 10h30 e 14h. Qual funciona melhor?<small>09:15 · Q</small>
          </div>
          {sent.map((s, i) => (
            <div className="chat-message outgoing" key={i}>
              {s}
              <small>agora · Você</small>
            </div>
          ))}
        </div>
        <form
          className="chat-input"
          onSubmit={(e) => {
            e.preventDefault();
            if (message.trim()) {
              setSent([...sent, message]);
              setMessage("");
            }
          }}
        >
          <button type="button">
            <Plus />
          </button>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escreva uma mensagem..."
          />
          <button className="send">
            <Send />
          </button>
        </form>
      </section>
      <aside className="contact-card">
        <span className="big-avatar">{conversations[active].initials}</span>
        <h3>{conversations[active].name}</h3>
        <p>(27) 99912-3456</p>
        <div>
          <span>Próximo horário</span>
          <strong>24 set · 10:30</strong>
        </div>
        <div>
          <span>Último serviço</span>
          <strong>Corte + Barba</strong>
        </div>
        <div>
          <span>Total de visitas</span>
          <strong>6 atendimentos</strong>
        </div>
      </aside>
    </div>
  );
}

function ClientsView() {
  return (
    <Panel
      title="Clientes"
      subtitle="328 clientes cadastrados"
      action={
        <button className="btn btn--primary">
          <Plus /> Novo cliente
        </button>
      }
      className="table-panel"
    >
      <div className="table-search">
        <Search />
        <input placeholder="Buscar por nome ou telefone" />
      </div>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Telefone</th>
            <th>Última visita</th>
            <th>Agendamentos</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {[
            "Lucas Mendes",
            "Ana Souza",
            "Bruno Reis",
            "Marina Costa",
            "Felipe Rocha",
            "André Lima",
          ].map((n, i) => (
            <tr key={n}>
              <td>
                <span className="table-avatar">
                  {n
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </span>
                <strong>{n}</strong>
              </td>
              <td>
                (27) 999{10 + i}-12{30 + i}
              </td>
              <td>{i + 12}/09/2026</td>
              <td>{i + 2}</td>
              <td>
                <b className="client-active">Ativo</b>
              </td>
              <td>
                <MoreHorizontal />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
function ServicesView() {
  return (
    <>
      <div className="welcome-row">
        <div>
          <h2>Serviços e profissionais</h2>
          <p>Configure o que sua empresa oferece e quem pode atender.</p>
        </div>
        <button className="btn btn--primary">
          <Plus /> Novo serviço
        </button>
      </div>
      <div className="service-grid">
        {services.map((s, i) => (
          <div className="service-card" key={s.name}>
            <div className={`service-icon c${i}`}>
              <WandSparkles />
            </div>
            <MoreHorizontal />
            <h3>{s.name}</h3>
            <p>
              <Clock3 /> {s.duration}
            </p>
            <strong>{s.price}</strong>
            <footer>
              <Users /> {s.professionals} profissionais <span>Ativo</span>
            </footer>
          </div>
        ))}
      </div>
    </>
  );
}

function WhatsAppView() {
  const [method, setMethod] = useState<"qr" | "code">("qr");
  const [connected, setConnected] = useState(false);
  return (
    <div className="connect-layout">
      <section className="connect-copy">
        <span className="overline">INTEGRAÇÃO</span>
        <h2>Conecte seu WhatsApp ao AgendaIQ</h2>
        <p>
          Quando um cliente enviar uma mensagem, o AgendaIQ responderá com o link personalizado para
          ele escolher um horário.
        </p>
        {[
          [Zap, "Resposta automática", "Atendimento imediato, 24 horas por dia."],
          [LockKeyhole, "Conexão protegida", "Você pode desconectar quando quiser."],
          [
            MessageCircle,
            "Confirmação no WhatsApp",
            "O cliente recebe todos os detalhes após agendar.",
          ],
        ].map(([Icon, t, p]) => (
          <div className="connect-benefit" key={String(t)}>
            <Icon />
            <span>
              <strong>{String(t)}</strong>
              <small>{String(p)}</small>
            </span>
          </div>
        ))}
      </section>
      <section className="connect-card">
        {connected ? (
          <div className="connected-state">
            <div className="success-ring">
              <Check />
            </div>
            <span>WHATSAPP CONECTADO</span>
            <h3>Studio Atlas</h3>
            <p>+55 27 99912-3456</p>
            <div className="connection-status">
              <i /> Conectado e recebendo mensagens
            </div>
            <button className="btn btn--soft" onClick={() => setConnected(false)}>
              Desconectar demonstração
            </button>
          </div>
        ) : (
          <>
            <div className="connect-tabs">
              <button className={method === "qr" ? "active" : ""} onClick={() => setMethod("qr")}>
                <QrCode /> QR Code
              </button>
              <button
                className={method === "code" ? "active" : ""}
                onClick={() => setMethod("code")}
              >
                <Smartphone /> Código no celular
              </button>
            </div>
            {method === "qr" ? (
              <div className="qr-flow">
                <h3>Escaneie com seu celular</h3>
                <p>
                  No WhatsApp, acesse <strong>Aparelhos conectados</strong>.
                </p>
                <div className="qr-demo">
                  <QrPattern />
                  <BrandMark />
                </div>
                <small>
                  <span /> QR Code demonstrativo · 01:48
                </small>
                <button className="btn btn--primary" onClick={() => setConnected(true)}>
                  Simular conexão
                </button>
              </div>
            ) : (
              <div className="code-flow">
                <h3>Conecte pelo próprio celular</h3>
                <p>Informe seu número e use o código exibido no WhatsApp.</p>
                <label>
                  Seu número
                  <div>
                    <span>+55</span>
                    <input defaultValue="27 99912-3456" />
                  </div>
                </label>
                <button className="btn btn--primary" onClick={() => setConnected(true)}>
                  Gerar código de conexão
                </button>
                <div className="pairing-code">AG7 Q2K 9X</div>
                <small>
                  Fluxo demonstrativo. A conexão real exige o provedor configurado no servidor.
                </small>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
function QrPattern() {
  return (
    <svg viewBox="0 0 120 120">
      <rect width="120" height="120" rx="8" fill="white" />
      {Array.from({ length: 12 }).flatMap((_, y) =>
        Array.from({ length: 12 }).map((__, x) =>
          (x * y + x + y * 3) % 4 !== 0 ? (
            <rect
              key={`${x}-${y}`}
              x={8 + x * 8.7}
              y={8 + y * 8.7}
              width="6"
              height="6"
              rx="1"
              fill="#101828"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

function ReportsView() {
  return (
    <>
      <div className="stat-grid">
        {[
          [CreditCard, "R$ 8.420", "Receita estimada", "+18%"],
          [CalendarDays, "186", "Agendamentos", "+24%"],
          [Users, "72", "Novos clientes", "+11%"],
          [Bot, "78%", "Resolvidos pela IA", "+9%"],
        ].map(([Icon, n, l, d]) => (
          <div className="stat-card" key={String(l)}>
            <div className="stat-icon indigo">
              <Icon />
            </div>
            <span>{String(l)}</span>
            <strong>{String(n)}</strong>
            <small>
              {String(d)} <em>no período</em>
            </small>
          </div>
        ))}
      </div>
      <div className="report-grid">
        <Panel title="Agendamentos por semana" subtitle="Últimos 30 dias">
          <div className="big-bars">
            {[45, 62, 55, 78, 68, 88, 72, 94, 80, 86, 71, 92].map((n, i) => (
              <i key={i} style={{ height: `${n}%` }} />
            ))}
          </div>
        </Panel>
        <Panel title="Serviços mais procurados" subtitle="Participação no total">
          {services.map((s, i) => (
            <div className="rank" key={s.name}>
              <b>{i + 1}</b>
              <span>
                {s.name}
                <i>
                  <em style={{ width: `${88 - i * 16}%` }} />
                </i>
              </span>
              <strong>{42 - i * 7}</strong>
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}
function SettingsView({ booking }: { booking: () => void }) {
  return (
    <div className="settings-grid">
      <Panel
        title="Link de agendamento"
        subtitle="Compartilhe com seus clientes"
        className="settings-card"
      >
        <div className="public-link">
          <Link2 />
          <span>
            <small>SEU LINK</small>
            <strong>agendaiq.com.br/studio-atlas</strong>
          </span>
          <Copy />
        </div>
        <button className="btn btn--primary" onClick={booking}>
          <ExternalLink /> Abrir página pública
        </button>
      </Panel>
      <Panel
        title="Personalidade da IA"
        subtitle="Como o Q fala com seus clientes"
        className="settings-card"
      >
        <label>
          Tom de voz
          <select defaultValue="acolhedor">
            <option value="acolhedor">Acolhedor e profissional</option>
            <option>Direto e objetivo</option>
          </select>
        </label>
        <label>
          Mensagem de boas-vindas
          <textarea defaultValue="Olá! Eu sou o assistente virtual do Studio Atlas. Como posso ajudar você hoje?" />
        </label>
        <button className="btn btn--dark">Salvar alterações</button>
      </Panel>
      <section className="panel settings-card billing">
        <CreditCard />
        <div>
          <span>PLANO ATUAL</span>
          <h3>AgendaIQ Profissional</h3>
          <p>R$ 49,90 por mês · 4 dias de teste restantes</p>
        </div>
        <button className="btn btn--soft">Gerenciar assinatura</button>
      </section>
    </div>
  );
}

function Booking({ back }: { back: () => void }) {
  const [step, setStep] = useState(1);
  const [service, setService] = useState(0);
  const [time, setTime] = useState("");
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  return (
    <div className="booking-page">
      <header>
        <BrandLogo />
        <button onClick={back}>
          <ArrowLeft /> Voltar
        </button>
      </header>
      <div className="booking-hero">
        <span>STUDIO ATLAS</span>
        <h1>Reserve seu horário</h1>
        <p>Escolha o serviço e encontre o melhor momento para você.</p>
        <div className="booking-progress">
          <i className={step >= 1 ? "active" : ""} />
          <i className={step >= 2 ? "active" : ""} />
          <i className={step >= 3 ? "active" : ""} />
        </div>
      </div>
      <div className="booking-wrap">
        <aside className="business-card">
          <div className="business-cover">
            <div>SA</div>
          </div>
          <h3>Studio Atlas</h3>
          <p>Barbearia premium em Vitória, ES</p>
          <div>
            <Clock3 />
            <span>
              <strong>Aberto hoje</strong>
              <small>08:00 às 19:00</small>
            </span>
          </div>
          <div>
            <MessageCircle />
            <span>
              <strong>Atendimento inteligente</strong>
              <small>Tire dúvidas com o Q</small>
            </span>
          </div>
          <button onClick={() => setOpen(true)}>
            <Bot /> Conversar com o Q
          </button>
        </aside>
        <section className="booking-card">
          {step === 1 && (
            <>
              <BookingTitle
                step="1"
                title="Qual serviço você deseja?"
                text="Selecione uma opção para continuar."
              />
              <div className="booking-services">
                {services.map((s, i) => (
                  <button
                    key={s.name}
                    className={service === i ? "active" : ""}
                    onClick={() => setService(i)}
                  >
                    <div>
                      <strong>{s.name}</strong>
                      <span>{s.duration}</span>
                    </div>
                    <b>{s.price}</b>
                    {service === i && <CheckCircle2 />}
                  </button>
                ))}
              </div>
              <button className="btn btn--primary btn--lg booking-next" onClick={() => setStep(2)}>
                Escolher horário <ArrowRight />
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <button className="inline-back" onClick={() => setStep(1)}>
                <ArrowLeft /> Voltar
              </button>
              <BookingTitle
                step="2"
                title="Escolha o melhor horário"
                text="Quarta-feira, 23 de setembro"
              />
              <div className="date-strip">
                {weekDays.slice(1, 6).map((d, i) => (
                  <button className={i === 1 ? "active" : ""} key={d.day}>
                    <span>{d.week}</span>
                    <strong>{d.day}</strong>
                  </button>
                ))}
              </div>
              <h4>Horários disponíveis</h4>
              <div className="time-grid">
                {timeSlots.map((t) => (
                  <button key={t} className={time === t ? "active" : ""} onClick={() => setTime(t)}>
                    {t}
                  </button>
                ))}
              </div>
              <button
                disabled={!time}
                className="btn btn--primary btn--lg booking-next"
                onClick={() => setStep(3)}
              >
                Confirmar dados <ArrowRight />
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <button className="inline-back" onClick={() => setStep(2)}>
                <ArrowLeft /> Voltar
              </button>
              <BookingTitle
                step="3"
                title="Está quase tudo pronto"
                text="Confira os dados antes de confirmar."
              />
              <div className="booking-summary">
                <div>
                  <WandSparkles />
                  <span>
                    <small>SERVIÇO</small>
                    <strong>{services[service].name}</strong>
                  </span>
                  <b>{services[service].price}</b>
                </div>
                <div>
                  <CalendarDays />
                  <span>
                    <small>DATA E HORÁRIO</small>
                    <strong>23 de setembro · {time}</strong>
                  </span>
                </div>
                <div>
                  <UserRound />
                  <span>
                    <small>PROFISSIONAL</small>
                    <strong>Rafael</strong>
                  </span>
                </div>
              </div>
              <label className="booking-input">
                Seu nome
                <input defaultValue="Lucas Mendes" />
              </label>
              <label className="booking-input">
                WhatsApp
                <input defaultValue="(27) 99912-3456" />
              </label>
              <button className="btn btn--primary btn--lg booking-next" onClick={() => setStep(4)}>
                <Check /> Confirmar agendamento
              </button>
            </>
          )}
          {step === 4 && (
            <div className="booking-success">
              <div className="success-ring">
                <Check />
              </div>
              <span>AGENDAMENTO CONFIRMADO</span>
              <h2>Está tudo certo, Lucas!</h2>
              <p>Seu horário foi reservado. Também enviamos a confirmação para o seu WhatsApp.</p>
              <div>
                <strong>{services[service].name}</strong>
                <span>23 de setembro · {time} · com Rafael</span>
              </div>
              <button className="btn btn--dark" onClick={back}>
                Concluir
              </button>
            </div>
          )}
        </section>
      </div>
      <button className="chat-fab" onClick={() => setOpen(!open)}>
        {open ? (
          <X />
        ) : (
          <>
            <Bot />
            <span>Posso ajudar?</span>
          </>
        )}
      </button>
      {open && (
        <div className="booking-chat">
          <header>
            <Mascot className="chat-mascot" />
            <div>
              <strong>Q · Assistente virtual</strong>
              <small>
                <i /> Online agora
              </small>
            </div>
            <button onClick={() => setOpen(false)}>
              <X />
            </button>
          </header>
          <div className="booking-chat__body">
            <div className="chat-message outgoing">
              Olá! 👋 Posso explicar os serviços ou ajudar você a escolher um horário.
            </div>
            {chat.map((m, i) => (
              <div key={i}>
                <div className="chat-message incoming">{m}</div>
                <div className="chat-message outgoing">
                  O Corte + Barba dura 75 minutos e custa R$ 85. Posso ajudar você a reservar?
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (question.trim()) {
                setChat([...chat, question]);
                setQuestion("");
              }
            }}
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Digite sua dúvida..."
            />
            <button>
              <Send />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
function BookingTitle({ step, title, text }: { step: string; title: string; text: string }) {
  return (
    <div className="booking-title">
      <span>PASSO {step} DE 3</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}
