const { loadPlain, statFile, URBANIZE_ENUM } = require('../util.js'),
      { PlainDataError, PlainDataParseError } = require('../../plaindata/errors.js'),
      validateEnum = require('../validate/enum.js'),
      { validateMarkdownWithMedia } = require('../validate/markdown.js'),
      validatePermalink = require('../validate/permalink.js');

const specifiedKeys = [
  'Permalink',
  'Text',
  'Titel',
  'Urbanize'
];

module.exports = async (data, plainPath) => {
  const cached = data.cache.get(plainPath);
  const stats = await statFile(data.root, plainPath);

  if(cached && stats.size === cached.stats.size && stats.mTimeMs === cached.stats.mTimeMs) {
    data.pages.set(plainPath, cached.page);
  } else {
    let document;

    try {
      document = await loadPlain(data.root, plainPath);
    } catch(err) {
      data.cache.delete(plainPath);

      if(err instanceof PlainDataParseError) {
        data.warnings.push({
          description: 'Bis zur Lösung des Problems scheint die betroffene Seite nicht auf der Website auf, davon abgesehen hat dieser Fehler keine Auswirkungen.',
          detail: err.message,
          files: [{ path: plainPath, ranges: err.ranges }],
          message: `**${plainPath}**\n\n${err.message}`,
          snippet: err.snippet
        });

        return;
      } else {
        throw err;
      }
    }

    const page = { sourceFile: plainPath };

    try {
      page.title = document.value('Titel', { required: true });
      page.permalink = document.value('Permalink', { process: validatePermalink, required: true });
      page.permalinkMeta = document.meta('Permalink');

      // validateKeys(document, specifiedKeys);

      page.urbanize = document.value('Urbanize', { process: validateEnum(URBANIZE_ENUM) });
      page.text = document.value('Text', { process: validateMarkdownWithMedia });
    } catch(err) {
      data.cache.delete(plainPath);

      if(err instanceof PlainDataError) {
        data.warnings.push({
          description: 'Bis zur Lösung des Problems scheint die betroffene Seite nicht auf der Website auf, davon abgesehen hat dieser Fehler keine Auswirkungen.',
          detail: err.message,
          files: [{ path: plainPath, ranges: err.ranges }],
          message: `**${plainPath}**\n\n${err.message}`,
          snippet: err.snippet
        });

        return;
      } else {
        throw err;
      }
    }

    data.cache.set(plainPath, { page: page, stats: stats });
    data.pages.set(plainPath, page);
  }
};
