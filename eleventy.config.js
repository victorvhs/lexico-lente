module.exports = function(eleventyConfig) {
  // Copiar CSS, assets e CNAME diretamente
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/CNAME");

  // Coleção de tags
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
    return Array.from(tagSet).sort();
  });

  // Filtro para formatar data
  eleventyConfig.addFilter("dateFormat", function(dateObj) {
    return new Date(dateObj).toLocaleDateString("pt-BR", {
      year: "numeric", month: "long", day: "numeric"
    });
  });

  // Filtro para agrupar posts por ano
  eleventyConfig.addFilter("groupByYear", function(posts) {
    const grouped = {};
    posts.forEach(post => {
      const year = new Date(post.date).getFullYear();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(post);
    });
    return Object.entries(grouped).sort((a, b) => b[0] - a[0]);
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