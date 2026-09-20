import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Bot, CalendarDays, LoaderCircle, Send, ShieldCheck } from "lucide-react";
import { BrandLogo } from "../components/brand";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/chat/$slug")({ component: PublicChat });
type ChatMessage = { role: "client" | "ai"; content: string };

function PublicChat() {
  const { slug } = Route.useParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [started, setStarted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content:
        "Olá! Sou a assistente virtual. Posso tirar dúvidas, consultar horários e fazer seu agendamento.",
    },
  ]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  function begin(e: FormEvent) {
    e.preventDefault();
    setStarted(true);
  }
  async function send(e: FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value || busy) return;
    setMessages((m) => [...m, { role: "client", content: value }]);
    setText("");
    setBusy(true);
    setError("");
    const { data, error: fnError } = await supabase.functions.invoke("site-chat", {
      body: { organizationSlug: slug, publicToken: token, message: value, name, phone },
    });
    setBusy(false);
    if (fnError || data?.error) {
      setError(data?.error || "Não foi possível responder agora. Tente novamente.");
      return;
    }
    if (data.publicToken) setToken(data.publicToken);
    if (data.message?.content)
      setMessages((m) => [...m, { role: "ai", content: data.message.content }]);
  }
  return (
    <main className="public-chat">
      <header>
        <BrandLogo />
        <span>
          <ShieldCheck />
          Atendimento seguro
        </span>
      </header>
      <section className="chat-card">
        <div className="chat-title">
          <div>
            <Bot />
          </div>
          <span>
            <strong>Assistente AgendaIQ</strong>
            <small>
              <i /> Online agora
            </small>
          </span>
        </div>
        {!started ? (
          <form className="visitor-form" onSubmit={begin}>
            <CalendarDays />
            <h1>Vamos encontrar seu melhor horário</h1>
            <p>Informe seus dados para começar. Eles serão usados somente neste atendimento.</p>
            <label>
              Seu nome
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </label>
            <label>
              Seu WhatsApp
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="(11) 99999-9999"
              />
            </label>
            <button className="btn btn--primary btn--lg">Começar atendimento</button>
          </form>
        ) : (
          <>
            <div className="message-list">
              {messages.map((m, i) => (
                <div className={`chat-message chat-message--${m.role}`} key={i}>
                  {m.content}
                </div>
              ))}
              {busy && (
                <div className="typing">
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>
            {error && <div className="chat-error">{error}</div>}
            <form className="chat-composer" onSubmit={send}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite sua mensagem…"
                maxLength={1500}
              />
              <button aria-label="Enviar" disabled={busy || !text.trim()}>
                {busy ? <LoaderCircle className="spin" /> : <Send />}
              </button>
            </form>
          </>
        )}
      </section>
      <p className="powered">
        Atendimento inteligente por <strong>AgendaIQ</strong>
      </p>
    </main>
  );
}
