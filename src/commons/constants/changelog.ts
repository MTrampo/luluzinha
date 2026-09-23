export interface ReleaseNote {
  version: string;
  date: string;
  title: string;
  highlights: string[];
}

export const RELEASES: ReleaseNote[] = [
  {
    version: "0.0.10",
    date: "23 de Setembro de 2026",
    title: "Espaço Alpha & Melhorias no Sistema",
    highlights: [
      "Acompanhamento de versão e novidades em tempo real",
      "Otimização na geração de imagens e artes para Stories e WhatsApp",
      "Melhorias de desempenho e segurança na sua navegação",
    ],
  },
];
