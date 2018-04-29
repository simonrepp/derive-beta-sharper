const fs = require('fs');
const path = require('path');

const { parse, AdventureParseError, AdventureValidationError } = require('../../adventure.js');

const input = fs.readFileSync(path.join(__dirname, 'basic.ad'), 'utf-8');

describe('A basic testrun', () => {
  test('succeeds', () => {
    const document = parse(input);

    expect(document.raw()).toMatchSnapshot();
  });
});
