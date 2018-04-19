module.exports = data => {
  data.articlesByPermalink.clear();
  data.articlesByTitle.clear();
  data.articles.forEach(article => {
    let existingArticle = data.articlesByTitle.get(article.title);

    if(existingArticle) {
      const existingError = existingArticle.titleTrace.error();
      const discardedError = article.titleTrace.error();

      data.warnings.push({
        files: [
          { path: existingArticle.sourceFile, ranges: existingError.ranges },
          { path: article.sourceFile, ranges: discardedError.ranges }
        ],
        message: `Es existieren zwei Artikel mit dem Titel "${article.title}"`,
        snippet: discardedError.snippet
      });


      data.articles.delete(article.sourceFile);
      return;
    }

    existingArticle = data.articlesByPermalink.get(article.permalink);

    if(existingArticle) {
      const existingError = existingArticle.permalinkTrace.error();
      const discardedError = article.permalinkTrace.error();

      data.warnings.push({
        files: [
          { path: existingArticle.sourceFile, ranges: existingError.ranges },
          { path: article.sourceFile, ranges: discardedError.ranges }
        ],
        message: `Es existieren zwei Artikel mit dem Permalink "${article.permalink}"`,
        snippet: discardedError.snippet
      });

      data.articles.delete(article.sourceFile);
      return;
    }

    data.articlesByPermalink.set(article.permalink, article);
    data.articlesByTitle.set(article.title, article);
  });

  data.booksByPermalink.clear();
  data.booksByTitle.clear();
  data.books.forEach(book => {
    let existingBook = data.booksByTitle.get(book.title);

    if(existingBook) {
      const existingError = existingBook.titleTrace.error();
      const discardedError = book.titleTrace.error();

      data.warnings.push({
        files: [
          { path: existingBook.sourceFile, ranges: existingError.ranges },
          { path: book.sourceFile, ranges: discardedError.ranges }
        ],
        message: `Es existieren zwei Bücher mit dem Titel "${book.title}"`,
        snippet: discardedError.snippet
      });

      data.books.delete(book.sourceFile);
      return;
    }

    existingBook = data.booksByPermalink.get(book.permalink);

    if(existingBook) {
      const existingError = existingBook.permalinkTrace.error();
      const discardedError = book.permalinkTrace.error();

      data.warnings.push({
        files: [
          { path: existingBook.sourceFile, ranges: existingError.ranges },
          { path: book.sourceFile, ranges: discardedError.ranges }
        ],
        message: `Es existieren zwei Bücher mit dem Permalink "${book.permalink}"`,
        snippet: discardedError.snippet
      });

      data.books.delete(book.sourceFile);
      return;
    }

    data.booksByPermalink.set(book.permalink, book);
    data.booksByTitle.set(book.title, book);
  });

  data.eventsByPermalink.clear();
  data.events.forEach(event => {
    const existingEvent = data.eventsByPermalink.get(event.permalink);

    if(existingEvent) {
      const existingError = existingEvent.permalinkTrace.error();
      const discardedError = event.permalinkTrace.error();

      data.warnings.push({
        files: [
          { path: existingEvent.sourceFile, ranges: existingError.ranges },
          { path: event.sourceFile, ranges: discardedError.ranges }
        ],
        message: `Es existieren zwei Veranstaltungen mit dem Permalink "${event.permalink}"`,
        snippet: discardedError.snippet
      });

      data.events.delete(event.sourceFile);
    } else {
      data.eventsByPermalink.set(event.permalink, event);
    }
  });

  data.issuesByNumber.clear();
  data.issues.forEach(issue => {
    const existingIssue = data.issuesByNumber.get(issue.number);

    if(existingIssue) {
      const existingError = existingIssue.numberTrace.error();
      const discardedError = issue.numberTrace.error();

      data.warnings.push({
        files: [
          { path: existingIssue.sourceFile, ranges: existingError.ranges },
          { path: issue.sourceFile, ranges: discardedError.ranges }
        ],
        message: `Es existieren zwei Zeitschriften mit der Nummer ${issue.number}`,
        snippet: discardedError.snippet
      });

      data.issues.delete(issue.sourceFile);
    } else {
      data.issuesByNumber.set(issue.number, issue);
    }
  });

  data.playersByName.clear();
  data.playersByPermalink.clear();
  data.players.forEach(player => {
    let existingPlayer = data.playersByName.get(player.name);

    if(existingPlayer) {
      const existingError = existingPlayer.nameTrace.error();
      const discardedError = player.nameTrace.error();

      data.warnings.push({
        files: [
          { path: existingPlayer.sourceFile, ranges: existingError.ranges },
          { path: player.sourceFile, ranges: discardedError.ranges }
        ],
        message: `Es existieren zwei Akteure mit dem Namen "${player.name}"`,
        snippet: discardedError.snippet
      });

      data.players.delete(player.sourceFile);
      return;
    }

    existingPlayer = data.playersByPermalink.get(player.permalink);

    if(existingPlayer) {
      const existingError = existingPlayer.permalinkTrace.error();
      const discardedError = player.permalinkTrace.error();

      data.warnings.push({
        files: [
          { path: existingPlayer.sourceFile, ranges: existingError.ranges },
          { path: player.sourceFile, ranges: discardedError.ranges }
        ],
        message: `Es existieren zwei Akteure mit dem Permalink "${player.permalink}"`,
        snippet: discardedError.snippet
      });

      data.players.delete(player.sourceFile);
      return;
    }

    data.playersByName.set(player.name, player);
    data.playersByPermalink.set(player.permalink, player);
  });

  data.pagesByPermalink.clear();
  data.pages.forEach(page => {
    const permalinkInContext = [page.permalink, page.urbanize].filter(Boolean).join('-');
    const existingPage = data.pagesByPermalink.get(permalinkInContext); // TODO: We check for permalink In Context but set permalink without context? Check again

    if(existingPage) {
      const existingError = existingPage.permalinkTrace.error();
      const discardedError = page.permalinkTrace.error();

      data.warnings.push({
        files: [
          { path: existingPage.sourceFile, ranges: existingError.ranges },
          { path: page.sourceFile, ranges: discardedError.ranges }
        ],
        message: `Es existieren zwei Seiten mit dem Permalink "${page.permalink}" im selben Kontext (z.b. Urbanize Festival)`,
        snippet: discardedError.snippet
      });

      data.pages.delete(page.sourceFile);
    } else {
      data.pagesByPermalink.set(page.permalink, page);
    }
  });

  data.programsByPermalink.clear();
  data.programs.forEach(program => {
    const existingProgram = data.programsByPermalink.get(program.permalink);

    if(existingProgram) {
      const existingError = existingProgram.permalinkTrace.error();
      const discardedError = program.permalinkTrace.error();

      data.warnings.push({
        files: [
          { path: existingProgram.sourceFile, ranges: existingError.ranges },
          { path: program.sourceFile, ranges: discardedError.ranges }
        ],
        message: `Es existieren zwei Radiosendungen mit dem Permalink "${program.permalink}"`,
        snippet: discardedError.snippet
      });

      data.programs.delete(program.sourceFile);
    } else {
      data.programsByPermalink.set(program.permalink, program);
    }
  });
};
