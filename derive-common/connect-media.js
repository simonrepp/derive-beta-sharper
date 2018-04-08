const path = require('path');

class ConnectMediaError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, ConnectMediaError);
  }
}

const connectMedia = (data, normalizedPath) => {
  if(data.media.has(normalizedPath)) {
    data.media.set(normalizedPath, true);

    return true;
  } else {
    return false;
  }
};

const connectMarkdownMedia = (data, field, fieldName) => {
  ['downloads', 'embeds'].forEach(mediaType => {
    field[mediaType].forEach((replacedPath, normalizedPath) => {
      if(data.media.has(normalizedPath)) {
        data.media.set(normalizedPath, true);
      } else {
        throw new ConnectMediaError(`Das Markdown-Feld "${fieldName}" enthält einen Verweis auf die Datei "${normalizedPath}", diese wurde aber nicht gefunden.`);
      }
    });
  });
};

module.exports = data => {
  data.articles.forEach(article => {
    if(article.image && !connectMedia(data, article.image.sourced)) {
      data.warnings.push({
        description: `Bis zur Lösung des Problems scheint der Artikel nicht auf, davon abgesehen hat dieser Fehler keine Auswirkungen.\n\n**Betroffenes File:** ${article.sourceFile}`,
        detail: `Der Artikel "${article.title}" referenziert im Dateifeld "Bild" die Datei "${article.image.sourced}", unter dem angegebenen Pfad wurde aber keine Datei gefunden.`,
        files: [{ path: article.sourceFile }],
        header: 'Problem gefunden beim prüfen der Verlinkung zu einer Mediendatei'
      });

      data.articles.delete(article.sourceFile);
    }

    if(article.text) {
      try {
        connectMarkdownMedia(data, article.text, 'Text');
      } catch(err) {
        if(err instanceof ConnectMediaError) {
          data.warnings.push({
            description: `Bis zur Lösung des Problems scheint der Artikel nicht auf, davon abgesehen hat dieser Fehler keine Auswirkungen.\n\n**Betroffenes File:** ${article.sourceFile}`,
            detail: err.message,
            files: [{ path: article.sourceFile }],
            header: `Problem beim prüfen der eingebetteten Mediendateien im Artikel "${article.title}"`
          });

          data.articles.delete(article.sourceFile);
        } else {
          throw err;
        }
      }
    }
  });

  data.books.forEach(book => {
    if(book.cover && !connectMedia(data, book.cover.sourced)) {
      data.warnings.push({
        description: `Bis zur Lösung des Problems scheint das Bild nicht auf, davon abgesehen hat dieser Fehler keine Auswirkungen.\n\n**Betroffenes File:** ${book.sourceFile}`,
        detail: `Das Buch "${book.title}" referenziert im Dateifeld "Cover" die Datei "${book.cover.sourced}", unter dem angegebenen Pfad wurde aber keine Datei gefunden.`,
        files: [{ path: book.sourceFile }],
        header: 'Problem gefunden beim prüfen der Verlinkung zu einem Coverbild'
      });

      data.books.delete(book.sourceFile);
    }
  });

  data.events.forEach(event => {
    if(event.image && !connectMedia(data, event.image.sourced)) {
      data.warnings.push({
        description: `Bis zur Lösung des Problems scheint das Bild nicht auf, davon abgesehen hat dieser Fehler keine Auswirkungen.\n\n**Betroffenes File:** ${event.sourceFile}`,
        detail: `Die Veranstaltung "${event.title}" referenziert im Dateifeld "Bild" die Datei "${event.image.sourced}", unter dem angegebenen Pfad wurde aber keine Datei gefunden.`,
        files: [{ path: event.sourceFile }],
        header: 'Problem gefunden beim prüfen der Verlinkung zu einem Bild'
      });

      data.events.delete(event.sourceFile);
    }

    if(event.text) {
      try {
        connectMarkdownMedia(data, event.text, 'Text');
      } catch(err) {
        if(err instanceof ConnectMediaError) {
          data.warnings.push({
            description: `Bis zur Lösung des Problems scheint die Veranstaltung nicht auf, davon abgesehen hat dieser Fehler keine Auswirkungen.\n\n**Betroffenes File:** ${event.sourceFile}`,
            detail: err.message,
            files: [{ path: event.sourceFile }],
            header: `Problem beim prüfen der eingebetteten Mediendateien in der Veranstaltung "${event.title}"`
          });

          data.events.delete(event.sourceFile);
        } else {
          throw err;
        }
      }
    }
  });

  data.features.forEach(feature => {
    if(feature.image && !connectMedia(data, feature.image.sourced)) {
      data.warnings.push({
        description: `Bis zur Lösung des Problems scheint das Bild nicht auf, davon abgesehen hat dieser Fehler keine Auswirkungen.\n\n**Betroffenes File:** ${feature.sourceFile}`,
        detail: `Das Feature "${feature.title}" referenziert im Dateifeld "Bild" die Datei "${feature.image.sourced}", unter dem angegebenen Pfad wurde aber keine Datei gefunden.`,
        files: [{ path: feature.sourceFile }],
        header: 'Problem gefunden beim prüfen der Verlinkung zu einem Bild'
      });

      data.features.delete(feature.sourceFile);
    }
  });

  data.issues.forEach(issue => {
    if(issue.cover && !connectMedia(data, issue.cover.sourced)) {
      data.warnings.push({
        description: `Bis zur Lösung des Problems scheint das Bild nicht auf, davon abgesehen hat dieser Fehler keine Auswirkungen.\n\n**Betroffenes File:** ${issue.sourceFile}`,
        detail: `Die Zeitschrift #${issue.number} referenziert im Dateifeld "Bild" die Datei "${issue.cover.sourced}", unter dem angegebenen Pfad wurde aber keine Datei gefunden.`,
        files: [{ path: issue.sourceFile }],
        header: 'Problem gefunden beim prüfen der Verlinkung zu einem Coverbild'
      });

      data.issues.delete(issue.sourceFile);
    }
  });

  data.pages.forEach(page => {
    if(page.text) {
      try {
        connectMarkdownMedia(data, page.text, 'Text');
      } catch(err) {
        if(err instanceof ConnectMediaError) {
          data.warnings.push({
            description: `Bis zur Lösung des Problems scheint die Seite nicht auf, davon abgesehen hat dieser Fehler keine Auswirkungen.\n\n**Betroffenes File:** ${page.sourceFile}`,
            detail: err.message,
            files: [{ path: page.sourceFile }],
            header: `Problem beim prüfen der eingebetteten Mediendateien auf der Seite "${page.title}"`
          });

          data.pages.delete(page.sourceFile);
        } else {
          throw err;
        }
      }
    }
  });

  data.programs.forEach(program => {
    if(program.image && !connectMedia(data, program.image.sourced)) {
      data.warnings.push({
        description: `Bis zur Lösung des Problems scheint das Bild nicht auf, davon abgesehen hat dieser Fehler keine Auswirkungen.\n\n**Betroffenes File:** ${program.sourceFile}`,
        detail: `Die Radiosendung "${program.title}" referenziert im Dateifeld "Bild" die Datei "${program.image.sourced}", unter dem angegebenen Pfad wurde aber keine Datei gefunden.`,
        files: [{ path: program.sourceFile }],
        header: 'Problem gefunden beim prüfen der Verlinkung zu einem Bild'
      });

      data.programs.delete(program.sourceFile);
      return;
    }

    if(program.soundfile && !connectMedia(data, program.soundfile.sourced)) {
      data.warnings.push({
        description: `Bis zur Lösung des Problems scheint das Soundfile nicht auf, davon abgesehen hat dieser Fehler keine Auswirkungen.\n\n**Betroffenes File:** ${program.sourceFile}`,
        detail: `Die Radiosendung "${program.title}" referenziert im Dateifeld "Soundfile" die Datei "${program.soundfile.sourced}", unter dem angegebenen Pfad wurde aber keine Datei gefunden.`,
        files: [{ path: program.sourceFile }],
        header: 'Problem beim prüfen der Verlinkung zu einem Soundfile'
      });

      data.programs.delete(program.sourceFile);
      return;
    }

    if(program.text) {
      try {
        connectMarkdownMedia(data, program.text, 'Text');
      } catch(err) {
        if(err instanceof ConnectMediaError) {
          data.warnings.push({
            description: `Bis zur Lösung des Problems scheint die Radiosendung nicht auf, davon abgesehen hat dieser Fehler keine Auswirkungen.\n\n**Betroffenes File:** ${program.sourceFile}`,
            detail: err.message,
            files: [{ path: program.sourceFile }],
            header: `Problem beim prüfen der eingebetteten Mediendateien in der Radiosendung "${program.title}"`
          });

          data.programs.delete(program.sourceFile);
        } else {
          throw err;
        }
      }
    }
  });
};
