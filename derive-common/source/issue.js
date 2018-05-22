const { loadEno, statFile } = require('../util.js'),
      { EnoValidationError, EnoParseError } = require('enojs'),
      validateBoolean = require('../validate/boolean.js'),
      validateDate = require('../validate/date.js'),
      validateInteger = require('../validate/integer.js'),
      { validateMarkdown } = require('../validate/markdown.js'),
      validatePath = require('../validate/path.js');

module.exports = async (data, enoPath) => {
  const cached = data.cache.get(enoPath);
  const stats = await statFile(data.root, enoPath);

  if(cached && stats.size === cached.stats.size && stats.mTimeMs === cached.stats.mTimeMs) {
    data.issues.set(enoPath, cached.issue);
  } else {
    let doc;

    try {
      doc = await loadEno(data.root, enoPath);
    } catch(err) {
      data.cache.delete(enoPath);

      if(err instanceof EnoParseError) {
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

    const issue = {
      draft: enoPath.match(/\.entwurf\.eno$/),
      sourceFile: enoPath
    };

    doc.enforcePresence(true);

    try {
      const number = doc.field('Nummer', validateInteger, { required: true, withTrace: true });
      issue.number = number.value;
      issue.numberTrace = number.trace;

      issue.title = doc.field('Titel', { required: true });
      issue.year = doc.field('Jahr', validateInteger, { required: true });
      issue.quarter = doc.field('Quartal', validateInteger, { required: true });
      issue.cover = doc.field('Cover', validatePath, { required: true });
      issue.shopLink = doc.field('Link zum Shop');
      issue.cooperation = doc.field('Kooperation');
      issue.features = doc.list('Schwerpunkte');
      issue.outOfPrint = doc.field('Vergriffen', validateBoolean);
      issue.publicationDate = doc.field('Erscheinungsdatum', validateDate);
      issue.tagsDisconnected = doc.list('Tags');
      issue.description = doc.field('Beschreibung', validateMarkdown);

      issue.sections = doc.sections('Rubrik').map(section => ({
        title: section.field('Titel', { required: true }),
        articleReferences: section.sections('Artikel').map(reference => {
          const title = reference.field('Titel', { required: true, withTrace: true });

          return {
            pages: reference.field('Seite(n)', { required: true }),
            title: title.value,
            titleTrace: title.trace
          };
        })
      }));

      doc.assertAllTouched();
    } catch(err) {
      data.cache.delete(enoPath);

      if(err instanceof EnoValidationError) {
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

    data.cache.set(enoPath, { issue: issue, stats: stats });
    data.issues.set(enoPath, issue);
  }
};
