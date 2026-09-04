/* Gerado a partir do repositório sql-trafego-pago: as consultas e as saídas
 * são os arquivos reais de `consultas/` e `esperado/` — os mesmos que a CI
 * compara a cada push. Nada aqui foi redigitado à mão. */
const SQL_DEMO = [
  {
    "id": "01",
    "arquivo": "consultas/01_custo_por_lead_por_cliente.sql",
    "pergunta": "Quanto custou cada lead, por cliente, nos últimos 30 dias?",
    "tecnicas": [
      "CTEs paralelos",
      "LEFT JOIN",
      "NULL` com significado"
    ],
    "sql": "-- PERGUNTA: quanto me custou cada lead, por cliente, nos últimos 30 dias?\n--\n-- É a pergunta que o cliente faz toda reunião. Duas armadilhas moram aqui:\n--\n-- 1. Investimento e leads não podem entrar no mesmo join. Juntar\n--    metrica_diaria com lead multiplica o custo de cada dia pelo número de\n--    leads daquele dia. Por isso cada um é agregado no seu próprio CTE e só\n--    depois os dois se encontram, já no grão de cliente.\n-- 2. Cliente sem lead tem CPL desconhecido, não zero. NULL diz \"ainda não\n--    dá para saber\"; R$ 0,00 leria como \"leads de graça\", que é exatamente a\n--    leitura errada para quem decide onde pôr verba.\n\nSET search_path TO trafego;\n\nWITH janela AS (\n    SELECT data - 29 AS de, data AS ate FROM hoje\n),\ninvestimento AS (\n    SELECT ca.cliente_id, SUM(m.custo_centavos) AS custo\n    FROM metrica_diaria m\n    JOIN campanha ca ON ca.id = m.campanha_id\n    CROSS JOIN janela j\n    WHERE m.dia BETWEEN j.de AND j.ate\n    GROUP BY ca.cliente_id\n),\nleads AS (\n    SELECT ca.cliente_id, COUNT(*) AS total\n    FROM lead l\n    JOIN campanha ca ON ca.id = l.campanha_id\n    CROSS JOIN janela j\n    WHERE l.criado_em BETWEEN j.de AND j.ate\n    GROUP BY ca.cliente_id\n)\nSELECT\n    c.nome                                    AS cliente,\n    COALESCE(i.custo, 0)                      AS investimento_centavos,\n    COALESCE(le.total, 0)                     AS leads,\n    CASE WHEN COALESCE(le.total, 0) > 0\n         THEN ROUND(i.custo::numeric / le.total)::bigint\n    END                                       AS custo_por_lead_centavos\nFROM cliente c\nLEFT JOIN investimento i  ON i.cliente_id = c.id\nLEFT JOIN leads        le ON le.cliente_id = c.id\nORDER BY custo_por_lead_centavos NULLS LAST, c.nome;",
    "colunas": [
      "cliente",
      "investimento_centavos",
      "leads",
      "custo_por_lead_centavos"
    ],
    "linhas": [
      [
        "Advocacia Ramos",
        "1699914",
        "164",
        "10365"
      ],
      [
        "Studio Pilates Norte",
        "1340625",
        "127",
        "10556"
      ],
      [
        "Ótica Vista Clara",
        "1719234",
        "162",
        "10613"
      ],
      [
        "Clínica Odonto Sul",
        "852871",
        "80",
        "10661"
      ],
      [
        "Marcenaria Bonfim",
        "1327266",
        "102",
        "13012"
      ],
      [
        "Pet Shop Lupi",
        "359740",
        "21",
        "17130"
      ],
      [
        "Padaria do Zé",
        "2280210",
        "111",
        "20542"
      ],
      [
        "Escola Mundo Novo",
        "1315040",
        "36",
        "36529"
      ]
    ]
  },
  {
    "id": "02",
    "arquivo": "consultas/02_roas_por_campanha.sql",
    "pergunta": "Quais campanhas devolvem mais do que custam (ROAS)?",
    "tecnicas": [
      "agregação em dois ramos",
      "NULLIF` contra divisão por zero",
      "CASE` de recomendação"
    ],
    "sql": "-- PERGUNTA: quais campanhas devolvem mais do que custam?\n--\n-- ROAS = receita / investimento. Abaixo de 1, a campanha queima dinheiro.\n--\n-- A unicidade de `venda.lead_id` é o que torna esta conta confiável: sem ela,\n-- um lead com duas vendas contaria a receita duas vezes e o ROAS ficaria\n-- inflado exatamente nas campanhas que mais vendem — o erro mais caro possível\n-- neste modelo, porque empurra verba para o lugar errado com um número que\n-- parece ótimo.\n\nSET search_path TO trafego;\n\nWITH investimento AS (\n    SELECT campanha_id, SUM(custo_centavos) AS custo\n    FROM metrica_diaria\n    GROUP BY campanha_id\n),\nreceita AS (\n    SELECT l.campanha_id, SUM(v.valor_centavos) AS receita, COUNT(*) AS vendas\n    FROM venda v\n    JOIN lead l ON l.id = v.lead_id\n    GROUP BY l.campanha_id\n)\nSELECT\n    c.nome                                AS cliente,\n    ca.nome                               AS campanha,\n    cn.nome                               AS canal,\n    i.custo                               AS investimento_centavos,\n    COALESCE(r.receita, 0)                AS receita_centavos,\n    COALESCE(r.vendas, 0)                 AS vendas,\n    ROUND(COALESCE(r.receita, 0)::numeric / NULLIF(i.custo, 0), 2) AS roas,\n    CASE\n        WHEN COALESCE(r.receita, 0) >= i.custo * 3 THEN 'escalar'\n        WHEN COALESCE(r.receita, 0) >= i.custo     THEN 'manter'\n        ELSE                                            'revisar'\n    END                                   AS recomendacao\nFROM campanha ca\nJOIN cliente c   ON c.id = ca.cliente_id\nJOIN canal cn    ON cn.id = ca.canal_id\nJOIN investimento i ON i.campanha_id = ca.id\nLEFT JOIN receita r ON r.campanha_id = ca.id\nORDER BY roas DESC NULLS LAST, ca.nome\nLIMIT 10;",
    "colunas": [
      "cliente",
      "campanha",
      "canal",
      "investimento_centavos",
      "receita_centavos",
      "vendas",
      "roas",
      "recomendacao"
    ],
    "linhas": [
      [
        "Ótica Vista Clara",
        "Promoção sazonal 2",
        "YouTube Ads",
        "1723199",
        "16941937",
        "66",
        "9.83",
        "escalar"
      ],
      [
        "Pet Shop Lupi",
        "Black Friday 5",
        "Meta Ads",
        "1144255",
        "10929789",
        "40",
        "9.55",
        "escalar"
      ],
      [
        "Studio Pilates Norte",
        "Remarketing 2",
        "YouTube Ads",
        "1591602",
        "14399272",
        "57",
        "9.05",
        "escalar"
      ],
      [
        "Ótica Vista Clara",
        "Institucional 3",
        "Google Ads",
        "2702415",
        "23594480",
        "79",
        "8.73",
        "escalar"
      ],
      [
        "Advocacia Ramos",
        "Marca 1",
        "Meta Ads",
        "1567235",
        "13502866",
        "52",
        "8.62",
        "escalar"
      ],
      [
        "Padaria do Zé",
        "Remarketing 1",
        "Google Ads",
        "2469230",
        "20322695",
        "73",
        "8.23",
        "escalar"
      ],
      [
        "Padaria do Zé",
        "Institucional 2",
        "YouTube Ads",
        "1336754",
        "10767835",
        "43",
        "8.06",
        "escalar"
      ],
      [
        "Pet Shop Lupi",
        "Marca 3",
        "Google Ads",
        "1567620",
        "12342227",
        "48",
        "7.87",
        "escalar"
      ],
      [
        "Escola Mundo Novo",
        "Promoção sazonal 2",
        "Meta Ads",
        "2116166",
        "16287382",
        "58",
        "7.70",
        "escalar"
      ],
      [
        "Studio Pilates Norte",
        "Marca 1",
        "Meta Ads",
        "2414068",
        "18385917",
        "65",
        "7.62",
        "escalar"
      ]
    ]
  },
  {
    "id": "03",
    "arquivo": "consultas/03_evolucao_mensal.sql",
    "pergunta": "O custo por lead está subindo ou caindo mês a mês?",
    "tecnicas": [
      "LAG()",
      "date_trunc",
      "variação percentual"
    ],
    "sql": "-- PERGUNTA: o custo por lead está subindo ou caindo mês a mês?\n--\n-- Número solto não diz nada; a variação diz. `LAG` traz o mês anterior para a\n-- mesma linha, e é o que transforma uma tabela de valores numa tabela de\n-- tendência — sem precisar de subconsulta correlacionada, que faria uma\n-- varredura por linha.\n\nSET search_path TO trafego;\n\nWITH investimento AS (\n    SELECT date_trunc('month', dia)::date AS mes, SUM(custo_centavos) AS custo\n    FROM metrica_diaria\n    GROUP BY 1\n),\nleads AS (\n    SELECT date_trunc('month', criado_em)::date AS mes, COUNT(*) AS total\n    FROM lead\n    GROUP BY 1\n),\nmensal AS (\n    SELECT\n        i.mes,\n        i.custo,\n        COALESCE(l.total, 0) AS leads,\n        CASE WHEN COALESCE(l.total, 0) > 0\n             THEN ROUND(i.custo::numeric / l.total)::bigint\n        END AS cpl\n    FROM investimento i\n    LEFT JOIN leads l ON l.mes = i.mes\n)\nSELECT\n    to_char(mes, 'YYYY-MM')      AS mes,\n    custo                        AS investimento_centavos,\n    leads,\n    cpl                          AS custo_por_lead_centavos,\n    LAG(cpl) OVER (ORDER BY mes) AS cpl_mes_anterior,\n    ROUND(\n        100.0 * (cpl - LAG(cpl) OVER (ORDER BY mes))\n        / NULLIF(LAG(cpl) OVER (ORDER BY mes), 0), 1\n    )                            AS variacao_percentual\nFROM mensal\nORDER BY mes;",
    "colunas": [
      "mes",
      "investimento_centavos",
      "leads",
      "custo_por_lead_centavos",
      "cpl_mes_anterior",
      "variacao_percentual"
    ],
    "linhas": [
      [
        "2026-03",
        "2655741",
        "173",
        "15351",
        "",
        ""
      ],
      [
        "2026-04",
        "6424191",
        "468",
        "13727",
        "15351",
        "-10.6"
      ],
      [
        "2026-05",
        "10734530",
        "845",
        "12704",
        "13727",
        "-7.5"
      ],
      [
        "2026-06",
        "12925717",
        "877",
        "14739",
        "12704",
        "16.0"
      ],
      [
        "2026-07",
        "12447671",
        "951",
        "13089",
        "14739",
        "-11.2"
      ],
      [
        "2026-08",
        "11275149",
        "836",
        "13487",
        "13089",
        "3.0"
      ]
    ]
  },
  {
    "id": "04",
    "arquivo": "consultas/04_funil_por_campanha.sql",
    "pergunta": "Em que etapa cada campanha perde gente?",
    "tecnicas": [
      "funil de quatro estágios",
      "três taxas de conversão"
    ],
    "sql": "-- PERGUNTA: em que etapa cada campanha perde gente?\n--\n-- Impressão -> clique -> lead -> venda. A etapa com a maior queda é onde o\n-- trabalho rende: CTR baixo é problema de criativo, taxa de lead baixa é\n-- problema de página, e taxa de venda baixa não é problema de mídia nenhum —\n-- é do time comercial. Sem o funil separado, tudo isso vira \"a campanha não\n-- está performando\".\n\nSET search_path TO trafego;\n\nWITH midia AS (\n    SELECT campanha_id, SUM(impressoes) AS impressoes, SUM(cliques) AS cliques\n    FROM metrica_diaria\n    GROUP BY campanha_id\n),\nleads AS (\n    SELECT campanha_id, COUNT(*) AS leads\n    FROM lead\n    GROUP BY campanha_id\n),\nvendas AS (\n    SELECT l.campanha_id, COUNT(*) AS vendas\n    FROM venda v JOIN lead l ON l.id = v.lead_id\n    GROUP BY l.campanha_id\n)\nSELECT\n    c.nome                     AS cliente,\n    ca.nome                    AS campanha,\n    m.impressoes,\n    m.cliques,\n    COALESCE(le.leads, 0)      AS leads,\n    COALESCE(ve.vendas, 0)     AS vendas,\n    ROUND(100.0 * m.cliques / NULLIF(m.impressoes, 0), 2)          AS ctr_pct,\n    ROUND(100.0 * COALESCE(le.leads, 0) / NULLIF(m.cliques, 0), 2) AS clique_para_lead_pct,\n    ROUND(100.0 * COALESCE(ve.vendas, 0) / NULLIF(le.leads, 0), 2) AS lead_para_venda_pct\nFROM campanha ca\nJOIN cliente c ON c.id = ca.cliente_id\nJOIN midia m   ON m.campanha_id = ca.id\nLEFT JOIN leads  le ON le.campanha_id = ca.id\nLEFT JOIN vendas ve ON ve.campanha_id = ca.id\nORDER BY c.nome, ca.nome\nLIMIT 15;",
    "colunas": [
      "cliente",
      "campanha",
      "impressoes",
      "cliques",
      "leads",
      "vendas",
      "ctr_pct",
      "clique_para_lead_pct",
      "lead_para_venda_pct"
    ],
    "linhas": [
      [
        "Advocacia Ramos",
        "Black Friday 2",
        "320633",
        "11152",
        "184",
        "54",
        "3.48",
        "1.65",
        "29.35"
      ],
      [
        "Advocacia Ramos",
        "Black Friday 3",
        "315602",
        "11280",
        "193",
        "49",
        "3.57",
        "1.71",
        "25.39"
      ],
      [
        "Advocacia Ramos",
        "Black Friday 4",
        "235089",
        "8451",
        "144",
        "44",
        "3.59",
        "1.70",
        "30.56"
      ],
      [
        "Advocacia Ramos",
        "Marca 1",
        "250027",
        "8558",
        "143",
        "52",
        "3.42",
        "1.67",
        "36.36"
      ],
      [
        "Clínica Odonto Sul",
        "Captação — bairro 2",
        "339794",
        "12138",
        "203",
        "58",
        "3.57",
        "1.67",
        "28.57"
      ],
      [
        "Clínica Odonto Sul",
        "Marca 1",
        "262892",
        "8918",
        "148",
        "52",
        "3.39",
        "1.66",
        "35.14"
      ],
      [
        "Escola Mundo Novo",
        "Black Friday 1",
        "272459",
        "9374",
        "0",
        "0",
        "3.44",
        "0.00",
        ""
      ],
      [
        "Escola Mundo Novo",
        "Institucional 3",
        "388919",
        "12784",
        "0",
        "0",
        "3.29",
        "0.00",
        ""
      ],
      [
        "Escola Mundo Novo",
        "Promoção sazonal 2",
        "338798",
        "11557",
        "206",
        "58",
        "3.41",
        "1.78",
        "28.16"
      ],
      [
        "Marcenaria Bonfim",
        "Institucional 2",
        "297941",
        "9860",
        "179",
        "50",
        "3.31",
        "1.82",
        "27.93"
      ],
      [
        "Marcenaria Bonfim",
        "Marca 3",
        "262698",
        "8729",
        "126",
        "37",
        "3.32",
        "1.44",
        "29.37"
      ],
      [
        "Marcenaria Bonfim",
        "Promoção sazonal 1",
        "253512",
        "8628",
        "138",
        "41",
        "3.40",
        "1.60",
        "29.71"
      ],
      [
        "Padaria do Zé",
        "Black Friday 5",
        "344174",
        "11723",
        "0",
        "0",
        "3.41",
        "0.00",
        ""
      ],
      [
        "Padaria do Zé",
        "Institucional 2",
        "235507",
        "7213",
        "124",
        "43",
        "3.06",
        "1.72",
        "34.68"
      ],
      [
        "Padaria do Zé",
        "Marca 3",
        "419478",
        "13720",
        "224",
        "56",
        "3.27",
        "1.63",
        "25.00"
      ]
    ]
  },
  {
    "id": "05",
    "arquivo": "consultas/05_top_campanhas_por_cliente.sql",
    "pergunta": "Qual é a melhor campanha de cada cliente?",
    "tecnicas": [
      "ROW_NUMBER() OVER (PARTITION BY ...)"
    ],
    "sql": "-- PERGUNTA: qual é a melhor campanha de CADA cliente?\n--\n-- \"Melhor de cada grupo\" é a consulta em que quase todo mundo escorrega: com\n-- `GROUP BY` sai o valor máximo, mas não a linha que o produziu — e aí vem a\n-- gambiarra de juntar a tabela consigo mesma pelo máximo, que devolve duas\n-- linhas quando há empate.\n--\n-- `ROW_NUMBER() OVER (PARTITION BY ...)` numera as linhas dentro de cada\n-- cliente e resolve o empate de forma determinística pelo desempate do\n-- ORDER BY. Uma passada, sem self-join.\n\nSET search_path TO trafego;\n\nWITH desempenho AS (\n    SELECT\n        ca.cliente_id,\n        ca.nome AS campanha,\n        SUM(m.custo_centavos) AS custo,\n        (SELECT COUNT(*) FROM lead l WHERE l.campanha_id = ca.id) AS leads\n    FROM campanha ca\n    JOIN metrica_diaria m ON m.campanha_id = ca.id\n    GROUP BY ca.id, ca.cliente_id, ca.nome\n),\nclassificado AS (\n    SELECT\n        d.*,\n        CASE WHEN d.leads > 0 THEN ROUND(d.custo::numeric / d.leads)::bigint END AS cpl,\n        ROW_NUMBER() OVER (\n            PARTITION BY d.cliente_id\n            -- Menor CPL primeiro; sem lead vai para o fim. O nome entra como\n            -- desempate para o resultado não variar entre execuções.\n            ORDER BY CASE WHEN d.leads > 0 THEN d.custo::numeric / d.leads END ASC NULLS LAST,\n                     d.campanha\n        ) AS posicao\n    FROM desempenho d\n)\nSELECT c.nome AS cliente, cl.campanha, cl.custo AS investimento_centavos,\n       cl.leads, cl.cpl AS custo_por_lead_centavos\nFROM classificado cl\nJOIN cliente c ON c.id = cl.cliente_id\nWHERE cl.posicao = 1\nORDER BY c.nome;",
    "colunas": [
      "cliente",
      "campanha",
      "investimento_centavos",
      "leads",
      "custo_por_lead_centavos"
    ],
    "linhas": [
      [
        "Advocacia Ramos",
        "Black Friday 3",
        "1883889",
        "193",
        "9761"
      ],
      [
        "Clínica Odonto Sul",
        "Captação — bairro 2",
        "2142602",
        "203",
        "10555"
      ],
      [
        "Escola Mundo Novo",
        "Promoção sazonal 2",
        "2116166",
        "206",
        "10273"
      ],
      [
        "Marcenaria Bonfim",
        "Institucional 2",
        "1928877",
        "179",
        "10776"
      ],
      [
        "Padaria do Zé",
        "Institucional 2",
        "1336754",
        "124",
        "10780"
      ],
      [
        "Pet Shop Lupi",
        "Marca 3",
        "1567620",
        "141",
        "11118"
      ],
      [
        "Studio Pilates Norte",
        "Remarketing 2",
        "1591602",
        "160",
        "9948"
      ],
      [
        "Ótica Vista Clara",
        "Black Friday 4",
        "1240729",
        "125",
        "9926"
      ]
    ]
  },
  {
    "id": "06",
    "arquivo": "consultas/06_campanhas_que_queimam_verba.sql",
    "pergunta": "Onde estou gastando sem retorno?",
    "tecnicas": [
      "HAVING` sobre agregado",
      "piso anti-falso-positivo"
    ],
    "sql": "-- PERGUNTA: onde estou gastando sem retorno?\n--\n-- O ranking invertido. Uma campanha entra na lista se gastou mais de R$ 500\n-- E produziu menos de dez leads — o `HAVING` filtra DEPOIS do agrupamento, que\n-- é a única forma de condicionar sobre um agregado. Tentar isso no `WHERE`\n-- é o erro clássico, e o Postgres reprova com \"aggregate functions are not\n-- allowed in WHERE\".\n--\n-- O piso de R$ 500 existe para não acusar campanha que acabou de subir: sem\n-- ele, toda campanha nova aparece no topo da lista de piores.\n\nSET search_path TO trafego;\n\nSELECT\n    c.nome                     AS cliente,\n    ca.nome                    AS campanha,\n    cn.nome                    AS canal,\n    ca.objetivo,\n    SUM(m.custo_centavos)      AS investimento_centavos,\n    COUNT(DISTINCT l.id)       AS leads,\n    MIN(m.dia)                 AS primeiro_dia,\n    MAX(m.dia)                 AS ultimo_dia\nFROM campanha ca\nJOIN cliente c        ON c.id = ca.cliente_id\nJOIN canal cn         ON cn.id = ca.canal_id\nJOIN metrica_diaria m ON m.campanha_id = ca.id\nLEFT JOIN lead l      ON l.campanha_id = ca.id\nGROUP BY c.nome, ca.nome, cn.nome, ca.objetivo\nHAVING SUM(m.custo_centavos) > 50000\n   AND COUNT(DISTINCT l.id) < 10\nORDER BY investimento_centavos DESC;",
    "colunas": [
      "cliente",
      "campanha",
      "canal",
      "objetivo",
      "investimento_centavos",
      "leads",
      "primeiro_dia",
      "ultimo_dia"
    ],
    "linhas": [
      [
        "Padaria do Zé",
        "Remarketing 4",
        "Google Ads",
        "reconhecimento",
        "2560681",
        "0",
        "2026-03-11",
        "2026-08-31"
      ],
      [
        "Escola Mundo Novo",
        "Institucional 3",
        "Google Ads",
        "reconhecimento",
        "2459498",
        "0",
        "2026-03-09",
        "2026-08-31"
      ],
      [
        "Padaria do Zé",
        "Black Friday 5",
        "YouTube Ads",
        "reconhecimento",
        "2273962",
        "0",
        "2026-03-23",
        "2026-08-31"
      ],
      [
        "Escola Mundo Novo",
        "Black Friday 1",
        "YouTube Ads",
        "reconhecimento",
        "1596007",
        "0",
        "2026-05-04",
        "2026-08-31"
      ],
      [
        "Pet Shop Lupi",
        "Remarketing 4",
        "Google Ads",
        "reconhecimento",
        "1071383",
        "0",
        "2026-05-18",
        "2026-08-05"
      ]
    ]
  },
  {
    "id": "07",
    "arquivo": "consultas/07_melhor_dia_da_semana.sql",
    "pergunta": "Em que dia da semana o lead sai mais barato?",
    "tecnicas": [
      "EXTRACT(isodow)",
      "agregação por derivada de data"
    ],
    "sql": "-- PERGUNTA: em que dia da semana o lead sai mais barato?\n--\n-- Responde a uma decisão concreta: se segunda custa 40% menos que domingo, a\n-- verba do fim de semana vai para o começo da semana.\n--\n-- `EXTRACT(isodow)` e não `dow`: o ISO começa a semana na segunda (1) e termina\n-- no domingo (7), que é como as pessoas leem um relatório no Brasil. O `dow`\n-- do Postgres começa no domingo com zero, e é fácil publicar o gráfico com os\n-- rótulos deslocados em um dia sem ninguém notar.\n\nSET search_path TO trafego;\n\nWITH custo_por_dia AS (\n    SELECT dia, SUM(custo_centavos) AS custo\n    FROM metrica_diaria\n    GROUP BY dia\n),\nleads_por_dia AS (\n    SELECT criado_em AS dia, COUNT(*) AS leads\n    FROM lead\n    GROUP BY criado_em\n)\nSELECT\n    EXTRACT(isodow FROM c.dia)::int AS dia_iso,\n    CASE EXTRACT(isodow FROM c.dia)::int\n        WHEN 1 THEN 'segunda' WHEN 2 THEN 'terça'  WHEN 3 THEN 'quarta'\n        WHEN 4 THEN 'quinta'  WHEN 5 THEN 'sexta'  WHEN 6 THEN 'sábado'\n        ELSE 'domingo'\n    END                              AS dia_da_semana,\n    SUM(c.custo)                     AS investimento_centavos,\n    COALESCE(SUM(l.leads), 0)        AS leads,\n    CASE WHEN COALESCE(SUM(l.leads), 0) > 0\n         THEN ROUND(SUM(c.custo)::numeric / SUM(l.leads))::bigint\n    END                              AS custo_por_lead_centavos\nFROM custo_por_dia c\nLEFT JOIN leads_por_dia l ON l.dia = c.dia\nGROUP BY 1, 2\nORDER BY custo_por_lead_centavos NULLS LAST;",
    "colunas": [
      "dia_iso",
      "dia_da_semana",
      "investimento_centavos",
      "leads",
      "custo_por_lead_centavos"
    ],
    "linhas": [
      [
        "3",
        "quarta",
        "7818243",
        "626",
        "12489"
      ],
      [
        "7",
        "domingo",
        "7908480",
        "632",
        "12513"
      ],
      [
        "2",
        "terça",
        "8336740",
        "625",
        "13339"
      ],
      [
        "5",
        "sexta",
        "7654150",
        "573",
        "13358"
      ],
      [
        "6",
        "sábado",
        "8176934",
        "567",
        "14421"
      ],
      [
        "4",
        "quinta",
        "8285209",
        "574",
        "14434"
      ],
      [
        "1",
        "segunda",
        "8283243",
        "553",
        "14979"
      ]
    ]
  },
  {
    "id": "08",
    "arquivo": "consultas/08_coorte_tempo_ate_venda.sql",
    "pergunta": "Quanto tempo um lead demora para virar venda?",
    "tecnicas": [
      "coorte por mês",
      "PERCENTILE_CONT",
      "aritmética de datas"
    ],
    "sql": "-- PERGUNTA: quanto tempo um lead demora para virar venda, e isso está\n-- melhorando?\n--\n-- Coorte por mês de entrada. A leitura importa: um mês recente parece pior\n-- porque os leads dele ainda não tiveram tempo de fechar — é viés de\n-- maturação, não queda de desempenho. A coluna `dias_ate_fechar_mediana` é o\n-- que separa as duas leituras.\n--\n-- `PERCENTILE_CONT` e não `AVG`: uma única venda que demorou seis meses puxa a\n-- média inteira e some com a informação. A mediana não se abala com isso.\n\nSET search_path TO trafego;\n\nSELECT\n    to_char(date_trunc('month', l.criado_em), 'YYYY-MM')  AS coorte_de_entrada,\n    COUNT(*)                                             AS leads,\n    COUNT(v.id)                                          AS viraram_venda,\n    ROUND(100.0 * COUNT(v.id) / COUNT(*), 1)             AS conversao_pct,\n    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY v.fechada_em - l.criado_em)\n                                                         AS dias_ate_fechar_mediana,\n    MAX(v.fechada_em - l.criado_em)                      AS dias_ate_fechar_maximo,\n    COALESCE(SUM(v.valor_centavos), 0)                   AS receita_centavos\nFROM lead l\nLEFT JOIN venda v ON v.lead_id = l.id\nGROUP BY 1\nORDER BY 1;",
    "colunas": [
      "coorte_de_entrada",
      "leads",
      "viraram_venda",
      "conversao_pct",
      "dias_ate_fechar_mediana",
      "dias_ate_fechar_maximo",
      "receita_centavos"
    ],
    "linhas": [
      [
        "2026-03",
        "173",
        "52",
        "30.1",
        "15.5",
        "30",
        "13145471"
      ],
      [
        "2026-04",
        "468",
        "142",
        "30.3",
        "16",
        "30",
        "38401721"
      ],
      [
        "2026-05",
        "845",
        "244",
        "28.9",
        "17",
        "30",
        "68097337"
      ],
      [
        "2026-06",
        "877",
        "267",
        "30.4",
        "16",
        "30",
        "72233264"
      ],
      [
        "2026-07",
        "951",
        "311",
        "32.7",
        "15",
        "30",
        "81056957"
      ],
      [
        "2026-08",
        "836",
        "252",
        "30.1",
        "16",
        "30",
        "59705593"
      ]
    ]
  },
  {
    "id": "09",
    "arquivo": "consultas/09_clientes_sem_lead_recente.sql",
    "pergunta": "Que cliente ativo parou de receber lead?",
    "tecnicas": [
      "NOT EXISTS` (anti-join)",
      "subconsulta correlacionada"
    ],
    "sql": "-- PERGUNTA: que cliente ativo parou de receber lead?\n--\n-- É o alerta operacional do dia a dia: campanha pausada por cartão recusado,\n-- formulário quebrado depois de um deploy, verba que acabou. Descobrir isso\n-- pelo cliente reclamando é caro.\n--\n-- `NOT EXISTS` e não `NOT IN`: se a subconsulta devolver um único NULL, o\n-- `NOT IN` devolve zero linhas — silenciosamente, sem erro. É o defeito mais\n-- traiçoeiro do SQL, e `NOT EXISTS` simplesmente não tem esse comportamento.\n-- Como bônus, o Postgres o transforma em anti-join, que costuma ser mais\n-- rápido.\n\nSET search_path TO trafego;\n\nSELECT\n    c.nome                        AS cliente,\n    c.segmento,\n    c.verba_mensal_centavos,\n    (SELECT MAX(l.criado_em)\n       FROM lead l JOIN campanha ca ON ca.id = l.campanha_id\n      WHERE ca.cliente_id = c.id) AS ultimo_lead,\n    (SELECT h.data FROM hoje h)\n      - (SELECT MAX(l.criado_em)\n           FROM lead l JOIN campanha ca ON ca.id = l.campanha_id\n          WHERE ca.cliente_id = c.id) AS dias_sem_lead\nFROM cliente c\nWHERE c.ativo\n  AND NOT EXISTS (\n      SELECT 1\n      FROM lead l\n      JOIN campanha ca ON ca.id = l.campanha_id\n      CROSS JOIN hoje h\n      WHERE ca.cliente_id = c.id\n        AND l.criado_em > h.data - 14\n  )\nORDER BY dias_sem_lead DESC NULLS FIRST, c.nome;",
    "colunas": [
      "cliente",
      "segmento",
      "verba_mensal_centavos",
      "ultimo_lead",
      "dias_sem_lead"
    ],
    "linhas": [
      [
        "Pet Shop Lupi",
        "varejo",
        "900000",
        "2026-08-05",
        "26"
      ]
    ]
  },
  {
    "id": "10",
    "arquivo": "consultas/10_estouro_de_verba.sql",
    "pergunta": "Quem vai estourar a verba, e em que dia?",
    "tecnicas": [
      "SUM() OVER (PARTITION BY ... ORDER BY ...)",
      "FILTER"
    ],
    "sql": "-- PERGUNTA: algum cliente vai estourar a verba do mês, e em que dia?\n--\n-- O gasto acumulado dia a dia contra o teto contratado. Responder isso no fim\n-- do mês não serve para nada — o valor está em ver a linha cruzar o teto no\n-- dia 19 e ainda dar tempo de agir.\n--\n-- `SUM(...) OVER (PARTITION BY ... ORDER BY ...)` calcula o acumulado numa\n-- passada só. A alternativa sem janela é uma subconsulta correlacionada que\n-- resoma tudo a cada linha: O(n²) contra O(n log n), e a diferença aparece\n-- assim que a base cresce.\n\nSET search_path TO trafego;\n\nWITH agosto AS (\n    SELECT\n        ca.cliente_id,\n        m.dia,\n        SUM(m.custo_centavos) AS custo_do_dia\n    FROM metrica_diaria m\n    JOIN campanha ca ON ca.id = m.campanha_id\n    CROSS JOIN hoje h\n    WHERE m.dia >= date_trunc('month', h.data)::date\n      AND m.dia <= h.data\n    GROUP BY ca.cliente_id, m.dia\n),\nacumulado AS (\n    SELECT\n        a.*,\n        SUM(a.custo_do_dia) OVER (\n            PARTITION BY a.cliente_id ORDER BY a.dia\n            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n        ) AS acumulado_centavos\n    FROM agosto a\n)\nSELECT\n    c.nome                                   AS cliente,\n    c.verba_mensal_centavos,\n    MAX(ac.acumulado_centavos)               AS gasto_no_mes_centavos,\n    ROUND(100.0 * MAX(ac.acumulado_centavos) / c.verba_mensal_centavos, 1) AS pct_da_verba,\n    -- O primeiro dia em que o acumulado passou do teto, ou NULL se não passou.\n    MIN(ac.dia) FILTER (WHERE ac.acumulado_centavos > c.verba_mensal_centavos)\n                                             AS estourou_em\nFROM acumulado ac\nJOIN cliente c ON c.id = ac.cliente_id\nGROUP BY c.id, c.nome, c.verba_mensal_centavos\nORDER BY pct_da_verba DESC;",
    "colunas": [
      "cliente",
      "verba_mensal_centavos",
      "gasto_no_mes_centavos",
      "pct_da_verba",
      "estourou_em"
    ],
    "linhas": [
      [
        "Padaria do Zé",
        "2000000",
        "2354413",
        "117.7",
        "2026-08-26"
      ],
      [
        "Marcenaria Bonfim",
        "1200000",
        "1385493",
        "115.5",
        "2026-08-27"
      ],
      [
        "Studio Pilates Norte",
        "1200000",
        "1360233",
        "113.4",
        "2026-08-28"
      ],
      [
        "Ótica Vista Clara",
        "2500000",
        "1755786",
        "70.2",
        ""
      ],
      [
        "Advocacia Ramos",
        "3000000",
        "1752369",
        "58.4",
        ""
      ],
      [
        "Escola Mundo Novo",
        "2500000",
        "1347849",
        "53.9",
        ""
      ],
      [
        "Pet Shop Lupi",
        "900000",
        "449216",
        "49.9",
        ""
      ],
      [
        "Clínica Odonto Sul",
        "1800000",
        "869790",
        "48.3",
        ""
      ]
    ]
  }
];
