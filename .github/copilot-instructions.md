# Diretrizes de Desenvolvimento e Arquitetura do Projeto

Você é um assistente de codificação sênior atuando neste projeto. Siga rigorosamente as regras abaixo para garantir a consistência, segurança e qualidade do código.

## 1. Stack Tecnológico
* **Framework:** Next.js 16 (App Router)
* **Estilização:** Tailwind CSS
* **Componentes de UI:** Shadcn UI
* **Backend as a Service / DB:** Supabase (Autenticação, Banco de Dados, Storage, etc.)
* **Pagamentos:** Mercado Pago

## 2. Padrão Arquitetural e Estrutura de Pastas (Monolito em Camadas)
Respeite estritamente a localização e a responsabilidade de cada pasta. Não crie atalhos ('gambiarras') ou misture camadas.

* `src/app`: Páginas e rotas do Next.js.
* `src/components/ui`: Componentes base do Shadcn UI.
* `src/components/*`: Componentes reutilizáveis compostos (buttons, cards, dialogs, forms, etc.).
* `src/features`: Componentes de escopo específico ou blocos de páginas (customers, finance, etc.).
* `src/actions`: Módulos de integração entre frontend e backend.
* `src/back`: Camada de backend e regras de negócio, dividida por domínios (ex: `src/back/account`).
* `src/store`: Gerenciamento de estado global (se necessário, preferencialmente usando Zustand).
* `src/commons`: Utilitários, enums, modelos, tipos globais, e bibliotecas, erros e etc.
* `src/schemas`: Scripts e políticas de banco de dados, migrações, e definições de tabelas do Supabase.

## 3. Fluxo de Dados e Regras de Camadas (Crucial)
O fluxo de chamadas deve seguir uma hierarquia estrita: **UI -> Action -> Service -> Repository**.

* **UI (Pages/Features):** Consomem as Actions. Podem ser Server Components ou Client Components.
* **Actions (`src/actions`):** * Exclusivamente responsáveis por integrar a UI com o backend.
  * Devem **sempre** utilizar a diretiva `'use server'` no topo do arquivo ou da função.
  * As actions **não** acessam o banco de dados diretamente; elas apenas chamam os Services.
* **Services (`src/back/[dominio]/service/*.api.ts`):** * Contêm a regra de negócio.
  * São chamados apenas pelas Actions.
  * Consomem os Repositories para interagir com os dados.
* **Repositories (`src/back/[dominio]/repository/*.supabase.ts`):** * Contêm a lógica de acesso a dados (Supabase, consultas, mutações).
  * Um repositório só pode se conectar e ser instanciado/chamado pelo seu respectivo Service.
  * Arquivo responsável pelas tabelas do Supabase, consultas e mutações: `src/commons/types/database.types.ts`.

## 4. Diretrizes para Criação de Componentes
* **Preferência:** Utilize os componentes compostos sempre que possível na pasta `src/components` para criar novas
interfaces, evitando criar componentes do zero sem necessidade.
* **Prioridade Shadcn:** Ao criar novos componentes compostos, verifique primeiro a existência do componente na pasta `src/components/ui`.
* **Componentes Compostos:** Se o componente base do Shadcn não existir verifique na documentação `mcp` e caso necessário solicite instalação caso encontre. Sempre utilize-o como base para criar componentes compostos na pasta `src/components` ou `src/features` se for específico de uma feature. Evite criar componentes do zero sem necessidade.
* **Reutilização:** Utilize os componentes base do Shadcn para compor novos componentes na pasta `src/components` ou dentro de `src/features`.
* **Estilização:** Utilize o utilitário `cn()` (geralmente em `src/commons/utils`) para mesclar classes do Tailwind de forma limpa.

## 5. Documentação e Integrações (MCP)
* Caso precise de informações detalhadas sobre as APIs ou documentações do **Supabase**, **Mercado Pago** ou **Shadcn**, utilize os protocolos MCP (Model Context Protocol) disponíveis no ambiente para buscar a documentação oficial mais recente antes de propor uma solução complexa.

## 6. Qualidade de Código
* Escreva código limpo, tipado de forma estrita (TypeScript) e sem comentários óbvios.
* Trate os erros nas camadas adequadas (Repository lança o erro, Service trata ou repassa, Action formata para a UI).
* Evite duplicação de código e siga os princípios SOLID.
* Mantenha a consistência com o estilo de código do projeto (indentação, nomenclatura, etc.).
* Evite o uso de `any` e prefira tipos explícitos e interfaces.
* Evite o uso de `.then()` e prefira `async/await` para lidar com promessas sempre.
* Ao construir uma função, sempre pense na performance, segurança e legibilidade do código. Estamos construindo um
monolito, então cada função deve ser otimizada e segura para evitar problemas futuros.