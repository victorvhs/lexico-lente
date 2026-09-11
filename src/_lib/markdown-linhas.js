/**
 * markdown-it: atributos por linha.
 *
 * O markdown-it-attrs aplica `{.classe}` ao bloco inteiro. Como o blog roda
 * com `breaks: true`, um parágrafo costuma ter várias linhas — e escrever em
 * frases curtas significa querer tratar UMA delas de forma diferente sem
 * quebrar o parágrafo em dois.
 *
 * Este plugin completa a regra, e a divisão é pela POSIÇÃO da marca:
 *
 *   - no fim de uma linha com texto  -> vale só para aquela linha
 *   - sozinha na própria linha       -> vale para o parágrafo inteiro
 *
 * A sintaxe é a mesma do attrs, então não há nada novo para memorizar.
 *
 *     Ele apertou o botão de pânico.
 *     Ele estava preso. {.solo}      <- só esta linha
 *     Entre os andares 10 e 9.
 *
 *     Ele apertou o botão de pânico.
 *     Ele estava preso.
 *     {.recuo}                       <- o parágrafo todo
 *
 * Roda antes do markdown-it-attrs, que continua cuidando do caso "sozinha
 * na própria linha" e dos demais blocos (títulos, listas, citações).
 */

const MARCA = /\s*\{([.#][^{}]*)\}\s*$/;

function parseAtributos(texto) {
  const classes = [];
  let id = null;
  texto
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .forEach(parte => {
      if (parte.startsWith(".")) classes.push(parte.slice(1));
      else if (parte.startsWith("#")) id = parte.slice(1);
    });
  return { classes, id };
}

module.exports = function markdownLinhas(md) {
  // Precisa rodar antes do attrs, que é quem reivindica a marca sozinha
  // na linha. Se o attrs ainda não foi carregado, entra no fim da fila.
  const registrar = md.core.ruler.__rules__.some(r => r.name === "curly_attributes")
    ? (nome, fn) => md.core.ruler.before("curly_attributes", nome, fn)
    : (nome, fn) => md.core.ruler.push(nome, fn);

  registrar("linhas_com_atributos", function(state) {
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i];
      if (token.type !== "inline" || !token.children) continue;

      // Só parágrafos. Em títulos, listas e citações a marca continua
      // sendo atributo do bloco, como o attrs sempre fez.
      const abertura = state.tokens[i - 1];
      if (!abertura || abertura.type !== "paragraph_open" || abertura.hidden) continue;

      // Quebra os filhos em segmentos: cada segmento é uma linha visual.
      const linhas = [[]];
      for (const filho of token.children) {
        if (filho.type === "softbreak" || filho.type === "hardbreak") {
          linhas.push({ quebra: filho });
          linhas.push([]);
        } else {
          linhas[linhas.length - 1].push(filho);
        }
      }

      let mudou = false;
      const saida = [];

      for (const segmento of linhas) {
        if (!Array.isArray(segmento)) {
          saida.push(segmento.quebra);
          continue;
        }

        // A marca precisa estar no último nó de texto da linha.
        const ultimo = segmento[segmento.length - 1];
        const marca = ultimo && ultimo.type === "text" && ultimo.content.match(MARCA);

        // Marca sozinha na linha: é atributo do bloco, deixa para o attrs.
        const sozinha =
          marca && segmento.length === 1 && !ultimo.content.replace(MARCA, "").trim();

        if (!marca || sozinha) {
          saida.push(...segmento);
          continue;
        }

        const { classes, id } = parseAtributos(marca[1]);
        if (!classes.length && !id) {
          saida.push(...segmento);
          continue;
        }

        ultimo.content = ultimo.content.replace(MARCA, "");
        if (!ultimo.content && segmento.length > 1) segmento.pop();

        const abre = new state.Token("span_open", "span", 1);
        abre.attrSet("class", ["linha", ...classes].join(" "));
        if (id) abre.attrSet("id", id);
        const fecha = new state.Token("span_close", "span", -1);

        saida.push(abre, ...segmento, fecha);
        mudou = true;
      }

      if (mudou) token.children = saida;
    }
  });
};
