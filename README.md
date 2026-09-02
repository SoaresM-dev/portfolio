# Portfólio — Murilo Soares

Site pessoal de portfólio. Página única, sem framework e sem build: HTML, CSS e JavaScript escritos à mão, servidos estaticamente pelo GitHub Pages.

**Ao vivo:** https://SoaresM-dev.github.io/portfolio/

---

## O que tem aqui

- **Bilíngue (PT-BR / EN)** por dicionário em `assets/js/content.js`, trocado em tempo de execução e lembrado entre visitas
- **Paleta de comandos** (`Ctrl`/`⌘` + `K`, ou `/`) para navegar, abrir links e copiar contato pelo teclado
- **Filtro de projetos por tecnologia** — clicar em qualquer chip da stack mostra só os projetos que a usam
- **Conteúdo separado do código**: todo o texto, projetos e stack vivem em um único arquivo de dados
- **Acessibilidade**: navegação por teclado, foco visível, `prefers-reduced-motion` respeitado, link de pular navegação
- **Zero dependências de runtime** — nenhum framework, nenhum bundler, nenhum `node_modules`

## Estrutura

```
.
├── index.html                  # estrutura da página
└── assets/
    ├── css/style.css           # design system em custom properties
    └── js/
        ├── content.js          # TODO o conteúdo: textos PT/EN, projetos, stack, trajetória
        └── main.js             # i18n, render, filtro, paleta de comandos
```

## Como editar

Quase tudo o que muda com o tempo está em **`assets/js/content.js`**:

| Quero mudar | Onde |
|---|---|
| E-mail, GitHub, LinkedIn | `CONFIG`, no topo do arquivo |
| Textos fixos da página | `I18N.pt` e `I18N.en` |
| Tecnologias e onde usei cada uma | `STACK` |
| Projetos, números e descrições | `PROJECTS` |
| Trajetória | `TIMELINE` |

Adicionar um projeto é acrescentar um objeto em `PROJECTS`. As tags dele passam a funcionar no filtro automaticamente.

## Rodar localmente

Não precisa instalar nada. Basta servir a pasta:

```bash
python -m http.server 8000
# depois abra http://localhost:8000
```

Abrir o `index.html` direto pelo `file://` também funciona.

## Publicar no GitHub Pages

1. Crie o repositório `portfolio` na sua conta e envie estes arquivos:

   ```bash
   git init
   git add .
   git commit -m "portfolio: primeira versão"
   git branch -M main
   git remote add origin https://github.com/SoaresM-dev/portfolio.git
   git push -u origin main
   ```

2. Em **Settings → Pages**, escolha **Source: Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Em um ou dois minutos o site fica no ar. Cada `git push` republica.

Como é um site estático puro, não é preciso build nem workflow de Actions.

## Decisões

**Por que sem framework.** A página tem cinco seções e nenhum estado de servidor. React aqui custaria build, dependências e ~40 KB de runtime para resolver um problema que `querySelector` resolve. A escolha é o argumento: usar a ferramenta do tamanho do problema.

**Por que o conteúdo mora em um arquivo de dados.** Portfólio que exige mexer em HTML para trocar um número não é atualizado. Separar conteúdo de estrutura faz a manutenção custar trinta segundos.

**Por que paleta de comandos e não menu hambúrguer decorado.** É a interação que um dev reconhece na hora e usa de fato. Interatividade tem que servir para navegar mais rápido, não para provar que tem JavaScript na página.

## Licença

[MIT](LICENSE) — pode usar o código. O conteúdo (textos, projetos e trajetória) é meu.
