/* ============================================================
   content.js — todo o conteúdo do site, em PT e EN.
   Editar aqui é a única coisa necessária para atualizar a página.
   ============================================================ */

const CONFIG = {
  name: 'Murilo Soares',
  email: 'soaresmurilor@gmail.com',
  github: 'https://github.com/SoaresM-dev',
  githubUser: 'SoaresM-dev',
  linkedin: 'https://www.linkedin.com/in/murilo-soares-dev/',
  location: { pt: 'Brasil · remoto ou híbrido', en: 'Brazil · remote or hybrid' },
  cv: 'assets/murilo-soares-cv.pdf'
};

/* ---------- textos estáticos ---------- */
const I18N = {
  pt: {
    'nav.skip': 'Pular para os projetos',
    'nav.about': 'Sobre', 'nav.stack': 'Stack', 'nav.projects': 'Projetos',
    'nav.path': 'Trajetória', 'nav.contact': 'Contato', 'nav.search': 'Buscar',

    'hero.status': 'Disponível para estágio · início imediato',
    'hero.h1a': 'Construo sistemas que',
    'hero.h1b': 'funcionam sob restrição real.',
    'hero.lede': 'Estudante de Análise e Desenvolvimento de Sistemas. Escrevi um assistente de voz que roda 100% offline numa máquina sem GPU, e construo sites que existem para converter — não para enfeitar.',
    'hero.ctaProjects': 'Ver projetos',
    'hero.copyMail': 'Copiar e-mail',

    'metric.tests': 'testes automatizados',
    'metric.skills': 'skills no assistente',
    'metric.latency': 'de queda na latência de resposta',
    'metric.offline': 'offline — sem API em nuvem',

    'sec.about': 'sobre', 'sec.stack': 'stack', 'sec.projects': 'projetos',
    'sec.path': 'trajetória', 'sec.contact': 'contato',

    'about.title': 'Aprendi a programar resolvendo problemas que eu tinha.',
    'about.p1': 'Comecei pelo lado do negócio: sites e campanhas de tráfego pago para clientes reais, onde a única métrica que importava era conversão. Isso me ensinou a olhar software pelo resultado, não pela quantidade de código.',
    'about.p2': 'Depois vim para o lado da engenharia. Hoje curso Análise e Desenvolvimento de Sistemas e mantenho o Aiden, um assistente de voz em português rodando inteiramente offline numa máquina CPU-only com 15,7 GB de RAM — uma restrição que obriga a decidir bem em vez de gastar hardware.',
    'about.p3': 'Procuro um estágio onde eu possa fazer as duas coisas: escrever código que se sustenta em teste e entender por que ele existe.',
    'about.f1k': 'formação',      'about.f1v': 'ADS · em curso',
    'about.f3k': 'foco',          'about.f3v': 'Back-end em Python e front-end',
    'about.f4k': 'idiomas',       'about.f4v': 'Português nativo · Inglês técnico',
    'about.f5k': 'buscando',      'about.f5v': 'Estágio remoto ou híbrido',

    'stack.title': 'O que eu uso, e onde usei.',
    'stack.lede': 'Sem barra de porcentagem. Clique em qualquer tecnologia para ver só os projetos em que ela aparece.',

    'projects.title': 'Projetos reais, com números.',
    'projects.filtering': 'filtrando por',
    'projects.clear': 'limpar',
    'projects.empty': 'nenhum projeto com essa tecnologia ainda.',
    'proj.problem': 'Problema', 'proj.solution': 'Solução', 'proj.result': 'Resultado',
    'proj.more': 'Ler detalhes', 'proj.less': 'Recolher',
    'proj.repo': 'Repositório', 'proj.demo': 'Ver ao vivo',

    'path.title': 'Como cheguei até aqui.',

    'contact.title': 'Procuro estágio em desenvolvimento.',
    'contact.lede': 'Se você tem uma vaga, uma dúvida sobre algum projeto ou quer o código de alguma coisa daqui — é só chamar. Respondo rápido.',
    'contact.mail': 'E-mail', 'contact.copy': 'copiar',

    'foot.built': 'Construído à mão · HTML, CSS e JavaScript · sem framework',
    'toast.copied': 'E-mail copiado para a área de transferência',
    'toast.failed': 'Não consegui copiar — o e-mail é ' + CONFIG.email,

    'palette.go': 'Ir para', 'palette.open': 'Abrir', 'palette.action': 'Ação',
    'palette.none': 'nenhum comando encontrado'
  },

  en: {
    'nav.skip': 'Skip to projects',
    'nav.about': 'About', 'nav.stack': 'Stack', 'nav.projects': 'Projects',
    'nav.path': 'Path', 'nav.contact': 'Contact', 'nav.search': 'Search',

    'hero.status': 'Available for an internship · can start now',
    'hero.h1a': 'I build systems that',
    'hero.h1b': 'work under real constraints.',
    'hero.lede': 'Computer Science technology student. I wrote a voice assistant that runs 100% offline on a GPU-less machine, and I build websites that exist to convert — not to decorate.',
    'hero.ctaProjects': 'See projects',
    'hero.copyMail': 'Copy e-mail',

    'metric.tests': 'automated tests',
    'metric.skills': 'skills in the assistant',
    'metric.latency': 'drop in response latency',
    'metric.offline': 'offline — zero cloud APIs',

    'sec.about': 'about', 'sec.stack': 'stack', 'sec.projects': 'projects',
    'sec.path': 'path', 'sec.contact': 'contact',

    'about.title': 'I learned to code by solving problems I actually had.',
    'about.p1': 'I started on the business side: websites and paid-traffic campaigns for real clients, where the only metric that mattered was conversion. That taught me to judge software by outcome, not by lines of code.',
    'about.p2': 'Then I moved to the engineering side. I am studying Systems Analysis and Development and I maintain Aiden, a Portuguese-language voice assistant running fully offline on a CPU-only machine with 15.7 GB of RAM — a constraint that forces good decisions instead of more hardware.',
    'about.p3': 'I am looking for an internship where I can do both: write code that holds up under tests and understand why it exists.',
    'about.f1k': 'education',   'about.f1v': 'Systems Analysis & Development · in progress',
    'about.f3k': 'focus',       'about.f3v': 'Python back-end and front-end',
    'about.f4k': 'languages',   'about.f4v': 'Portuguese native · technical English',
    'about.f5k': 'looking for', 'about.f5v': 'Remote or hybrid internship',

    'stack.title': 'What I use, and where I used it.',
    'stack.lede': 'No percentage bars. Click any technology to see only the projects it shows up in.',

    'projects.title': 'Real projects, with numbers.',
    'projects.filtering': 'filtering by',
    'projects.clear': 'clear',
    'projects.empty': 'no project with that technology yet.',
    'proj.problem': 'Problem', 'proj.solution': 'Solution', 'proj.result': 'Result',
    'proj.more': 'Read details', 'proj.less': 'Collapse',
    'proj.repo': 'Repository', 'proj.demo': 'Live demo',

    'path.title': 'How I got here.',

    'contact.title': 'I am looking for a development internship.',
    'contact.lede': 'If you have an opening, a question about any project, or want the code behind something here — just reach out. I answer fast.',
    'contact.mail': 'E-mail', 'contact.copy': 'copy',

    'foot.built': 'Hand-built · HTML, CSS and JavaScript · no framework',
    'toast.copied': 'E-mail copied to clipboard',
    'toast.failed': 'Copy failed — the address is ' + CONFIG.email,

    'palette.go': 'Go to', 'palette.open': 'Open', 'palette.action': 'Action',
    'palette.none': 'no command found'
  }
};

