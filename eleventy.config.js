const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItFootnote = require("markdown-it-footnote");
const markdownLinhas = require("./src/_lib/markdown-linhas.js");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");

const SITE = {
  title: "Léxico & Lentes",
  subtitle: "Conhecimento técnico sem rastreadores, sem cookies, sem frescura.",
  url: "https://lexicolentes.com",
  author: "Victor Reis",
  email: "victor.h.s.reis@gmail.com",
  repo: "https://github.com/victorvhs/lexico-lente"
};

module.exports = function(eleventyConfig) {
  // Copiar CSS, assets e CNAME diretamente
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/CNAME");

  eleventyConfig.addGlobalData("site", SITE);

  /* ========================================
     MARKDOWN
     ======================================== */
  const md = markdownIt({
    html: true,
    // quebras de linha simples viram <br>: preserva o ritmo da prosa
    breaks: true,
    linkify: true,
    typographer: true
  })
    .use(markdownItAttrs)
    // depois do attrs: estende `{.classe}` para o nível de linha
    .use(markdownLinhas)
    .use(markdownItFootnote)
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink(),
      level: [2, 3, 4],
      slugify: s => eleventyConfig.getFilter("slugify")(s)
    });

  // Título da seção de notas de rodapé em português
  md.renderer.rules.footnote_block_open = () =>
    '<hr class="footnotes-sep">\n' +
    '<section class="footnotes">\n' +
    '<h2 class="footnotes-title">Notas</h2>\n' +
    '<ol class="footnotes-list">\n';

  eleventyConfig.setLibrary("md", md);

  // Renderiza markdown dentro de shortcodes
  const inline = text => md.renderInline((text || "").trim());
  const block = text => md.render((text || "").trim());

  /* ========================================
     SHORTCODES DE FORMATAÇÃO
     ======================================== */

  // {% nota %}...{% endnota %}  |  {% nota "Atenção" %}
  eleventyConfig.addPairedShortcode("nota", function(content, titulo = "Nota") {
    return `<aside class="callout callout-nota">
<p class="callout-title">${titulo}</p>
${block(content)}</aside>`;
  });

  // {% aviso %}...{% endaviso %}
  eleventyConfig.addPairedShortcode("aviso", function(content, titulo = "Atenção") {
    return `<aside class="callout callout-aviso">
<p class="callout-title">${titulo}</p>
${block(content)}</aside>`;
  });

  // {% destaque %}texto{% enddestaque %}  |  {% destaque "— Autor" %}
  eleventyConfig.addPairedShortcode("destaque", function(content, fonte = null) {
    const cite = fonte ? `<footer class="pullquote-source">${inline(fonte)}</footer>` : "";
    return `<blockquote class="pullquote">${block(content)}${cite}</blockquote>`;
  });

  // {% figura "/img/foto.jpg", "Legenda", "Texto alternativo" %}
  eleventyConfig.addShortcode("figura", function(src, legenda = "", alt = null) {
    const texto = alt !== null ? alt : legenda;
    const cap = legenda ? `<figcaption>${inline(legenda)}</figcaption>` : "";
    return `<figure class="figura">
<img src="${src}" alt="${texto.replace(/"/g, "&quot;")}" loading="lazy" decoding="async">
${cap}</figure>`;
  });

  // {% galeria %}
  //   /img/a.jpg | Legenda A
  //   /img/b.jpg | Legenda B
  // {% endgaleria %}
  eleventyConfig.addPairedShortcode("galeria", function(content, legenda = "") {
    const itens = content
      .trim()
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean)
      .map(linha => {
        const [src, cap = ""] = linha.split("|").map(s => s.trim());
        const figcap = cap ? `<figcaption>${inline(cap)}</figcaption>` : "";
        return `<figure><a href="${src}"><img src="${src}" alt="${cap.replace(/"/g, "&quot;")}" loading="lazy" decoding="async"></a>${figcap}</figure>`;
      })
      .join("\n");
    const cap = legenda ? `<figcaption class="galeria-legenda">${inline(legenda)}</figcaption>` : "";
    return `<div class="galeria">\n${itens}\n${cap}</div>`;
  });

  // {% separador %} — asterismo, para pular de cena sem abrir capítulo
  eleventyConfig.addShortcode("separador", () => '<hr class="separador">');

  /* ----------------------------------------
     BLOCOS DE PROSA
     Para passagens em que cada linha conta.
     ---------------------------------------- */

  // {% verso %}...{% endverso %}
  // Preserva quebras e a indentação inicial de cada linha.
  eleventyConfig.addPairedShortcode("verso", function(content) {
    const linhas = content
      .replace(/^\n+|\n+$/g, "")
      .split("\n")
      .map(linha => {
        const recuo = (linha.match(/^\s*/) || [""])[0].length;
        const texto = inline(linha);
        if (!texto) return '<span class="verso-linha verso-vazia"></span>';
        const estilo = recuo ? ` style="padding-left:${Math.min(recuo, 24) * 0.6}em"` : "";
        return `<span class="verso-linha"${estilo}>${texto}</span>`;
      })
      .join("\n");
    return `<div class="verso">\n${linhas}\n</div>`;
  });

  // {% dialogo %}...{% enddialogo %}
  // Uma fala por linha. O travessão é posto se você não puser.
  eleventyConfig.addPairedShortcode("dialogo", function(content) {
    const falas = content
      .trim()
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean)
      .map(linha => {
        const limpa = linha.replace(/^[-–—]\s*/, "");
        return `<p class="fala">${inline(limpa)}</p>`;
      })
      .join("\n");
    return `<div class="dialogo">\n${falas}\n</div>`;
  });

  // {% epigrafe "Fonte" %}...{% endepigrafe %} — abertura de texto
  eleventyConfig.addPairedShortcode("epigrafe", function(content, fonte = null) {
    const cite = fonte ? `<footer>${inline(fonte)}</footer>` : "";
    return `<blockquote class="epigrafe">${block(content)}${cite}</blockquote>`;
  });

  /* ========================================
     COLEÇÕES
     ======================================== */
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    const tagSet = new Set();
    collectionApi.getAll().forEach(item => {
      if ("tags" in item.data) {
        let tags = item.data.tags;
        if (typeof tags === "string") tags = [tags];
        tags = tags.filter(tag => tag !== "posts");
        tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort((a, b) =>
      a.localeCompare(b, "pt-BR", { sensitivity: "base" })
    );
  });

  /* ========================================
     FILTROS
     ======================================== */

  // Datas do front matter são lidas como meia-noite UTC; formatar em UTC
  // evita o site mostrar o dia anterior em fusos negativos.
  eleventyConfig.addFilter("dateFormat", function(dateObj) {
    return new Date(dateObj).toLocaleDateString("pt-BR", {
      year: "numeric", month: "long", day: "numeric", timeZone: "UTC"
    });
  });

  eleventyConfig.addFilter("dateISO", function(dateObj) {
    return new Date(dateObj).toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("groupByYear", function(posts) {
    const grouped = {};
    posts.forEach(post => {
      const year = new Date(post.date).getUTCFullYear();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(post);
    });
    return Object.entries(grouped).sort((a, b) => b[0] - a[0]);
  });

  // Tempo de leitura a partir do HTML renderizado
  eleventyConfig.addFilter("tempoLeitura", function(html) {
    const texto = String(html || "").replace(/<[^>]*>/g, " ");
    const palavras = texto.split(/\s+/).filter(Boolean).length;
    const minutos = Math.max(1, Math.round(palavras / 200));
    return `${palavras} palavras · ${minutos} min de leitura`;
  });

  // Sumário: extrai os <h2> dos posts longos
  eleventyConfig.addFilter("sumario", function(html) {
    const itens = [];
    const re = /<h2[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g;
    let m;
    while ((m = re.exec(String(html || "")))) {
      itens.push({ id: m[1], texto: m[2].replace(/<[^>]*>/g, "").trim() });
    }
    return itens;
  });

  eleventyConfig.addFilter("semTags", function(tags) {
    return (tags || []).filter(t => t !== "posts");
  });

  // Resumo em texto puro, para meta description e RSS
  eleventyConfig.addFilter("resumo", function(html, limite = 200) {
    const texto = String(html || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return texto.length > limite ? texto.slice(0, limite).trimEnd() + "…" : texto;
  });

  /* ========================================
     RSS
     ======================================== */
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: { name: "posts", limit: 20 },
    metadata: {
      language: "pt-BR",
      title: SITE.title,
      subtitle: SITE.subtitle,
      base: SITE.url,
      author: { name: SITE.author }
    }
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk"
  };
};
