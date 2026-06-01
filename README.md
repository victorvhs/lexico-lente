# Blog Retro 2000

Blog estático estilo web clássica (anos 2000), feito com [Eleventy](https://www.11ty.dev/) e hospedado no GitHub Pages.

## Características

- ✅ Escrito em **Markdown**
- ✅ Layout de **3 colunas** (banners | posts | arquivo+tags)
- ✅ Estética **web 2000**: leve, direta, sem rastreadores
- ✅ Compilação via **GitHub Actions**
- ✅ **Zero JavaScript** no cliente
- ✅ Tags e arquivo histórico automáticos

## Estrutura

```
.
├── src/
│   ├── _includes/          # Templates Nunjucks
│   │   ├── base.njk        # Layout principal (3 colunas)
│   │   └── post.njk        # Template de post individual
│   ├── posts/              # Seus posts em Markdown
│   │   ├── posts.json      # Config comum dos posts
│   │   └── *.md            # Arquivos de conteúdo
│   ├── css/
│   │   └── style.css       # Estilo retro 2000
│   ├── index.njk           # Página inicial
│   └── tags.njk            # Páginas de tags (auto-geradas)
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD para GitHub Pages
├── eleventy.config.js      # Configuração do Eleventy
└── package.json
```

## Como usar

### 1. Clone/localize

Baixe este template e envie para um repositório GitHub.

### 2. Instale dependências

```bash
npm install
```

### 3. Desenvolva localmente

```bash
npm run serve
```

Acesse `http://localhost:8080`. O servidor recarrega automaticamente ao editar arquivos.

### 4. Escreva posts

Crie arquivos `.md` em `src/posts/` com o seguinte front matter:

```markdown
---
title: "Título do Post"
date: 2026-05-25
tags:
  - tag1
  - tag2
description: "Resumo curto para a listagem."
---

Conteúdo em Markdown aqui...
```

### 5. Personalize banners

Edite `src/_includes/base.njk` na seção `#leftbar`. Os banners são simples elementos `<a>` com classe `.banner`.

### 6. Deploy no GitHub Pages

1. No repositório GitHub, vá em **Settings > Pages**
2. Em "Build and deployment", selecione **GitHub Actions**
3. Faça push para a branch `main` — o workflow compila e publica automaticamente

## Personalizando

- **Cores/tema:** edite `src/css/style.css`
- **Nome do blog:** edite o `#header` em `src/_includes/base.njk`
- **Domínio customizado:** adicione um arquivo `src/CNAME` com seu domínio

## Licença

MIT. Use, modifique e compartilhe conhecimento.