/* ---------- linha que digita no hero ---------- */
const TYPED = {
  pt: ['Desenvolvedor full-stack', 'Python · FastAPI · PostgreSQL', 'JavaScript · HTML · CSS', 'Estudante de ADS'],
  en: ['Full-stack developer', 'Python · FastAPI · PostgreSQL', 'JavaScript · HTML · CSS', 'CS technology student']
};

/* ---------- terminal do hero ---------- */
const TERM = {
  pt: [
    { t: 'cmd',  v: 'whoami' },
    { t: 'out',  v: 'murilo_soares — desenvolvedor full-stack, estudante de ADS' },
    { t: 'cmd',  v: 'cat foco.txt' },
    { t: 'out',  v: 'back-end em Python · front-end · banco de dados' },
    { t: 'cmd',  v: 'aiden --status' },
    { t: 'ok',   v: '● online   524 testes   27 skills   0 chamadas em nuvem' },
    { t: 'cmd',  v: 'status --vaga' },
    { t: 'ok',   v: '● procurando estágio · remoto ou híbrido' },
    { t: 'cmd',  v: '' }
  ],
  en: [
    { t: 'cmd',  v: 'whoami' },
    { t: 'out',  v: 'murilo_soares — full-stack developer, CS technology student' },
    { t: 'cmd',  v: 'cat focus.txt' },
    { t: 'out',  v: 'python back-end · front-end · databases' },
    { t: 'cmd',  v: 'aiden --status' },
    { t: 'ok',   v: '● online   524 tests   27 skills   0 cloud calls' },
    { t: 'cmd',  v: 'status --job' },
    { t: 'ok',   v: '● seeking an internship · remote or hybrid' },
    { t: 'cmd',  v: '' }
  ]
};

