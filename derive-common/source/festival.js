const fs = require('fs');
const path = require('path');

const { loadEno } = require('../util.js');
const { ParseError, ValidationError } = require('enolib');

module.exports = async (data, enoPath) => {
  const cached = data.cache.get(enoPath);
  const stats = fs.statSync(path.join(data.root, enoPath));

  if(cached && stats.size === cached.stats.size && stats.mtimeMs === cached.stats.mtimeMs) {
    data.festival = cached.festival;
  } else {
    let doc;

    try {
      doc = loadEno(data.root, enoPath);
    } catch(err) {
      data.cache.delete(enoPath);

      if(err instanceof ParseError) {
        data.errors.push({
          files: [{ path: enoPath, selection: err.selection }],
          message: err.text,
          snippet: err.snippet
        });

        return;
      } else {
        throw err;
      }
    }

    const festival = { sourceFile: enoPath };

    doc.allElementsRequired();

    try {
      festival.title = doc.field('Titel').requiredStringValue();
      festival.subtitle = doc.field('Untertitel').requiredStringValue();
      festival.image = doc.field('Bild').requiredPathValue();
      festival.description = doc.field('Beschreibung').requiredMarkdownValue();
      festival.editions = doc.sections('Edition').map(edition => ({
        image: edition.field('Bild').requiredPathValue(),
        url: edition.field('URL').requiredUrlValue()
      }));

      doc.assertAllTouched();
    } catch(err) {
      data.cache.delete(enoPath);

      if(err instanceof ValidationError) {
        data.errors.push({
          files: [{ path: enoPath, selection: err.selection }],
          message: err.text,
          snippet: err.snippet
        });

        return;
      } else {
        throw err;
      }
    }

    data.cache.set(enoPath, { festival: festival, stats: stats });
    data.festival = festival;
  }
};
