const fsExtra = require('fs-extra'),
      path = require('path');
      
const { writeFile } = require('../derive-common/util.js');

const articlePage = require('./src/pages/article.js'),
      articlePrintPage = require('./src/pages/article-print.js'),
      articlesPage = require('./src/pages/articles.js'),
      authorPage = require('./src/pages/author.js'),
      { authorsPage, letters } = require('./src/pages/authors.js'),
      bookPage = require('./src/pages/book.js'),
      booksPage = require('./src/pages/books.js'),
      festivalPage = require('./src/pages/festival.js'),
      imprintPage = require('./src/pages/imprint.js'),
      indexPage = require('./src/pages/index.js'),
      kioskPage = require('./src/pages/kiosk.js'),
      issuesPage = require('./src/pages/issues.js'),
      notFoundPage = require('./src/pages/404.js'),
      publisherPage = require('./src/pages/publisher.js'),
      programPage = require('./src/pages/program.js'),
      programsPage = require('./src/pages/programs.js'),
      searchPage = require('./src/pages/search.js'),
      tagPage = require('./src/pages/tag.js');

module.exports = async data => {
  const write = (html, filePath) => fsExtra.outputFile(path.join(data.buildDir, filePath), html);

  await Promise.all([
    writeFile(data.buildDir, 'texte/index.html', articlesPage(data)),
    writeFile(data.buildDir, 'autoren/index.html', authorsPage(data)),
    writeFile(data.buildDir, 'bücher/index.html', booksPage(data)),
    writeFile(data.buildDir, 'festival/index.html', festivalPage()),
    writeFile(data.buildDir, 'imprint.html', imprintPage()),
    writeFile(data.buildDir, 'index.html', indexPage()),
    writeFile(data.buildDir, 'kiosk/index.html', kioskPage()),
    writeFile(data.buildDir, 'zeitschrift/index.html', issuesPage(data)),
    writeFile(data.buildDir, 'seite-nicht-gefunden/index.html', notFoundPage()),
    writeFile(data.buildDir, 'radio/index.html', programsPage(data)),
    writeFile(data.buildDir, 'suche/index.html', searchPage())
  ]);

  for(let article of data.articles.values()) {
    await writeFile(data.buildDir, `texte/${article.permalink}/index.html`, articlePage(article));
  }

  for(let article of data.articles.values()) {
    await writeFile(data.buildDir, `texte/${article.permalink}/druckversion/index.html`, articlePrintPage(article));
  }

  for(let letter of letters) {
    await writeFile(data.buildDir, `autoren/${letter}/index.html`, authorsPage(data, letter));
  }

  for(let author of data.authors) {
    await writeFile(data.buildDir, `autoren/${author.permalink}/index.html`, authorPage(author));
  }

  for(let author of data.bookAuthors) {
    await writeFile(data.buildDir, `autoren/${author.permalink}/index.html`, authorPage(author));
  }

  for(let publisher of data.publishers) {
    await writeFile(data.buildDir, `verlage/${publisher.permalink}/index.html`, publisherPage(publisher));
  }

  for(let book of data.books.values()) {
    await writeFile(data.buildDir, `bücher/${book.permalink}/index.html`, bookPage(book));
  }

  for(let program of data.programs.values()) {
    await writeFile(data.buildDir, `radio/${program.permalink}/index.html`, programPage(program));
  }

  for(let [tag, tagData] of data.tags.entries()) {
    await writeFile(data.buildDir, `tags/${tag.replace('/', '-')}/index.html`, tagPage(tag, tagData)); // TODO: Move / escaping to expand() - see comment in create-folder-structure.js
  }
};
