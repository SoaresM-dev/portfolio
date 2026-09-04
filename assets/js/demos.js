/* ============================================================
   demos.js — a demonstração de cada projeto.

   Carregado **sob demanda**, no primeiro clique em "Demo". A página
   inicial continua com o mesmo peso de antes: quem só lê os cartões
   nunca baixa este arquivo nem o corpus de SQL que vem com ele.

   Regra que vale para todas: a demo diz o que ela é. Cálculo que roda
   de verdade no navegador é anunciado como tal; dado tirado do
   repositório é anunciado como tal; e o que foi reconstruído para
   caber aqui é anunciado como reconstrução. Demonstração que passa
   simulação por execução é a mesma coisa que print de terminal
   falsificado — resolve a primeira impressão e destrói a segunda.
   ============================================================ */
(function () {
  'use strict';

  /* Construtor de nó minúsculo. Usar `textContent` em vez de montar
     string com HTML tira a categoria inteira de erro de escape: nada do
     que o visitante digita chega a ser interpretado como marcação. */
  function el(tag, props, kids) {
    const n = document.createElement(tag);
    if (props) {
      for (const k in props) {
        if (k === 'class') n.className = props[k];
        else if (k === 'text') n.textContent = props[k];
        else if (k === 'html') n.innerHTML = props[k];
        else if (k.startsWith('on')) n.addEventListener(k.slice(2), props[k]);
        else if (props[k] !== null && props[k] !== undefined) n.setAttribute(k, props[k]);
      }
    }
    (kids || []).forEach(c => { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  /** Barra de botões que se comportam como abas de rádio. */
  function abas(itens, aoTrocar) {
    const barra = el('div', { class: 'dm-abas', role: 'tablist' });
    const botoes = itens.map((it, i) => {
      const b = el('button', {
        class: 'dm-aba' + (i === 0 ? ' is-on' : ''), type: 'button', role: 'tab',
        'aria-selected': i === 0 ? 'true' : 'false', text: it.rotulo,
        onclick: () => {
          botoes.forEach(x => { x.classList.remove('is-on'); x.setAttribute('aria-selected', 'false'); });
          b.classList.add('is-on'); b.setAttribute('aria-selected', 'true');
          aoTrocar(it, i);
        }
      });
      barra.appendChild(b);
      return b;
    });
    return barra;
  }

  const bloco = (titulo, ...kids) => el('div', { class: 'dm-bloco' }, [
    titulo ? el('h4', { class: 'dm-h', text: titulo }) : null, ...kids
  ]);

  const linhaChave = (k, v, classe) => el('div', { class: 'dm-kv' + (classe ? ' ' + classe : '') }, [
    el('span', { class: 'dm-k', text: k }), el('span', { class: 'dm-v mono', text: v })
  ]);

  /* ============================================================
     1. Aiden — o roteador de intenção
     ============================================================ */

  /* Os padrões abaixo são uma **amostra reduzida**: o sistema real tem 27
     skills, cada uma declarando os próprios padrões. O que está reproduzido
     fielmente é a mecânica da decisão — a normalização e o limiar de
     confiança de 0,7 são os do `core/roteador.py`. */
  const PADROES = [
    { skill: 'hora_data',  nome: { pt: 'Hora e data', en: 'Time and date' },     re: /\b(que horas|qual a hora|que dia e hoje|qual a data)\b/, conf: 1.0 },
    { skill: 'timer',      nome: { pt: 'Timer e pomodoro', en: 'Timer and pomodoro' }, re: /\b(pomodoro|timer|\d+ ?minutos?)\b/, conf: 0.95 },
    { skill: 'lembretes',  nome: { pt: 'Lembretes', en: 'Reminders' },           re: /\b(lembrete|me lembra|lembra de)\b/, conf: 0.9 },
    { skill: 'musica',     nome: { pt: 'Música', en: 'Music' },                  re: /\b(toca|tocar|musica|pausa|proxima faixa)\b/, conf: 0.85 },
    { skill: 'tarefas',    nome: { pt: 'Tarefas', en: 'Tasks' },                 re: /\b(tarefa|tarefas|anota|anotar)\b/, conf: 0.85 },
    { skill: 'sistema',    nome: { pt: 'Sistema', en: 'System' },                re: /\b(abrir|abre|fechar|volume)\b/, conf: 0.8 },
    { skill: 'encerrar',   nome: { pt: 'Encerrar', en: 'Shut down' },            re: /\b(desliga|encerrar|tchau|ate logo)\b/, conf: 1.0 }
  ];
  const LIMIAR = 0.7;

  /* Igual à `normalizar()` do roteador: minúsculas, sem acento, espaços
     simples. Existe porque o transcritor troca acentuação e pontuação, e
     um padrão que só casa com o texto perfeito não casa quase nunca. */
  function normalizar(texto) {
    return texto.toLowerCase().trim()
      .normalize('NFD').replace(/\p{M}/gu, '')
      .replace(/\s+/g, ' ');
  }

  function rotear(texto) {
    const limpo = normalizar(texto);
    let melhor = null;
    for (const p of PADROES) {
      if (p.re.test(limpo) && (melhor === null || p.conf > melhor.conf)) melhor = p;
    }
    return { limpo, padrao: melhor, viaSkill: melhor !== null && melhor.conf >= LIMIAR };
  }

  const EXEMPLOS_AIDEN = [
    'Que horas são agora?',
    'Inicia um pomodoro',
    'Me lembra de ligar pro cliente',
    'O que você acha de aprender Rust?'
  ];

  function demoAiden(host, ctx) {
    const T = ctx.lang === 'en' ? {
      titulo: 'Type a command — the router decides',
      dica: 'Or pick one of the examples. The assistant works in Portuguese — these are real trigger phrases, not translated ones.',
      normal: 'normalized', padrao: 'matched pattern', conf: 'confidence',
      nenhum: 'no pattern above the threshold',
      caminho: 'path taken', skill: 'Skill answers locally', llm: 'Falls through to the local LLM',
      custo: 'cost', enviar: 'Route'
    } : {
      titulo: 'Digite um comando — o roteador decide',
      dica: 'Ou escolha um dos exemplos.',
      normal: 'normalizado', padrao: 'padrão casado', conf: 'confiança',
      nenhum: 'nenhum padrão acima do limiar',
      caminho: 'caminho tomado', skill: 'A skill responde localmente', llm: 'Cai para o LLM local',
      custo: 'custo', enviar: 'Rotear'
    };

    const saida = el('div', { class: 'dm-saida' });
    const campo = el('input', {
      class: 'dm-input', type: 'text', value: EXEMPLOS_AIDEN[0],
      'aria-label': T.titulo, spellcheck: 'false'
    });

    function desenhar() {
      const r = rotear(campo.value);
      saida.textContent = '';

      const passos = el('ol', { class: 'dm-passos' }, [
        el('li', {}, [el('span', { class: 'dm-k', text: T.normal }), el('code', { class: 'mono', text: r.limpo || '—' })]),
        el('li', {}, [
          el('span', { class: 'dm-k', text: T.padrao }),
          el('code', { class: 'mono', text: r.padrao ? r.padrao.skill : T.nenhum })
        ]),
        el('li', {}, [
          el('span', { class: 'dm-k', text: T.conf }),
          el('code', { class: 'mono', text: r.padrao ? r.padrao.conf.toFixed(2) + ' ≥ ' + LIMIAR.toFixed(2) : '< ' + LIMIAR.toFixed(2) })
        ])
      ]);

      const via = el('div', { class: 'dm-rota ' + (r.viaSkill ? 'is-skill' : 'is-llm') }, [
        el('span', { class: 'dm-rota__nome', text: r.viaSkill ? T.skill : T.llm }),
        el('span', { class: 'dm-rota__meta mono', text: r.viaSkill ? '~0,1 s' : '~3 s' })
      ]);

      saida.appendChild(passos);
      saida.appendChild(el('div', { class: 'dm-k dm-k--sec', text: T.caminho }));
      saida.appendChild(via);
    }

    campo.addEventListener('input', desenhar);

    const chips = el('div', { class: 'dm-chips' }, EXEMPLOS_AIDEN.map(ex =>
      el('button', { class: 'dm-chip', type: 'button', text: ex, onclick: () => { campo.value = ex; desenhar(); } })
    ));

    host.appendChild(bloco(T.titulo,
      el('div', { class: 'dm-linha' }, [campo]),
      el('p', { class: 'dm-nota', text: T.dica }),
      chips
    ));
    host.appendChild(saida);
    desenhar();
  }

  /* ============================================================
     2. Convertta — sites e landing pages
     ============================================================ */

  const PECAS = [
    {
      id: 'saas', rotulo: { pt: 'SaaS', en: 'SaaS' }, acento: '#22d3ee',
      marca: 'Fluxo', dominio: 'fluxo.app',
      h1: { pt: 'Feche o mês em 20 minutos, não em três dias.', en: 'Close the month in 20 minutes, not three days.' },
      sub: { pt: 'Conciliação bancária automática para pequenas contabilidades.', en: 'Automatic bank reconciliation for small accounting firms.' },
      prova: { pt: '"Passei de 3 dias para 20 minutos por cliente." — Ana R., 40 clientes na carteira', en: '"From 3 days to 20 minutes per client." — Ana R., 40 clients' },
      cta: { pt: 'Testar 14 dias grátis', en: 'Start 14-day trial' },
      selo: { pt: 'sem cartão', en: 'no card' }
    },
    {
      id: 'ecom', rotulo: { pt: 'E-commerce', en: 'E-commerce' }, acento: '#f5b544',
      marca: 'Raiz', dominio: 'raizcafe.com.br',
      h1: { pt: 'Café torrado na quinta. Na sua casa na segunda.', en: 'Roasted Thursday. At your door Monday.' },
      sub: { pt: 'Assinatura de grãos especiais, moagem escolhida por você.', en: 'Specialty bean subscription, ground the way you choose.' },
      prova: { pt: '4,9 ★ em 1.238 avaliações · frete grátis acima de R$ 90', en: '4.9 ★ from 1,238 reviews · free shipping over R$ 90' },
      cta: { pt: 'Montar minha assinatura', en: 'Build my subscription' },
      selo: { pt: 'cancela quando quiser', en: 'cancel anytime' }
    },
    {
      id: 'adv', rotulo: { pt: 'Advocacia', en: 'Law firm' }, acento: '#c7b299',
      marca: 'Ramos', dominio: 'ramosadvocacia.adv.br',
      h1: { pt: 'Demitido sem receber o que era seu?', en: 'Dismissed without what you were owed?' },
      sub: { pt: 'Análise gratuita do seu caso trabalhista em até 24 horas.', en: 'Free review of your employment case within 24 hours.' },
      prova: { pt: 'OAB/SP 000.000 · 14 anos de atuação · atendimento em todo o estado', en: 'Bar #000.000 · 14 years practising · statewide' },
      cta: { pt: 'Falar com o advogado', en: 'Talk to a lawyer' },
      selo: { pt: 'resposta em 24 h', en: '24 h reply' }
    }
  ];

  function demoSites(host, ctx) {
    const tx = ctx.tx;
    const T = ctx.lang === 'en' ? {
      titulo: 'Three pieces, one structure',
      estrutura: 'One promise · one proof · one button',
      legenda: ['the promise, above the fold', 'the proof that makes it believable', 'a single button — no competing choices']
    } : {
      titulo: 'Três peças, uma estrutura',
      estrutura: 'Uma promessa · uma prova · um botão',
      legenda: ['a promessa, acima da dobra', 'a prova que a torna crível', 'um botão só — sem escolha concorrente']
    };

    const palco = el('div', { class: 'dm-palco' });

    function pintar(p) {
      palco.textContent = '';
      const pagina = el('div', { class: 'dm-lp', style: '--lp-acc:' + p.acento }, [
        el('div', { class: 'dm-lp__chrome' }, [
          el('span', { class: 'dm-lp__dots' }),
          el('span', { class: 'dm-lp__url mono', text: p.dominio })
        ]),
        el('div', { class: 'dm-lp__corpo' }, [
          el('span', { class: 'dm-lp__marca mono', text: p.marca }),
          el('h5', { class: 'dm-lp__h1', text: tx(p.h1) }),
          el('p', { class: 'dm-lp__sub', text: tx(p.sub) }),
          el('div', { class: 'dm-lp__cta' }, [
            el('span', { class: 'dm-lp__btn', text: tx(p.cta) }),
            el('span', { class: 'dm-lp__selo', text: tx(p.selo) })
          ]),
          el('p', { class: 'dm-lp__prova', text: tx(p.prova) })
        ])
      ]);

      const marcas = el('ol', { class: 'dm-anota' }, T.legenda.map(l => el('li', { text: l })));
      palco.appendChild(pagina);
      palco.appendChild(marcas);
    }

    host.appendChild(bloco(T.titulo,
      abas(PECAS.map(p => ({ rotulo: tx(p.rotulo), peca: p })), (it) => pintar(it.peca)),
      el('p', { class: 'dm-nota', text: T.estrutura })
    ));
    host.appendChild(palco);
    pintar(PECAS[0]);
  }

  /* ============================================================
     3. Painel Convertta — a gravação e o app no ar
     ============================================================ */

  const PAINEL_URL = 'https://painel-convertta-web.onrender.com';

  function demoPainel(host, ctx) {
    const T = ctx.lang === 'en' ? {
      titulo: 'The panel in fifteen seconds',
      abrir: 'Open the live version',
      nova: 'Open in a new tab ↗',
      espera: 'The free plan hibernates after ~15 min idle. The first load can take up to a minute — it is the container waking up, migrating and seeding. It did not break.',
      conta: 'Demo account is pre-filled: just click Entrar.'
    } : {
      titulo: 'O painel em quinze segundos',
      abrir: 'Abrir a versão ao vivo',
      nova: 'Abrir em nova aba ↗',
      espera: 'O plano gratuito hiberna após ~15 min ociosos. A primeira abertura pode levar até um minuto — é o contêiner subindo, migrando e semeando. Não quebrou.',
      conta: 'A conta demo já vem preenchida: é só clicar em Entrar.'
    };

    const palco = el('div', { class: 'dm-palco' });
    const gif = el('img', {
      class: 'dm-gif', src: 'assets/demos/painel-convertta.gif', loading: 'lazy',
      alt: ctx.lang === 'en'
        ? 'Login, dashboard with demo numbers, period switch and a client drill-down'
        : 'Login, painel com os números da conta demo, troca de período e o detalhe de um cliente'
    });

    function mostrarGif() {
      palco.textContent = '';
      palco.appendChild(gif);
      palco.appendChild(el('div', { class: 'dm-acoes' }, [
        el('button', { class: 'dm-btn', type: 'button', text: T.abrir, onclick: mostrarAoVivo }),
        el('a', { class: 'dm-btn dm-btn--sec', href: PAINEL_URL, target: '_blank', rel: 'noopener', text: T.nova })
      ]));
    }

    function mostrarAoVivo() {
      palco.textContent = '';
      palco.appendChild(el('p', { class: 'dm-aviso', text: T.espera }));
      palco.appendChild(el('iframe', {
        class: 'dm-frame', src: PAINEL_URL, loading: 'lazy',
        title: 'Painel Convertta', referrerpolicy: 'no-referrer'
      }));
      palco.appendChild(el('div', { class: 'dm-acoes' }, [
        el('p', { class: 'dm-nota', text: T.conta }),
        el('a', { class: 'dm-btn dm-btn--sec', href: PAINEL_URL, target: '_blank', rel: 'noopener', text: T.nova })
      ]));
    }

    host.appendChild(bloco(T.titulo));
    host.appendChild(palco);
    mostrarGif();
  }

  /* ============================================================
     4. Consulta de CNPJ — a validação, rodando aqui
     ============================================================ */

  const PESOS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const PESOS_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const apenasDigitos = (s) => s.replace(/\D/g, '');

  function digitoVerificador(digitos, pesos) {
    const soma = pesos.reduce((acc, peso, i) => acc + peso * (digitos[i] || 0), 0);
    const resto = soma % 11;
    return { soma, resto, digito: resto < 2 ? 0 : 11 - resto };
  }

  function analisarCnpj(entrada) {
    const limpo = apenasDigitos(entrada);
    if (limpo.length !== 14) return { limpo, erro: 'tamanho' };
    if (/^(\d)\1{13}$/.test(limpo)) return { limpo, erro: 'repetido' };
    const d = [...limpo].map(Number);
    const p = digitoVerificador(d, PESOS_1);
    const s = digitoVerificador(d, PESOS_2);
    return { limpo, primeiro: p, segundo: s, valido: p.digito === d[12] && s.digito === d[13], d };
  }

  const formatarCnpj = (s) => {
    const d = apenasDigitos(s);
    return d.length !== 14 ? s : `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  };

  const EXEMPLOS_CNPJ = [
    { rotulo: { pt: 'válido', en: 'valid' }, v: '19.131.243/0001-97' },
    { rotulo: { pt: 'dígito trocado', en: 'wrong digit' }, v: '19.131.243/0001-98' },
    { rotulo: { pt: 'repetido', en: 'repeated' }, v: '00.000.000/0000-00' },
    { rotulo: { pt: 'curto', en: 'too short' }, v: '19.131.243' }
  ];

  function demoCnpj(host, ctx) {
    const tx = ctx.tx;
    const T = ctx.lang === 'en' ? {
      titulo: 'Check digits, computed in your browser',
      sub: 'This is the repository algorithm, running for real — nothing is sent anywhere.',
      soma: 'weighted sum', resto: 'remainder mod 11', esperado: 'expected digit', encontrado: 'digit found',
      primeiro: 'First check digit', segundo: 'Second check digit',
      valido: 'Valid — worth a network call', invalido: 'Invalid — no network call is made',
      curto: 'Needs fourteen digits.', repetido: 'Fourteen repeated digits pass the arithmetic by accident. The algorithm rejects them explicitly.',
      porque: 'Why validate before calling: the provider is a free, volunteer-run public service. Sending it a number arithmetic already proves wrong burns someone else\'s quota — and hands the user a network error when the honest answer is "those digits do not add up".',
      resposta: 'What the API would return'
    } : {
      titulo: 'Dígito verificador, calculado no seu navegador',
      sub: 'É o algoritmo do repositório, rodando de verdade — nada é enviado para lugar nenhum.',
      soma: 'soma ponderada', resto: 'resto por 11', esperado: 'dígito esperado', encontrado: 'dígito informado',
      primeiro: 'Primeiro verificador', segundo: 'Segundo verificador',
      valido: 'Válido — vale a chamada de rede', invalido: 'Inválido — nenhuma chamada de rede é feita',
      curto: 'Precisa dos catorze dígitos.', repetido: 'Catorze dígitos repetidos passam na aritmética por acidente. O algoritmo recusa explicitamente.',
      porque: 'Por que validar antes de chamar: o fornecedor é um serviço público e gratuito, mantido por voluntários. Mandar para lá um número que a aritmética já prova inválido gasta cota de terceiro com lixo — e ainda devolve ao usuário um erro de rede quando a resposta certa é "esses dígitos não fecham".',
      resposta: 'O que a API devolveria'
    };

    const saida = el('div', { class: 'dm-saida' });
    const campo = el('input', {
      class: 'dm-input mono', type: 'text', value: EXEMPLOS_CNPJ[0].v,
      'aria-label': T.titulo, spellcheck: 'false', inputmode: 'numeric', maxlength: '18'
    });

    function passo(rotulo, r, informado) {
      return el('div', { class: 'dm-calc' }, [
        el('span', { class: 'dm-k', text: rotulo }),
        linhaChave(T.soma, String(r.soma)),
        linhaChave(T.resto, String(r.resto)),
        linhaChave(T.esperado, String(r.digito)),
        linhaChave(T.encontrado, String(informado), r.digito === informado ? 'is-ok' : 'is-bad')
      ]);
    }

    function desenhar() {
      const a = analisarCnpj(campo.value);
      saida.textContent = '';

      if (a.erro === 'tamanho') { saida.appendChild(el('p', { class: 'dm-aviso', text: T.curto })); return; }
      if (a.erro === 'repetido') {
        saida.appendChild(el('div', { class: 'dm-veredito is-bad', text: T.invalido }));
        saida.appendChild(el('p', { class: 'dm-nota', text: T.repetido }));
        return;
      }

      saida.appendChild(el('div', { class: 'dm-calcs' }, [
        passo(T.primeiro, a.primeiro, a.d[12]),
        passo(T.segundo, a.segundo, a.d[13])
      ]));
      saida.appendChild(el('div', { class: 'dm-veredito ' + (a.valido ? 'is-ok' : 'is-bad'), text: a.valido ? T.valido : T.invalido }));

      if (a.valido) {
        saida.appendChild(el('div', { class: 'dm-k dm-k--sec', text: T.resposta }));
        saida.appendChild(el('pre', { class: 'dm-json mono', text: JSON.stringify({
          empresa: {
            cnpj: a.limpo,
            cnpjFormatado: formatarCnpj(a.limpo),
            razaoSocial: '…',
            situacao: 'ATIVA',
            porte: 'DEMAIS',
            municipio: '…', uf: '..'
          },
          origem: 'fornecedor',
          consultadoEm: new Date().toISOString()
        }, null, 2) }));
      }
      saida.appendChild(el('p', { class: 'dm-nota', text: T.porque }));
    }

    campo.addEventListener('input', desenhar);

    host.appendChild(bloco(T.titulo,
      el('div', { class: 'dm-linha' }, [campo]),
      el('p', { class: 'dm-nota', text: T.sub }),
      el('div', { class: 'dm-chips' }, EXEMPLOS_CNPJ.map(ex =>
        el('button', { class: 'dm-chip', type: 'button', text: tx(ex.rotulo), onclick: () => { campo.value = ex.v; desenhar(); } })
      ))
    ));
    host.appendChild(saida);
    desenhar();
  }

  /* ============================================================
     5. SQL — as dez perguntas, com a saída que a CI confere
     ============================================================ */

  const PERGUNTAS_EN = {
    '01': 'What did each lead cost, per client, over the last 30 days?',
    '02': 'Which campaigns return more than they cost (ROAS)?',
    '03': 'Is cost per lead rising or falling month over month?',
    '04': 'At which stage does each campaign lose people?',
    '05': 'What is the best campaign for each client?',
    '06': 'Where am I spending with no return?',
    '07': 'On which weekday is a lead cheapest?',
    '08': 'How long does a lead take to become a sale?',
    '09': 'Which active client stopped receiving leads?',
    '10': 'Who is going to blow the budget, and on what day?'
  };

  function demoSql(host, ctx) {
    const T = ctx.lang === 'en' ? {
      titulo: 'Pick a client-meeting question',
      saida: 'Output', linhas: 'rows', vazio: 'SQL corpus unavailable.',
      nota: 'The query and the output are the repository files, verbatim. Only the question labels are translated. CI runs each query against a freshly seeded PostgreSQL and fails if the output differs by one character.'
    } : {
      titulo: 'Escolha uma pergunta de reunião de cliente',
      saida: 'Saída', linhas: 'linhas', vazio: 'Corpus de SQL indisponível.',
      nota: 'A consulta e a saída são os arquivos do repositório. A CI roda a consulta contra um PostgreSQL recém-semeado e reprova se a saída diferir num caractere.'
    };

    if (typeof SQL_DEMO === 'undefined' || !SQL_DEMO.length) {
      host.appendChild(el('p', { class: 'dm-aviso', text: T.vazio }));
      return;
    }

    const palco = el('div', { class: 'dm-saida' });

    function pintar(q) {
      palco.textContent = '';
      palco.appendChild(el('div', { class: 'dm-chips dm-chips--tec' },
        q.tecnicas.map(t => el('span', { class: 'dm-tec mono', text: t }))));
      palco.appendChild(el('div', { class: 'dm-k dm-k--sec', text: q.arquivo }));
      palco.appendChild(el('pre', { class: 'dm-sql mono', text: q.sql }));

      const tabela = el('table', { class: 'dm-tab' }, [
        el('thead', {}, [el('tr', {}, q.colunas.map(c => el('th', { text: c })))]),
        el('tbody', {}, q.linhas.map(l => el('tr', {}, l.map((v, i) =>
          el('td', { class: /^-?[\d.,]*$/.test(v) && v !== '' ? 'num' : '', text: v === '' ? '—' : v })
        ))))
      ]);
      palco.appendChild(el('div', { class: 'dm-k dm-k--sec', text: T.saida + ' · ' + q.linhas.length + ' ' + T.linhas }));
      palco.appendChild(el('div', { class: 'dm-rolagem' }, [tabela]));
    }

    const lista = el('ol', { class: 'dm-perguntas' }, SQL_DEMO.map((q, i) => {
      const b = el('button', {
        class: 'dm-pergunta' + (i === 0 ? ' is-on' : ''), type: 'button',
        onclick: () => {
          [...lista.querySelectorAll('.dm-pergunta')].forEach(x => x.classList.remove('is-on'));
          b.classList.add('is-on');
          pintar(q);
        }
      }, [
        el('span', { class: 'dm-num mono', text: q.id }),
        el('span', { text: (ctx.lang === 'en' && PERGUNTAS_EN[q.id]) || q.pergunta })
      ]);
      return el('li', {}, [b]);
    }));

    host.appendChild(bloco(T.titulo, lista, el('p', { class: 'dm-nota', text: T.nota })));
    host.appendChild(palco);
    pintar(SQL_DEMO[0]);
  }

  /* ============================================================
     6. Estruturas de dados em C
     ============================================================ */

  const CAP_MINIMA = 8;   // CAPACIDADE_MINIMA, em src/vetor.c
  const CAP_FILA = 6;     // a fila tem capacidade fixa por design

  /* A bancada é a tabela medida do README do repositório, não uma estimativa. */
  const BANCADA = [
    { n: '1000', vetor: '0.008', lista: '0.770', razao: '96×' },
    { n: '4000', vetor: '0.016', lista: '3.811', razao: '238×' },
    { n: '16000', vetor: '0.007', lista: '15.808', razao: '2258×' },
    { n: '64000', vetor: '0.027', lista: '63.677', razao: '2358×' }
  ];

  function demoC(host, ctx) {
    const T = ctx.lang === 'en' ? {
      vetor: 'Dynamic array', lista: 'Doubly linked list', fila: 'Circular queue',
      inserir: 'insert', remover: 'remove', frente: 'at front', fundo: 'at back', limpar: 'reset',
      cap: 'capacity', tam: 'size', cheia: 'queue is full — it returns 0, it does not grow',
      cresceu: 'realloc: capacity doubled', vazio: 'empty',
      semAloc: 'capacity 0 — nothing allocated yet; the array pointer is still NULL',
      bancada: 'The benchmark, measured', colN: 'elements', colV: 'array (ms)', colL: 'list (ms)', colR: 'ratio',
      bancadaNota: 'Indexed access, 2,000 reads at scattered positions. The array column does not move; the list column quadruples when n quadruples.',
      notaV: 'Capacity starts at 8 and doubles. Growing by a constant instead would make n insertions cost O(n²).',
      notaL: 'Each node carries prev and next. Insertion at either end is O(1) — indexed access is not.',
      notaF: 'Fixed capacity on purpose: that is what makes it useful as a pressure limit. Head and tail wrap around the same array.'
    } : {
      vetor: 'Vetor dinâmico', lista: 'Lista duplamente encadeada', fila: 'Fila circular',
      inserir: 'inserir', remover: 'remover', frente: 'na frente', fundo: 'no fim', limpar: 'zerar',
      cap: 'capacidade', tam: 'tamanho', cheia: 'fila cheia — devolve 0, não cresce',
      cresceu: 'realloc: capacidade dobrou', vazio: 'vazia',
      semAloc: 'capacidade 0 — nada alocado ainda; o ponteiro do vetor ainda é NULL',
      bancada: 'A bancada, medida', colN: 'elementos', colV: 'vetor (ms)', colL: 'lista (ms)', colR: 'razão',
      bancadaNota: 'Acesso por índice, 2.000 leituras em posições espalhadas. A coluna do vetor não se move; a da lista quadruplica quando n quadruplica.',
      notaV: 'A capacidade começa em 8 e dobra. Crescer de um em um faria n inserções custarem O(n²).',
      notaL: 'Cada nó carrega anterior e próximo. Inserir em qualquer ponta é O(1) — acesso por índice não é.',
      notaF: 'Capacidade fixa de propósito: é o que a torna útil como limite de pressão. Início e fim dão a volta no mesmo arranjo.'
    };

    const palco = el('div', { class: 'dm-saida' });
    let modo = 'vetor';
    let proximo = 1;

    const vetor = { dados: [], cap: 0 };
    const lista = [];
    const fila = { buf: new Array(CAP_FILA).fill(null), inicio: 0, tam: 0 };
    let aviso = null;

    function zerar() {
      vetor.dados = []; vetor.cap = 0;
      lista.length = 0;
      fila.buf = new Array(CAP_FILA).fill(null); fila.inicio = 0; fila.tam = 0;
      proximo = 1; aviso = null;
      pintar();
    }

    function inserirVetor() {
      aviso = null;
      if (vetor.dados.length === vetor.cap) {
        vetor.cap = vetor.cap === 0 ? CAP_MINIMA : vetor.cap * 2;
        aviso = T.cresceu + ' → ' + vetor.cap;
      }
      vetor.dados.push(proximo++);
      pintar();
    }

    /* Desenha exatamente `capacidade` células, e nenhuma a mais. Mostrar oito
       caixas fantasma antes da primeira inserção seria bonito e mentiroso: com
       capacidade zero o `dados` do vetor é NULL, não existe arranjo nenhum, e
       é justamente essa a diferença que a primeira chamada a `crescer()` faz. */
    function celulas() {
      if (vetor.cap === 0) return [el('span', { class: 'dm-vazio', text: T.semAloc })];
      const cs = [];
      for (let i = 0; i < vetor.cap; i++) {
        const usada = i < vetor.dados.length;
        cs.push(el('span', {
          class: 'dm-cel' + (usada ? ' is-on' : ''),
          text: usada ? String(vetor.dados[i]) : ''
        }));
      }
      return cs;
    }

    function nosLista() {
      if (!lista.length) return [el('span', { class: 'dm-vazio', text: T.vazio })];
      const out = [];
      lista.forEach((v, i) => {
        if (i) out.push(el('span', { class: 'dm-seta mono', text: '⇄' }));
        out.push(el('span', { class: 'dm-no', text: String(v) }));
      });
      return out;
    }

    function celulasFila() {
      return fila.buf.map((_, i) => {
        const pos = (i - fila.inicio + CAP_FILA) % CAP_FILA;
        const usada = pos < fila.tam;
        const ehInicio = fila.tam > 0 && i === fila.inicio;
        const ehFim = fila.tam > 0 && i === (fila.inicio + fila.tam - 1) % CAP_FILA;
        return el('span', {
          class: 'dm-cel' + (usada ? ' is-on' : '') + (ehInicio ? ' is-inicio' : '') + (ehFim ? ' is-fim' : ''),
          text: usada ? String(fila.buf[i]) : ''
        });
      });
    }

    function pintar() {
      palco.textContent = '';
      let corpo, acoes, meta, nota;

      if (modo === 'vetor') {
        corpo = el('div', { class: 'dm-tira' }, celulas());
        meta = [linhaChave(T.tam, String(vetor.dados.length)), linhaChave(T.cap, String(vetor.cap))];
        acoes = [
          el('button', { class: 'dm-btn', type: 'button', text: T.inserir, onclick: inserirVetor }),
          el('button', { class: 'dm-btn dm-btn--sec', type: 'button', text: T.remover, onclick: () => { aviso = null; vetor.dados.pop(); pintar(); } })
        ];
        nota = T.notaV;
      } else if (modo === 'lista') {
        corpo = el('div', { class: 'dm-tira dm-tira--livre' }, nosLista());
        meta = [linhaChave(T.tam, String(lista.length))];
        acoes = [
          el('button', { class: 'dm-btn', type: 'button', text: T.inserir + ' ' + T.frente, onclick: () => { aviso = null; lista.unshift(proximo++); pintar(); } }),
          el('button', { class: 'dm-btn', type: 'button', text: T.inserir + ' ' + T.fundo, onclick: () => { aviso = null; lista.push(proximo++); pintar(); } }),
          el('button', { class: 'dm-btn dm-btn--sec', type: 'button', text: T.remover + ' ' + T.frente, onclick: () => { aviso = null; lista.shift(); pintar(); } })
        ];
        nota = T.notaL;
      } else {
        corpo = el('div', { class: 'dm-tira' }, celulasFila());
        meta = [linhaChave(T.tam, fila.tam + ' / ' + CAP_FILA)];
        acoes = [
          el('button', {
            class: 'dm-btn', type: 'button', text: T.inserir, onclick: () => {
              if (fila.tam === CAP_FILA) { aviso = T.cheia; pintar(); return; }
              aviso = null;
              fila.buf[(fila.inicio + fila.tam) % CAP_FILA] = proximo++;
              fila.tam++; pintar();
            }
          }),
          el('button', {
            class: 'dm-btn dm-btn--sec', type: 'button', text: T.remover, onclick: () => {
              aviso = null;
              if (fila.tam > 0) { fila.buf[fila.inicio] = null; fila.inicio = (fila.inicio + 1) % CAP_FILA; fila.tam--; }
              pintar();
            }
          })
        ];
        nota = T.notaF;
      }

      acoes.push(el('button', { class: 'dm-btn dm-btn--sec', type: 'button', text: T.limpar, onclick: zerar }));

      palco.appendChild(corpo);
      palco.appendChild(el('div', { class: 'dm-metas' }, meta));
      if (aviso) palco.appendChild(el('p', { class: 'dm-aviso', text: aviso }));
      palco.appendChild(el('div', { class: 'dm-acoes' }, acoes));
      palco.appendChild(el('p', { class: 'dm-nota', text: nota }));
    }

    host.appendChild(abas(
      [{ rotulo: T.vetor, m: 'vetor' }, { rotulo: T.lista, m: 'lista' }, { rotulo: T.fila, m: 'fila' }],
      (it) => { modo = it.m; aviso = null; pintar(); }
    ));
    host.appendChild(palco);

    host.appendChild(bloco(T.bancada,
      el('div', { class: 'dm-rolagem' }, [el('table', { class: 'dm-tab' }, [
        el('thead', {}, [el('tr', {}, [T.colN, T.colV, T.colL, T.colR].map(c => el('th', { text: c })))]),
        el('tbody', {}, BANCADA.map(b => el('tr', {}, [
          el('td', { class: 'num', text: b.n }), el('td', { class: 'num', text: b.vetor }),
          el('td', { class: 'num', text: b.lista }), el('td', { class: 'num', text: b.razao })
        ])))
      ])]),
      el('p', { class: 'dm-nota', text: T.bancadaNota })
    ));

    pintar();
  }

  /* ============================================================
     O registro
     ============================================================ */

  window.DEMOS = {
    'aiden': {
      titulo: { pt: 'Roteador de intenção', en: 'Intent router' },
      selo: { pt: 'interativo', en: 'interactive' },
      nota: {
        pt: 'A decisão roda aqui: normalização e limiar de confiança são os do `core/roteador.py`, e os dois custos (~0,1 s numa skill, ~3 s no LLM) são os documentados no código. Os padrões aqui são uma amostra — o sistema real tem 27 skills e roda inteiro offline, fora do navegador.',
        en: 'The decision runs here: normalization and the confidence threshold come from `core/roteador.py`, and both costs (~0.1 s in a skill, ~3 s in the LLM) are the ones documented in the code. The patterns here are a sample — the real system has 27 skills and runs entirely offline, outside the browser.'
      },
      montar: demoAiden
    },
    'convertta-sites': {
      titulo: { pt: 'A estrutura, em três segmentos', en: 'The structure, in three segments' },
      selo: { pt: 'reconstrução', en: 'reconstruction' },
      nota: {
        pt: 'Reconstrução feita para esta demonstração — não são capturas das peças entregues, que foram para clientes e não estão no ar. O que se reproduz é a estrutura descrita ao lado: uma promessa, uma prova, um botão.',
        en: 'A reconstruction built for this demo — not screenshots of the delivered pieces, which went to clients and are no longer live. What is reproduced is the structure described alongside: one promise, one proof, one button.'
      },
      montar: demoSites
    },
    'painel-convertta': {
      titulo: { pt: 'Gravação e aplicação ao vivo', en: 'Recording and live app' },
      selo: { pt: 'ao vivo', en: 'live' },
      nota: {
        pt: 'A gravação abre na hora; o botão troca pela aplicação de verdade, rodando no Render com a conta demo. Os números vêm do banco semeado, não de um mock.',
        en: 'The recording plays immediately; the button swaps in the real application, running on Render with the demo account. The numbers come from the seeded database, not a mock.'
      },
      montar: demoPainel
    },
    'consulta-cnpj': {
      titulo: { pt: 'O dígito verificador, calculado aqui', en: 'The check digit, computed here' },
      selo: { pt: 'roda de verdade', en: 'really runs' },
      nota: {
        pt: 'O algoritmo é o do repositório, portado sem mudança de regra: pesos, resto por 11 e a recusa dos catorze dígitos repetidos. Nada sai do seu navegador. O corpo da resposta é o formato que a API devolve, com os campos de exemplo.',
        en: 'The algorithm is the repository one, ported without changing a rule: weights, remainder mod 11, and the explicit rejection of fourteen repeated digits. Nothing leaves your browser. The response body is the shape the API returns, with placeholder fields.'
      },
      montar: demoCnpj
    },
    'sql-trafego': {
      titulo: { pt: 'Dez perguntas, dez saídas conferidas', en: 'Ten questions, ten checked outputs' },
      selo: { pt: 'dados reais', en: 'real data' },
      nota: {
        pt: 'Consultas e saídas são os arquivos do repositório, lidos de `consultas/` e `esperado/`. São exatamente os que a CI compara a cada push contra um PostgreSQL recém-semeado.',
        en: 'Queries and outputs are the repository files, read from `consultas/` and `esperado/`. They are exactly what CI compares on every push against a freshly seeded PostgreSQL.'
      },
      montar: demoSql
    },
    'estruturas-c': {
      titulo: { pt: 'As três estruturas, operando', en: 'The three structures, operating' },
      selo: { pt: 'interativo', en: 'interactive' },
      nota: {
        pt: 'A visualização segue as regras do código C: capacidade mínima 8 e dobra a cada realloc, fila de capacidade fixa que recusa em vez de crescer. A tabela da bancada é a medição do repositório, não estimativa.',
        en: 'The visualization follows the C code rules: minimum capacity 8, doubling on each realloc, and a fixed-capacity queue that refuses rather than growing. The benchmark table is the repository measurement, not an estimate.'
      },
      montar: demoC
    }
  };
})();
