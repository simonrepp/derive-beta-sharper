const { loadPlainRich, statFile } = require('../util.js'),
      { PlainDataError, PlainDataParseError } = require('../../plaindata/errors.js'),
      validateArray = require('../validate/array.js'),
      validateKeys = require('../validate/keys.js'),
      validateMarkdown = require('../validate/markdown.js'),
      validateString = require('../validate/string.js'),
      ValidationError = require('../validate/error.js');

module.exports = async (data, plainPath) => {
  const cached = data.cache.get(plainPath);
  const stats = await statFile(data.root, plainPath);

  if(cached && stats.size === cached.stats.size && stats.mTimeMs === cached.stats.mTimeMs) {
    data.radio = cached.radio;
  } else {
    let parsed;

    try {
      parsed = await loadPlainRich(data.root, plainPath);
    } catch(err) {
      data.cache.delete(plainPath);

      if(err instanceof PlainDataParseError) {
        data.errors.push({
          description: `Da es sich bei diesen Daten um essentielle Basisdaten der Website handelt, muss dieses Problem gelöst werden bevor wieder an der Website gearbeitet werden kann.\n\n**Betroffenes File:** ${plainPath}`,
          detail: err.message,
          files: [{
            beginColumn: err.beginColumn,
            beginLine: err.beginLine,
            column: err.column,
            line: err.line,
            path: plainPath
          }],
          header: '**Radio**\n\nDie Daten für die allgemeinen Radio Informationen konnten nicht eingelesen werden.'
        });

        return;
      } else {
        throw err;
      }
    }

    const radio = { sourceFile: plainPath };

    try {
      radio.title = parsed.getValue('Titel', { required: true });
      const info = parsed.getValue('Allgemeine Info', { required: true });
      radio.info = validateMarkdown({'Allgemeine Info': info}, 'Allgemeine Info', { required: true });
      radio.editors = { sourced: parsed.getList('Redaktion') };

      console.log(radio.editors);

      // TODO: Write validator for this for the rich re-implementation
      // validateKeys(document, ['Allgemeine Info', 'Redaktion', 'Titel']);
    } catch(err) {
      data.cache.delete(plainPath);

      if(err instanceof PlainDataError) {
        data.errors.push({
          description: `Da es sich bei diesen Daten um essentielle Basisdaten der Website handelt, muss dieses Problem gelöst werden bevor wieder an der Website gearbeitet werden kann.\n\n**Betroffenes File:** ${plainPath}`,
          detail: err.message,
          files: [{ path: plainPath }],
          header: '**Radio**\n\nDie Daten für die allgemeinen Radio Informationen konnten nicht validiert werden.'
        });

        return;
      } else {
        throw err;
      }
    }

    data.cache.set(plainPath, { radio: radio, stats: stats });
    data.radio = radio;
  }
};
