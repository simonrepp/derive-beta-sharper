const fsExtra = require('fs-extra'),
      striptags = require('striptags');
      
const { writeFile } = require('../derive-common/util.js');

const indexArticles = data => {
  const indexed = Array.from(data.articles.values()).map(article => {
    const boosted = `${article.title} ${article.subtitle || ''}`;
    const regular = [article.abstract ? striptags(article.abstract) : '',
                     article.authors.connected.map(author => author.name).join(' '),
                     article.categories.join(' '),
                     article.tags.join(' '),
                     article.text ? striptags(article.text.html) : ''].join(' ');

    return {
      route: `/texte/${article.permalink}/`,
      textBoosted: boosted,
      textRegular: regular,
      title: article.title
    };
  });

  return JSON.stringify(indexed);
};

const indexAuthors = data => {
  const indexed = data.authors.map(author => {
    const boosted = `${author.name} ${author.biography ? striptags(author.biography) : ''}`;
    const regular = [author.city || '',
                     author.country || '',
                     author.tags.join(' '),
                     author.text ? striptags(author.text) : '',
                     author.website || ''].join(' ');

    return {
      route: `/autoren/${author.permalink}/`,
      textBoosted: boosted,
      textRegular: regular,
      title: author.name
    };
  });

  return JSON.stringify(indexed);
};

const indexBooks = data => {
  const indexed = Array.from(data.books.values()).map(book => {
    const boosted = `${book.title} ${book.isxn || ''}`;
    const regular = [book.authors.connected.map(author => author.name).join(' '),
                     book.description ? striptags(book.description) : '',
                     book.publishers.connected.map(publisher => publisher.name).join(' '),
                     book.tags.join(' '),
                     book.placeOfPublication || '',
                     book.url || '',
                     book.yearOfPublication || ''].join(' ');

    return {
      route: `/bücher/${book.permalink}/`,
      textBoosted: boosted,
      textRegular: regular,
      title: book.title
    };
  });

  return JSON.stringify(indexed);
};

const indexIssues = data => {
  const indexed = Array.from(data.issues.values()).map(issue => {
    const boosted = [`dérive № ${issue.number}`,
                     issue.title,
                     issue.features.join(' ')].join(' ');
    const regular = [issue.cooperation || '',
                     issue.description ? striptags(issue.description) : '',
                     issue.partners.connected.map(partner => partner.name).join(' '), // TODO: Is this field really used enough to keep it?
                     issue.tags.join(' ')].join(' ');

    return {
      route: `/zeitschrift/${issue.number}/`, // TODO: issues url scheme
      textBoosted: boosted,
      textRegular: regular,
      title: `dérive № ${issue.number}`
    };
  });

  return JSON.stringify(indexed);
};

const indexPrograms = data => {
  const indexed = Array.from(data.programs.values()).map(program => {
    const boosted = [program.title, program.subtitle].join(' ');
    const regular = [program.abstract ? striptags(program.abstract) : '',
                     program.editors.connected.map(editor => editor.name).join(' '),
                     program.categories.join(' '),
                     program.tags.join(' '),
                     program.text ? striptags(program.text.html) : ''].join(' ');

    return {
      route: `/radio/${program.permalink}/`,
      textBoosted: boosted,
      textRegular: regular,
      title: program.title
    };
  });

  return JSON.stringify(indexed);
};

module.exports = async data => {

  // TODO: PHP serialize? :)

  await fsExtra.copy(path.join(__dirname, 'search/index.php'),
                     path.join(data.buildDir, 'api/search/index.php'));

  return Promise.all([
    writeFile(data.buildDir, '/api/search/articles.json', indexArticles(data)),
    writeFile(data.buildDir, '/api/search/authors.json', indexAuthors(data)),
    writeFile(data.buildDir, '/api/search/books.json', indexBooks(data)),
    writeFile(data.buildDir, '/api/search/issues.json', indexIssues(data)),
    writeFile(data.buildDir, '/api/search/programs.json', indexPrograms(data))
  ]);
};