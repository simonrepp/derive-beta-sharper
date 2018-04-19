const { loadPlain, statFile } = require('../util.js'),
      { PlainDataError, PlainDataParseError } = require('../../plaindata/errors.js'),
      validateAbsoluteUrl = require('../validate/absolute-url.js'),
      { validateMarkdown } = require('../validate/markdown.js'),
      validatePermalink = require('../validate/permalink.js');

module.exports = async (data, plainPath) => {
  const cached = data.cache.get(plainPath);
  const stats = await statFile(data.root, plainPath);

  if(cached && stats.size === cached.stats.size && stats.mTimeMs === cached.stats.mTimeMs) {
    data.players.set(plainPath, cached.player);
  } else {
    let document;

    try {
      document = await loadPlain(data.root, plainPath);
    } catch(err) {
      data.cache.delete(plainPath);

      if(err instanceof PlainDataParseError) {
        data.warnings.push({
          detail: err.message,
          files: [{ path: plainPath, ranges: err.ranges }],
          message: err.message,
          snippet: err.snippet
        });

        return;
      } else {
        throw err;
      }
    }

    const player = { sourceFile: plainPath };

    try {
      const name = document.value('Name', { required: true, withTrace: true });
      player.name = name.value;
      player.nameTrace = name.trace;

      // TODO: Consider processing function as a 2nd positional argument instead of verbose option
      const permalink = document.value('Permalink', validatePermalink, { required: true, withTrace: true });
      player.permalink = permalink.value;
      player.permalinkTrace = permalink.trace;

      player.country = document.value('Land');
      player.city = document.value('Stadt');
      player.tags = { sourced: document.values('Tags') };
      player.website = document.value('Website', validateAbsoluteUrl);
      player.biography = document.value('Biographie', validateMarkdown);
      player.text = document.value('Text', validateMarkdown);

      document.assertAllTouched();
    } catch(err) {
      data.cache.delete(plainPath);

      if(err instanceof PlainDataError) {
        data.warnings.push({
          detail: err.message,
          files: [{ path: plainPath, ranges: err.ranges }],
          message: err.message,
          snippet: err.snippet
        });

        return;
      } else {
        throw err;
      }
    }

    data.cache.set(plainPath, { player: player, stats: stats });
    data.players.set(plainPath, player);
  }
};
