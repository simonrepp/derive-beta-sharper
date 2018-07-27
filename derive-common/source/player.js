const { loadEno, statFile } = require('../util.js'),
      { ValidationError, ParseError } = require('enojs'),
      { validateMarkdown } = require('../validate/markdown.js'),
      validatePermalink = require('../validate/permalink.js');

module.exports = async (data, enoPath) => {
  const cached = data.cache.get(enoPath);
  const stats = await statFile(data.root, enoPath);

  if(cached && stats.size === cached.stats.size && stats.mTimeMs === cached.stats.mTimeMs) {
    data.players.set(enoPath, cached.player);
  } else {
    let doc;

    try {
      doc = await loadEno(data.root, enoPath);
    } catch(err) {
      data.cache.delete(enoPath);

      if(err instanceof ParseError) {
        data.warnings.push({
          files: [{ path: enoPath, selection: err.selection }],
          message: err.text,
          snippet: err.snippet
        });

        return;
      } else {
        throw err;
      }
    }

    const player = {
      draft: enoPath.match(/\.entwurf\.eno$/),
      sourceFile: enoPath
    };

    doc.enforceAllElements();

    try {
      const name = doc.field('Name', { required: true, withElement: true });
      player.name = name.value;
      player.nameElement = name.element;

      const permalink = doc.field('Permalink', validatePermalink, { required: true, withElement: true });
      player.permalink = permalink.value;
      player.permalinkElement = permalink.element;

      player.firstName = doc.field('Vorname');
      player.lastName = doc.field('Nachname');
      player.country = doc.field('Land');
      player.city = doc.field('Stadt');
      player.tagsDisconnected = doc.list('Tags');
      player.website = doc.url('Website');
      player.biography = doc.field('Biographie', validateMarkdown);
      player.text = doc.field('Text', validateMarkdown);

      doc.assertAllTouched();
    } catch(err) {
      data.cache.delete(enoPath);

      if(err instanceof ValidationError) {
        data.warnings.push({
          files: [{ path: enoPath, selection: err.selection }],
          message: err.text,
          snippet: err.snippet
        });

        return;
      } else {
        throw err;
      }
    }

    data.cache.set(enoPath, { player: player, stats: stats });
    data.players.set(enoPath, player);
  }
};
