const moment = require('moment');

const authors = require('./authors.js'),
      reviews = require('./reviews.js');

module.exports = book => `
  <div class="tile">
    <div class="tile_header">
      <a href="/bücher/${book.permalink}/">
        ${book.title}
      </a>
    </div>

    <div class="book_tile_split">
      <div class="book_tile_split__cover">
        ${book.cover ? `
          <img src="${book.cover.written}" />
        `:''}
      </div>

      <div class="book_tile_split__meta">
        ${authors(book.authors)}

        <div class="generic__margin-vertical">
          ${[
            book.placeOfPublication ? `${book.placeOfPublication}:` : '',
            book.publishers.map(publisher => `<a href="/verlage/${publisher.permalink}/">${publisher.name}</a>`).join(', '),
            book.yearOfPublication ? `(${book.yearOfPublication})` : ''
          ].join(' ').trim()}
        </div>

        ${book.reviews.length > 1 ? reviews(book.reviews) : ''}
      </div>
    </div>
  </div>
`;