/* ---------- stack ---------- */
const STACK = [
  { group: { pt: 'Linguagens', en: 'Languages' }, items: [
    { n: 'JavaScript', w: { pt: 'Esta página, HUD do Aiden, landing pages', en: 'This page, Aiden HUD, landing pages' } },
    { n: 'TypeScript', w: { pt: 'Front do Painel Convertta, em modo estrito', en: 'Convertta Panel front-end, strict mode' } },
    { n: 'Python',     w: { pt: 'Aiden inteiro — pipeline de voz, API e testes', en: 'All of Aiden — voice pipeline, API and tests' } },
    { n: 'SQL',        w: { pt: 'Dez consultas de negócio, conferidas pela CI', en: 'Ten business queries, checked by CI' } },
    { n: 'C',          w: { pt: 'Estruturas de dados e alocação dinâmica', en: 'Data structures and dynamic allocation' } },
    { n: 'HTML',       w: { pt: 'Sites e landing pages para clientes', en: 'Client websites and landing pages' } },
    { n: 'CSS',        w: { pt: 'Layout responsivo sem framework', en: 'Responsive layout, no framework' } }
  ]},
  { group: { pt: 'Back-end', en: 'Back-end' }, items: [
    { n: 'FastAPI',   w: { pt: 'Servidor do Aiden, com WebSocket', en: 'Aiden server, with WebSocket' } },
    { n: 'WebSocket', w: { pt: 'Streaming de estado entre o núcleo e o HUD', en: 'State streaming between core and HUD' } },
    { n: 'REST',      w: { pt: 'Desenho de rotas e contratos de API', en: 'Route design and API contracts' } },
    { n: 'pytest',    w: { pt: '524 testes no Aiden, rodando a cada mudança', en: '524 tests in Aiden, run on every change' } },
    { n: 'Ollama',    w: { pt: 'LLM local em CPU, sem chamada em nuvem', en: 'Local CPU LLM, zero cloud calls' } }
  ]},
  { group: { pt: 'Front-end', en: 'Front-end' }, items: [
    { n: 'DOM & ES6+',      w: { pt: 'Paleta de comandos e i18n desta página', en: 'Command palette and i18n on this page' } },
    { n: 'Design responsivo', w: { pt: 'Todas as landing pages entregues', en: 'Every landing page delivered' } },
    { n: 'Acessibilidade',  w: { pt: 'Navegação por teclado e foco visível', en: 'Keyboard navigation and visible focus' } },
    { n: 'React',           w: { pt: 'Front do Painel Convertta, com Vite', en: 'Convertta Panel front-end, with Vite' } },
    { n: 'TypeScript',      w: { pt: 'Modo estrito, com o contrato da API tipado', en: 'Strict mode, API contract typed' } }
  ]},
  { group: { pt: 'Dados', en: 'Data' }, items: [
    { n: 'PostgreSQL',    w: { pt: 'Banco do Painel Convertta', en: 'Convertta Panel database' } },
    { n: 'SQLite',        w: { pt: 'Memória entre sessões do Aiden', en: 'Aiden cross-session memory' } },
    { n: 'Modelagem',     w: { pt: 'Diagrama ER e normalização', en: 'ER diagrams and normalization' } },
    { n: 'SQLAlchemy',    w: { pt: 'ORM e migrações com Alembic', en: 'ORM and Alembic migrations' } }
  ]},
  { group: { pt: 'Ferramentas', en: 'Tooling' }, items: [
    { n: 'Git',            w: { pt: 'Fluxo diário, histórico limpo', en: 'Daily workflow, clean history' } },
    { n: 'GitHub Actions', w: { pt: 'CI rodando a suíte a cada push', en: 'CI running the suite on every push' } },
    { n: 'Docker',         w: { pt: 'Ambiente reprodutível do Painel', en: 'Reproducible Panel environment' } },
    { n: 'VS Code',        w: { pt: 'Editor principal', en: 'Main editor' } },
    { n: 'Claude Code',    w: { pt: 'Par de programação no dia a dia', en: 'Daily pair-programming' } }
  ]},
  { group: { pt: 'Produto e aquisição', en: 'Product & growth' }, items: [
    { n: 'Google Ads', w: { pt: 'Campanhas reais para clientes', en: 'Real client campaigns' } },
    { n: 'Meta Ads',   w: { pt: 'Campanhas reais para clientes', en: 'Real client campaigns' } },
    { n: 'Conversão',  w: { pt: 'Páginas desenhadas em cima da métrica', en: 'Pages designed around the metric' } },
    { n: 'Office',     w: { pt: 'Relatórios e planilhas de campanha', en: 'Campaign reports and spreadsheets' } }
  ]}
];

