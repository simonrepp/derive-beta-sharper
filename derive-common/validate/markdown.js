const path = require('path');

const { renderMarkdown } = require('../util.js');

const embeddableMediaExtensions = [
  '.tif', '.TIF', '.tiff', '.TIFF', '.gif', '.GIF', '.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG'
];

const htmlMediaRegex = /(src|href)\s*=\s*['"]\s*(?!https?:\/\/|\/\/)(\S(?:(?!src\s*=|href\s*=).)*\.(?:doc|DOC|gif|GIF|jpeg|JPEG|jpg|JPG|pdf|PDF|png|PNG|tif|TIF|tiff|TIFF))\s*['"]/g;
const markdownMediaRegex = /(!|)\[(?:(?!\[.*\]).)*\]\((?!https?:\/\/|\/\/)(\S(?:(?!\[.*\]).)*\.(?:doc|DOC|gif|GIF|jpeg|JPEG|jpg|JPG|pdf|PDF|png|PNG|tif|TIF|tiff|TIFF))\s*(?:\s+"(?:(?!".*"\)).)*")?\)/g;
// Pluggable, modulare regex components to build the md/html rules? - also think more in terms of inception matching (no src="" inside src="", no ![]() inside ![]() ..)
// match(/!\[((?!!\[.*\]\(.*\)).)*\]\(((?!!\[.*\]\(.*\)).)*\)/g); (possibly resuse to improve regexes later, missing ](https?: NEGATIVE LOOKAHEAD THINGY)

const validate = ({ key, value }, mediaAllowed) => {
  const downloads = [];
  const embeds = [];

  let downloadNumber = 1;
  let embedNumber = 1;

  const validateEmbeddedMedia  = (fullMatch, typeMatch, urlMatch) => {
    const fileExtension = path.extname(urlMatch);
    const normalizedPath = urlMatch.replace(/^\//, '').normalize();

    if(typeMatch === '!' || typeMatch === 'src') {
      if(embeddableMediaExtensions.includes(fileExtension)) {
        const embed = {
          encodedURI: encodeURI(normalizedPath),
          normalizedPath: normalizedPath,
          placeholder: `EMBED_INTERMEDIATE_${embedNumber}`,
          virtualFilename: `embed-${embedNumber}${fileExtension}`
        };

        embeds.push(embed);
        embedNumber++;

        return fullMatch.replace(urlMatch, embed.placeholder);
      } else {
        throw `Das Markdown-Feld "${key}" enthält einen Embed der Datei "${urlMatch}", dessen Dateityp ist aber für Embeds nicht erlaubt.`;
      }
    } else if(typeMatch === '' || typeMatch === 'href') {
      const download = {
        encodedURI: encodeURI(normalizedPath),
        normalizedPath: normalizedPath,
        placeholder: `DOWNLOAD_INTERMEDIATE_${downloadNumber}`,
        virtualFilename: `download-${downloadNumber}${fileExtension}`
      };

      downloads.push(download);
      downloadNumber++;

      return fullMatch.replace(urlMatch, download.placeholder);
    } else {
      throw 'Interner Fehler bei der RegExp-basierten Detektion von referenzierten Mediendateien.';
    }
  };

  value = value.replace(markdownMediaRegex, validateEmbeddedMedia);
  value = value.replace(htmlMediaRegex, validateEmbeddedMedia);

  if(!mediaAllowed && (downloads.length > 0 || embeds.length > 0)) {
    throw `Das Markdown im Feld "${key}" enhält Verweise auf Mediendateien, in diesem Feld ist das aber nicht erlaubt.`;
  }

  let html;
  try {
    html = renderMarkdown(value);
  } catch(err) {
    throw `Das Markdown im Feld "${key}" hat beim konvertieren einen Fehler ausgelöst: ${err}`;
  }

  return {
    downloads: downloads,
    embeds: embeds,
    converted: html
  };
};

exports.validateMarkdown = plaindataValue => validate(plaindataValue, false);
exports.validateMarkdownWithMedia = plaindataValue => validate(plaindataValue, true);
