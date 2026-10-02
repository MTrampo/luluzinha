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
    title: "Início do Espaço Beta & Notificações por E-mail",
    highlights: [
      "Inauguração da Fase Beta",
      "Novo sistema de notificações por e-mail para assinaturas e renovações",
      "Pesquisa acolhedora e melhorias na experiência do seu espaço",
      "Ajustes finos de performance e acessibilidade visual",
    ],
  },
  {
    version: "0.0.10",
    date: "23 de Setembro de 2026",
    title: "Espaço Alpha & Melhorias no Sistema",
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
