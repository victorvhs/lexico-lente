---
layout: post.njk
title: "Guia de formatação"
date: 2026-09-11
description: "Referência de tudo que dá para usar ao escrever um post neste blog: separadores, caixas, destaques, figuras, galerias e notas de rodapé."
permalink: /formatacao/
eleventyExcludeFromCollections: true
---

Esta página é a referência de escrita do blog e, ao mesmo tempo, o teste
visual de cada elemento. Se algo aqui aparecer quebrado, o CSS quebrou.

## Ritmo do texto

Uma quebra de linha simples no Markdown vira uma quebra de linha de verdade.
Isto está em três linhas no arquivo
e aparece em três linhas na página.
O ritmo que você digita é o ritmo que sai.

Uma linha em branco continua abrindo um parágrafo novo, com o espaço maior.

A primeira letra de um post ganha capitular automaticamente. Você não
precisa fazer nada.

## Separadores

Três hifens no Markdown (`---`) não viram uma linha dura: viram um asterismo
centralizado, para pular de cena sem abrir uma seção nova.

---

Também dá para escrever `{% raw %}{% separador %}{% endraw %}`, que faz a mesma coisa de forma
explícita.

## Destaque

Para tirar uma frase do corpo e dar peso a ela:

{% destaque %}
Regras que existem apenas para manter as coisas como são.
{% enddestaque %}

Com atribuição, passe a fonte como argumento:

{% destaque "Lev Vygotsky" %}
O aprendizado acontece primeiro entre pessoas, depois dentro da pessoa.
{% enddestaque %}

```text
{% raw %}{% destaque "Lev Vygotsky" %}
O texto da citação.
{% enddestaque %}{% endraw %}
```

## Caixas

Para um aparte que não pertence ao fio principal:

{% nota %}
O `markdown-it` roda dentro das caixas, então **negrito**, `código` e
[links](/) funcionam normalmente aqui.
{% endnota %}

{% nota "Contexto" %}
O título da caixa é opcional. Sem argumento, sai "Nota".
{% endnota %}

{% aviso %}
Use para ressalvas, armadilhas e coisas que quebram.
{% endaviso %}

```text
{% raw %}{% nota "Título opcional" %}
Conteúdo da caixa.
{% endnota %}

{% aviso %}
Conteúdo do aviso.
{% endaviso %}{% endraw %}
```

## Imagens

Coloque os arquivos em `src/img/`. Uma figura com legenda:

```text
{% raw %}{% figura "/img/foto.jpg", "Legenda da foto", "Texto alternativo" %}{% endraw %}
```

O terceiro argumento é o texto alternativo, para quem usa leitor de tela. Se
você omitir, a legenda é reaproveitada — mas escrever os dois é melhor: a
legenda comenta a foto, o alternativo descreve.

Uma galeria em grade, um arquivo por linha, legenda depois da barra:

```text
{% raw %}{% galeria %}
  /img/a.jpg | Manhã
  /img/b.jpg | Tarde
  /img/c.jpg | Noite
{% endgaleria %}{% endraw %}
```

A grade se ajusta sozinha à largura disponível e cada foto vira link para o
arquivo em tamanho cheio.

## Notas de rodapé

Notas numeradas com `[^1]` são recolhidas para o fim do texto[^exemplo] e
ganham um link de volta para o ponto de origem[^segunda].

[^exemplo]: Assim. A definição pode ficar em qualquer lugar do arquivo.
[^segunda]: A numeração é automática, na ordem em que aparecem no texto.

## Sumário

Posts com três ou mais `##` ganham um sumário automático no topo. Não há nada
para escrever — ele aparece sozinho quando o texto é longo o bastante.

## Classes avulsas

Com `markdown-it-attrs` dá para pendurar uma classe em qualquer bloco:

```text
{% raw %}Um parágrafo que precisa de tratamento especial.
{.callout}{% endraw %}
```

## Código

Blocos cercados com três crases e a linguagem:

```bash
for f in *.txt; do mv "$f" "${f%.txt}.md"; done
```

Código `inline` fica entre crases simples.

## Tabelas

| Elemento | Como se escreve |
|----------|-----------------|
| Separador de cena | `---` |
| Destaque | `{% raw %}{% destaque %}{% endraw %}` |
| Nota | `{% raw %}{% nota %}{% endraw %}` |
| Figura | `{% raw %}{% figura %}{% endraw %}` |
| Galeria | `{% raw %}{% galeria %}{% endraw %}` |
| Nota de rodapé | `[^id]` |
