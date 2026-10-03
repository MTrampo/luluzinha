export interface ReleaseNote {
  version: string;
  date: string;
  title: string;
  highlights: string[];
}

export const RELEASES: ReleaseNote[] = [
  {
    version: "0.1.0",
    date: "03 de Outubro de 2026",
    title: "Inauguração do Espaço Beta",
    highlights: [
      "Lançamento do Aplicativo (PWA): suporte para Celular (Android/iPhone) e Computador (Windows/Mac)",
      "Instalação inteligente: opção no perfil adaptada para computador ou celular.",
      "Busca Rápida Global (Ctrl + K / Cmd + K): acesse qualquer Poderosa ou página instantaneamente",
      "Atalhos de teclado seguros e protegidos contra digitação em formulários",
      "Alerta sonoro antes do início dos próximos atendimentos",
      "Contador de atendimentos pendentes do dia no ícone do aplicativo",
      "Lembrete de atendimento no WhatsApp em 1 toque para suas Poderosas",
      "Navegação ultra veloz com tela de contingência para quando estiver sem conexão",
      "Saudações acolhedoras e refinamentos visuais no painel",
      "Correção de bugs e melhorias de desempenho",
      "Otimização de performance e segurança",
      "Melhorias na experiência do usuário e mobile",
      "Revisão de textos e comunicação",
    ],
  },
  {
    version: "0.0.10",
    date: "23 de Setembro de 2026",
    title: "Melhorias no Sistema",
    highlights: [
      "Acompanhamento de versão e novidades em tempo real",
      "Otimização na geração de imagens e artes para Stories e WhatsApp",
      "Melhorias de desempenho e segurança na sua navegação",
      "Criação da lista de espera"
    ],
  },
  {
    version: "0.0.5",
    date: "15 de Setembro de 2026",
    title: "Correções de Desempenho",
    highlights: [
      "Correção de bugs",
      "Melhorias de segurança",
      "Otimização de performance",
      "Melhorias na experiência do usuário",
      "Melhorias na experiência mobile",
    ],
  },
  {
    version: "0.0.1",
    date: "12 de Setembro de 2026",
    title: "Lançamento Alpha",
    highlights: [
      "Primeiras Poderosas convidadas",
      "Sistema de convites",
    ],
  },
];
