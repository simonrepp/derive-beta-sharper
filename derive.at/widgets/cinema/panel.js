const moment = require('moment');

// TODO: Uses artice-panel ... etc. css classes as generic templates although this is cinema

const infoDetails = date => `
  <strong>Info</strong><br/>
  ${moment(date.date).format('D.M.YYYY')} ${date.time}

  <br/><br/>

  <strong>
    <a href="${date.link}" target="_blank">
      Tickets und Info bei filmcasino.at
    </a>
  </strong>
`;

const info = date => `
  <div class="generic__heading">
    ${date.title}
  </div>

  <div class="article-panel__info-split">

    <div class="article-panel__info-cover">
      ${date.image ? `<img src="${date.image.written}">` : ''}
    </div>

    <div class="article-panel__info-details">
      ${infoDetails(date)}
    </div>
  </div>
`;

module.exports = date => `
  <div class="article-panel">
    <div class="article-panel__info">
      ${info(date)}
    </div>

    <div class="article-panel__abstract generic__serif">
      ${date.text ? date.text.converted : ''}
    </div>
  </div>
`;