/* ---------- projetos ---------- */
const PROJECTS = [
  {
    id: 'aiden',
    featured: true,
    year: '2026',
    status: { key: 'live', pt: 'código aberto', en: 'open source' },
    // Segunda etiqueta: o repositório é público, mas o projeto continua em
    // curso — a v4.5 mede uso e cinco decisões seguem em aberto.
    status2: { key: 'wip', pt: 'em desenvolvimento', en: 'in progress' },
    name: 'Aiden',
    tagline: {
      pt: 'Assistente de voz em português rodando 100% offline numa máquina sem GPU.',
      en: 'Portuguese voice assistant running 100% offline on a GPU-less machine.'
    },
    tags: ['Python', 'FastAPI', 'WebSocket', 'pytest', 'Ollama', 'SQLite'],
    stats: [
      { v: '524', l: { pt: 'testes', en: 'tests' } },
      { v: '27',  l: { pt: 'skills', en: 'skills' } },
      { v: { pt: '8,5s', en: '8.5s' }, l: { pt: 'até a 1ª resposta', en: 'to first answer' } },
      { v: '0',   l: { pt: 'chamadas em nuvem', en: 'cloud calls' } }
    ],
    problem: {
      pt: 'Todo assistente de voz decente depende de nuvem: latência, custo por requisição e o seu áudio saindo da máquina. Eu queria um que rodasse inteiro no meu computador, em português — e o computador é CPU-only, com 15,7 GB de RAM e sem CUDA.',
      en: 'Every decent voice assistant depends on the cloud: latency, per-request cost, and your audio leaving the machine. I wanted one that ran entirely on my computer, in Portuguese — and that computer is CPU-only, 15.7 GB of RAM, no CUDA.'
    },
    solution: {
      pt: 'Pipeline completo de voz, do microfone ao alto-falante: wake word treinada localmente → transcrição com faster-whisper → roteador de intenção com 27 skills → LLM local via Ollama → síntese com Piper → HUD na tela alimentado por WebSocket. Servidor em FastAPI, arquitetura em interfaces trocáveis e uma suíte de 524 testes que roda a cada alteração. Cada decisão de engenharia fica registrada num log de decisões que hoje tem 169 KB.',
      en: 'A full voice pipeline, microphone to speaker: locally trained wake word → faster-whisper transcription → intent router with 27 skills → local LLM via Ollama → Piper synthesis → an on-screen HUD fed over WebSocket. FastAPI server, swappable interfaces, and a 524-test suite that runs on every change. Every engineering decision is recorded in a decision log now 169 KB long.'
    },
    result: {
      pt: 'Tempo até a primeira resposta caiu de 14,8s para 8,5s (−42%) e a taxa de erro de transcrição de 31% para 24,7%, na mesma máquina e sem trocar hardware. Roda sem console, sobe com o Windows e desliga por comando de voz.',
      en: 'Time to first answer dropped from 14.8s to 8.5s (−42%) and word error rate from 31% to 24.7%, on the same machine, with no hardware change. Runs without a console, starts with Windows, shuts down by voice.'
    },
    links: [
      { href: 'https://github.com/SoaresM-dev/aiden', label: { pt: 'Repositório', en: 'Repository' } }
    ]
  },
  {
    id: 'convertta-sites',
    featured: false,
    year: '2025–2026',
    status: { key: 'live', pt: 'entregue', en: 'delivered' },
    name: 'Convertta — sites e landing pages',
    tagline: {
      pt: 'Páginas construídas em volta de uma métrica: conversão. E as campanhas que apontam para elas.',
      en: 'Pages built around one metric: conversion. And the campaigns that point at them.'
    },
    tags: ['HTML', 'CSS', 'JavaScript', 'Design responsivo', 'Google Ads', 'Meta Ads', 'Conversão'],
    stats: [
      { v: '3', l: { pt: 'segmentos atendidos', en: 'segments served' } },
      { v: '1', l: { pt: 'pessoa: página + campanha', en: 'person: page + campaign' } }
    ],
    problem: {
      pt: 'Cliente com anúncio no ar e página que não converte queima verba todo dia. Na maioria dos casos a página e a campanha são feitas por gente diferente, que não conversa — e a promessa do anúncio não é a promessa da página.',
      en: 'A client running ads with a page that does not convert burns budget every single day. Usually the page and the campaign are made by different people who never talk — and the ad promise is not the page promise.'
    },
    solution: {
      pt: 'Landing pages single-page com estética dark high-end, escritas em HTML, CSS e JavaScript puros para carregar rápido em 3G. Estrutura fixa: uma promessa, uma prova, um botão. Peças construídas para SaaS, e-commerce e escritório de advocacia. As campanhas de Google e Meta Ads que trazem o tráfego são configuradas pela mesma pessoa que escreveu a página.',
      en: 'Single-page dark, high-end landing pages written in plain HTML, CSS and JavaScript so they load fast on 3G. Fixed structure: one promise, one proof, one button. Pieces built for SaaS, e-commerce and a law firm. The Google and Meta Ads campaigns that bring the traffic are set up by the same person who wrote the page.'
    },
    result: {
      pt: 'O que o anúncio promete é exatamente o que a página entrega, porque não há repasse entre duas equipes. É de onde vem minha leitura de produto: código julgado pelo resultado, não pelo tamanho.',
      en: 'What the ad promises is exactly what the page delivers, because nothing is handed off between two teams. This is where my product instinct comes from: code judged by outcome, not by size.'
    },
    links: []
  },
  {
    id: 'painel-convertta',
    featured: true,
    year: '2026',
    status: { key: 'live', pt: 'código aberto', en: 'open source' },
    name: { pt: 'Painel Convertta', en: 'Convertta Panel' },
    tagline: {
      pt: 'Aplicação full-stack para acompanhar leads e custo por lead das campanhas — construída porque eu precisava dela.',
      en: 'Full-stack app to track leads and cost per lead across campaigns — built because I needed it.'
    },
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'React', 'TypeScript', 'Docker', 'GitHub Actions', 'REST', 'Modelagem'],
    stats: [
      { v: '43', l: { pt: 'testes em CI', en: 'tests in CI' } },
      { v: '3', l: { pt: 'entidades · escopo travado', en: 'entities · locked scope' } },
      { v: 'JWT', l: { pt: 'autenticação', en: 'authentication' } },
      { v: '1', l: { pt: 'comando para subir tudo', en: 'command to run it all' } }
    ],
    problem: {
      pt: 'Leads e campanhas de vários clientes espalhados em planilhas. Descobrir o custo por lead de uma campanha específica custava meia hora de trabalho manual.',
      en: 'Leads and campaigns for several clients scattered across spreadsheets. Finding the cost per lead of one campaign took half an hour of manual work.'
    },
    solution: {
      pt: 'API em FastAPI sobre PostgreSQL com SQLAlchemy e migrações Alembic, autenticação JWT, front em React com TypeScript em modo estrito e Vite, e Docker Compose para subir tudo com um comando. Escopo deliberadamente travado em três entidades, um painel e um login — projeto que cresce sem parar é projeto que não sai.',
      en: 'FastAPI over PostgreSQL with SQLAlchemy and Alembic migrations, JWT auth, a React + strict TypeScript front-end on Vite, and Docker Compose to bring it all up with one command. Scope deliberately locked at three entities, one dashboard and one login — a project that keeps growing is a project that never ships.'
    },
    result: {
      pt: '43 testes rodando contra PostgreSQL na CI, cada um com banco limpo. Um deles existe só para travar o erro de fan-out: juntar campanhas e leads no mesmo JOIN multiplicaria o investimento pelo número de leads — defeito que só apareceria depois de o número já ter sido mostrado ao cliente. `docker compose up` sobe banco, migrações, dados de demonstração, API e painel.',
      en: '43 tests running against PostgreSQL in CI, each with a clean database. One exists purely to pin down the fan-out bug: joining campaigns and leads in the same JOIN would multiply spend by the number of leads — a defect that would only surface after the number had been shown to the client. `docker compose up` brings up database, migrations, demo data, API and dashboard.'
    },
    links: [
      { href: 'https://github.com/SoaresM-dev/painel-convertta', label: { pt: 'Repositório', en: 'Repository' } }
    ]
  },
  {
    id: 'sql-trafego',
    featured: false,
    year: '2026',
    status: { key: 'live', pt: 'código aberto', en: 'open source' },
    name: { pt: 'Modelagem e consultas de tráfego pago', en: 'Paid-traffic modeling and queries' },
    tagline: {
      pt: 'Dez perguntas de reunião de cliente respondidas em SQL, com a saída de cada uma conferida pela CI.',
      en: 'Ten client-meeting questions answered in SQL, with every output checked by CI.'
    },
    tags: ['SQL', 'PostgreSQL', 'Modelagem', 'GitHub Actions'],
    stats: [
      { v: '10', l: { pt: 'consultas de negócio', en: 'business queries' } },
      { v: '6', l: { pt: 'tabelas em estrela', en: 'star-schema tables' } },
      { v: { pt: '3,6×', en: '3.6\u00d7' }, l: { pt: 'ganho medido com índice', en: 'measured index speedup' } }
    ],
    problem: {
      pt: 'Repositório de SQL costuma ser um arquivo de consultas que ninguém consegue verificar. Se a semente usa random(), nenhuma saída pode ser comparada com nada — o repositório inteiro vira "confia em mim".',
      en: 'A SQL repo is usually a file of queries nobody can verify. If the seed uses random(), no output can be compared to anything — the whole repo becomes "trust me".'
    },
    solution: {
      pt: 'Modelo em estrela para métricas de tráfego pago, com CHECKs que impedem CTR acima de 100% e receita contada duas vezes. A semente é determinística: os números vêm de md5() convertido para inteiro, sem random() em lugar nenhum. A CI sobe um PostgreSQL 16, semeia e compara a saída das dez consultas com arquivos esperados. As consultas usam LAG, ROW_NUMBER com PARTITION BY, SUM OVER, PERCENTILE_CONT, FILTER, NOT EXISTS e HAVING sobre agregado.',
      en: 'A star schema for paid-traffic metrics, with CHECKs that make CTR above 100% and double-counted revenue impossible. The seed is deterministic: numbers come from md5() cast to integer, with no random() anywhere. CI spins up PostgreSQL 16, seeds it and compares all ten query outputs against expected files. The queries use LAG, ROW_NUMBER with PARTITION BY, SUM OVER, PERCENTILE_CONT, FILTER, NOT EXISTS and HAVING over aggregates.'
    },
    result: {
      pt: 'A semente planta de propósito os casos que duas consultas existem para achar — campanha que gasta sem converter e cliente que parou de receber lead — porque consulta que nunca devolve linha não prova nada. A medição de índice está registrada com EXPLAIN ANALYZE, inclusive uma previsão minha que a medição desmentiu.',
      en: 'The seed deliberately plants the cases two of the queries exist to catch — a campaign burning budget without converting, and a client that stopped receiving leads — because a query that never returns a row proves nothing. The index measurement is recorded with EXPLAIN ANALYZE, including a prediction of mine the measurement disproved.'
    },
    links: [
      { href: 'https://github.com/SoaresM-dev/sql-trafego-pago', label: { pt: 'Repositório', en: 'Repository' } }
    ]
  },
  {
    id: 'estruturas-c',
    featured: false,
    year: '2026',
    status: { key: 'live', pt: 'código aberto', en: 'open source' },
    name: { pt: 'Estruturas de dados em C', en: 'Data structures in C' },
    tagline: {
      pt: 'Biblioteca própria de listas, pilhas e filas com alocação dinâmica — o fundamento sem atalho.',
      en: 'A hand-written library of lists, stacks and queues with dynamic allocation — fundamentals, no shortcuts.'
    },
    tags: ['C', 'Modelagem', 'GitHub Actions'],
    stats: [
      { v: '0', l: { pt: 'vazamentos, medidos no Valgrind', en: 'leaks, measured by Valgrind' } },
      { v: '23', l: { pt: 'testes', en: 'tests' } },
      { v: { pt: '2.358×', en: '2,358\u00d7' }, l: { pt: 'lista mais lenta que vetor', en: 'list slower than array' } }
    ],
    problem: {
      pt: 'Framework esconde estrutura de dados. Quem só usa lista pronta não sabe o que acontece quando ela cresce.',
      en: 'Frameworks hide data structures. If you only ever use a ready-made list, you do not know what happens when it grows.'
    },
    solution: {
      pt: 'Vetor dinâmico, lista duplamente encadeada e fila circular, em C11 estrito, sem uma única extensão de compilador. As três existem porque a escolha entre elas é o assunto: o vetor tem acesso O(1), a lista tem inserção O(1) nas duas pontas, a fila circular troca um malloc por elemento por um arranjo reaproveitado e contíguo.',
      en: 'Dynamic array, doubly linked list and circular queue, in strict C11 with no compiler extensions. All three exist because choosing between them is the point: the array has O(1) access, the list has O(1) insertion at both ends, and the circular queue trades one malloc per element for a reused, contiguous array.'
    },
    result: {
      pt: '23 testes cobrindo os defeitos clássicos, não o caminho feliz: a cauda que fica pendurada quando a lista esvazia e volta a encher, e a fila que dá a volta no arranjo e sai fora de ordem. Valgrind com 82 alocações e 82 liberações, gcc e clang com -Werror, e uma bancada que mede o que a teoria promete — em 64 mil elementos, o acesso por índice na lista custa 2.358× o do vetor.',
      en: '23 tests covering the classic defects rather than the happy path: the tail left dangling when a list empties and refills, and the queue wrapping around the array and coming out in the wrong order. Valgrind reports 82 allocations and 82 frees; gcc and clang both run with -Werror; and a benchmark measures what the theory promises — at 64k elements, indexed access on the list costs 2,358× the array.'
    },
    links: [
      { href: 'https://github.com/SoaresM-dev/estruturas-c', label: { pt: 'Repositório', en: 'Repository' } }
    ]
  }
];

