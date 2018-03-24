const moment = require('moment');

const authors = require('./authors.js');

module.exports = program => `
  <div class="tile">
    <h1>
      <a href="/radio/${program.permalink}/">
        ${program.title}
      </a>
    </h1>
    <h2>
      <a href="/radio/${program.permalink}/">
        ${program.subtitle}
      </a>
    </h2>

    <strong>Redaktion</strong><br/>
   
    ${authors(program.editors)}

    <br/><br/>

    <strong>Erstaustrahlung</strong><br/>
   
    ${moment(program.first_broadcast).locale('de').format('Do MMMM YYYY')}
  </div>
`;