export const demoCredentials = {
  email: "demo@agendaiq.com.br",
  password: "AgendaIQ123",
};

export const appointments = [
  {
    time: "08:30",
    name: "Lucas Mendes",
    service: "Corte + Barba",
    professional: "Rafael",
    status: "Confirmado",
    color: "indigo",
  },
  {
    time: "10:00",
    name: "Bruno Alves",
    service: "Corte Premium",
    professional: "Rafael",
    status: "Confirmado",
    color: "mint",
  },
  {
    time: "11:30",
    name: "Marcos Silva",
    service: "Barba Terapia",
    professional: "Diego",
    status: "Aguardando",
    color: "coral",
  },
  {
    time: "14:00",
    name: "Felipe Rocha",
    service: "Corte Degradê",
    professional: "Diego",
    status: "Confirmado",
    color: "indigo",
  },
  {
    time: "16:30",
    name: "André Lima",
    service: "Corte + Barba",
    professional: "Rafael",
    status: "Confirmado",
    color: "mint",
  },
];

export const conversations = [
  {
    initials: "LM",
    name: "Lucas Mendes",
    message: "Perfeito, obrigado!",
    time: "agora",
    unread: 2,
    state: "IA atendendo",
  },
  {
    initials: "AS",
    name: "Ana Souza",
    message: "Tem horário amanhã?",
    time: "2 min",
    unread: 1,
    state: "Aguardando",
  },
  {
    initials: "BR",
    name: "Bruno Reis",
    message: "Quero remarcar para sexta",
    time: "8 min",
    unread: 0,
    state: "IA atendendo",
  },
  {
    initials: "MC",
    name: "Marina Costa",
    message: "Qual o valor do serviço?",
    time: "17 min",
    unread: 0,
    state: "Humano",
  },
];

export const services = [
  { name: "Corte Premium", duration: "45 min", price: "R$ 55,00", professionals: 2 },
  { name: "Corte + Barba", duration: "75 min", price: "R$ 85,00", professionals: 2 },
  { name: "Barba Terapia", duration: "35 min", price: "R$ 45,00", professionals: 1 },
  { name: "Corte Degradê", duration: "50 min", price: "R$ 60,00", professionals: 2 },
];

export const weekDays = [
  { week: "SEG", day: "21", appointments: 4 },
  { week: "TER", day: "22", appointments: 6 },
  { week: "QUA", day: "23", appointments: 5, active: true },
  { week: "QUI", day: "24", appointments: 7 },
  { week: "SEX", day: "25", appointments: 8 },
  { week: "SÁB", day: "26", appointments: 3 },
];

export const timeSlots = ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"];