/* ---------- trajetória ---------- */
const TIMELINE = [
  {
    when: { pt: 'Antes do código', en: 'Before the code' },
    title: { pt: 'Freelance: sites e tráfego pago', en: 'Freelance: websites and paid traffic' },
    body: {
      pt: 'Sites e landing pages para clientes reais, com campanhas de Google e Meta Ads rodando por cima. Aprendi a medir trabalho por resultado antes de aprender a medir por teste.',
      en: 'Websites and landing pages for real clients, with Google and Meta Ads campaigns running on top. I learned to measure work by outcome before I learned to measure it by tests.'
    }
  },
  {
    when: { pt: 'A virada para a engenharia', en: 'The turn to engineering' },
    title: { pt: 'ADS e a Convertta', en: 'College and Convertta' },
    body: {
      pt: 'Entrei em Análise e Desenvolvimento de Sistemas e organizei o trabalho freelance sob a marca Convertta. O lado do negócio virou base para o lado técnico, não substituto dele.',
      en: 'I started a Systems Analysis and Development degree and organized the freelance work under the Convertta brand. The business side became the foundation for the technical one, not a substitute for it.'
    }
  },
  {
    when: { pt: 'O projeto que puxou tudo', en: 'The project that pulled everything' },
    title: { pt: 'Aiden: da v1 à v4', en: 'Aiden: v1 to v4' },
    body: {
      pt: 'Pipeline de voz completo em quatro versões: streaming de fala, roteador de intenção, 27 skills, memória entre sessões e wake word treinada localmente. De 37 para 428 testes, latência de 14,8s para 8,5s.',
      en: 'A full voice pipeline across four versions: speech streaming, intent router, 27 skills, cross-session memory and a locally trained wake word. From 37 to 428 tests, latency from 14.8s to 8.5s.'
    }
  },
  {
    when: { pt: 'A regra que mudou o rumo', en: 'The rule that changed course' },
    title: { pt: 'Capacidade não exercitada não conta', en: 'Capability not exercised does not count' },
    body: {
      pt: '428 testes contra 16 turnos de uso real. O diagnóstico virou regra: capacidade não exercitada não conta como entregue. A versão seguinte deixou de acrescentar função e passou a medir uso — 524 testes, widget na tela, desligamento por voz.',
      en: '428 tests and 27 skills against 16 turns of real use. That diagnosis became a rule: capability that is not exercised does not count as delivered. The next version stopped adding features and started measuring use — 524 tests, on-screen widget, voice shutdown.'
    }
  },
  {
    when: { pt: 'Agora', en: 'Now' },
    title: { pt: 'Buscando estágio', en: 'Looking for an internship' },
    body: {
      pt: 'Repositório do Aiden aberto ao público, Painel Convertta em construção, e a procura por um time onde eu seja o júnior que aprende rápido porque já constrói sozinho.',
      en: 'The Aiden repository is public, the Convertta Panel is under construction, and I am looking for a team where I can be the junior who learns fast because he already builds on his own.'
    }
  }
];


/* ---------- rótulos das tecnologias em EN (a chave interna continua em PT) ---------- */
const TAG_LABELS = {
  'Design responsivo': { pt: 'Design responsivo', en: 'Responsive design' },
  'Acessibilidade':    { pt: 'Acessibilidade',    en: 'Accessibility' },
  'Modelagem':         { pt: 'Modelagem',         en: 'Data modeling' },
  'Conversão':         { pt: 'Conversão',         en: 'Conversion' }
};
