const fs = require('fs');
const path = require('path');

const { parse } = require('../../adventure.js');

const input = fs.readFileSync(path.join(__dirname, 'essence.ad'), 'utf-8');

describe('The essence testrun', () => {
  test('succeeds', () => {
    const document = parse(input);
    expect(document.raw()).toMatchSnapshot();
  });
});
