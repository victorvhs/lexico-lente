---
title: "Shell scripts que todo dev deveria conhecer"
date: 2026-05-15
tags:
  - shell
  - produtividade
  - linux
description: "Cinco one-liners de shell que economizam horas de trabalho manual."
---

O terminal é a ferramenta mais subestimada do desenvolvedor moderno. Aqui vão cinco padrões que uso diariamente.

## 1. Renomear em massa com loops

```bash
for f in *.txt; do mv "$f" "${f%.txt}.md"; done
```

Simples, portável, sem dependências externas.

## 2. Encontrar e substituir recursivo

```bash
find . -type f -name "*.js" -exec sed -i 's/var/let/g' {} +
```

Cuidado com esta. Sempre faça um `git diff` depois.

## 3. Servidor HTTP instantâneo

```bash
python3 -m http.server 8000
```

Ou, se preferir algo mais robusto:

```bash
npx serve .
```

## 4. Monitorar mudanças em arquivos

```bash
while inotifywait -e close_write meuarquivo.md; do make build; done
```

## 5. Pipeline de dados com jq

```bash
curl -s "https://api.github.com/users/octocat" | jq '.login, .id, .created_at'
```

## Por que isso importa?

Cada vez que você abre um aplicativo pesado para fazer uma tarefa que o shell resolve em 10 segundos, você está pagando um custo de contexto. A fluência no terminal é fluência em automação.
