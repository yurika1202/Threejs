const marked = require("marked");

module.exports = (markdown, cliOptions) => {
  return marked.Parser(markdown, {
    gfm: cliOptions.gfm,
  });
};
