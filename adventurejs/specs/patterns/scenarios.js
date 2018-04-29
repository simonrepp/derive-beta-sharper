const matcher = require('../../lib/grammar_matcher.js');
const space = require('./space.js');

// TODO: Left bounding ````` foo ```, right bounding `foo`` scenarios?

const SCENARIOS = {

  APPEND_WITH_NEWLINE_SCENARIOS: [
    {
      captures: {
        [matcher.APPEND_WITH_NEWLINE_OPERATOR_INDEX]: '|'
      },
      syntax: '|',
      variants: space('|')
    },
    {
      captures: {
        [matcher.APPEND_WITH_NEWLINE_OPERATOR_INDEX]: '|',
        [matcher.APPEND_WITH_NEWLINE_VALUE_INDEX]: 'Value'
      },
      syntax: '| Value',
      variants: space('|', 'Value')
    },
    {
      captures: {
        [matcher.APPEND_WITH_NEWLINE_OPERATOR_INDEX]: '|',
        [matcher.APPEND_WITH_NEWLINE_VALUE_INDEX]: '|'
      },
      syntax: '| |',
      variants: space('|', '|')
    }
  ],

  APPEND_WITH_SPACE_SCENARIOS: [
    {
      captures: {
        [matcher.APPEND_WITH_SPACE_OPERATOR_INDEX]: '\\'
      },
      syntax: '\\',
      variants: space('\\')
    },
    {
      captures: {
        [matcher.APPEND_WITH_SPACE_OPERATOR_INDEX]: '\\',
        [matcher.APPEND_WITH_SPACE_VALUE_INDEX]: 'Value'
      },
      syntax: '\\ Value',
      variants: space('\\', 'Value')
    },
    {
      captures: {
        [matcher.APPEND_WITH_SPACE_OPERATOR_INDEX]: '\\',
        [matcher.APPEND_WITH_SPACE_VALUE_INDEX]: '\\'
      },
      syntax: '\\ \\',
      variants: space('\\', '\\')
    }
  ],

  BLOCK_SCENARIOS: [
    {
      captures: {
        [matcher.BLOCK_DASHES_INDEX]: '--',
        [matcher.BLOCK_NAME_INDEX]: 'Name'
      },
      syntax: '-- Name',
      variants: space('--', 'Name')
    },
    {
      captures: {
        [matcher.BLOCK_DASHES_INDEX]: '--',
        [matcher.BLOCK_NAME_INDEX]: '--'
      },
      syntax: '-- --',
      variants: space('--', ' ', '--')
    },
    {
      captures: {
        [matcher.BLOCK_DASHES_INDEX]: '---',
        [matcher.BLOCK_NAME_INDEX]: 'The Name'
      },
      syntax: '--- The Name',
      variants: space('---', 'The Name')
    },
    {
      captures: {
        [matcher.BLOCK_DASHES_INDEX]: '---',
        [matcher.BLOCK_NAME_INDEX]: '---'
      },
      syntax: '--- ---',
      variants: space('---', ' ', '---')
    }
  ],

  COMMENT_SCENARIOS: [
    {
      captures: {
        [matcher.COMMENT_ANGLE_INDEX]: '>',
        [matcher.COMMENT_TEXT_INDEX]: 'Comment Text'
      },
      syntax: '> Comment Text',
      variants: space('>', 'Comment Text')
    }
  ],

  COPY_SCENARIOS: [
    {
      captures: {
        [matcher.NAME_UNESCAPED_INDEX]: 'Name',
        [matcher.TEMPLATE_INDEX]: 'Other Name'
      },
      syntax: 'Name < Other Name',
      variants: space('Name', '<', 'Other Name')
    },
    {
      captures: {
        [matcher.NAME_UNESCAPED_INDEX]: 'The Name',
        [matcher.TEMPLATE_INDEX]: 'Other Name'
      },
      syntax: 'The Name < Other Name',
      variants: space('The Name', '<', 'Other Name')
    }
  ],

  DICTIONARY_ENTRY_SCENARIOS: [
    {
      captures: {
        [matcher.NAME_UNESCAPED_INDEX]: 'Name',
        [matcher.DICTIONARY_ENTRY_EQUALS_INDEX]: '=',
        [matcher.DICTIONARY_ENTRY_VALUE_INDEX]: 'Value'
      },
      syntax: 'Name = Value',
      variants: space('Name', '=', 'Value')
    },
    {
      captures: {
        [matcher.NAME_UNESCAPED_INDEX]: 'The Name',
        [matcher.DICTIONARY_ENTRY_EQUALS_INDEX]: '=',
        [matcher.DICTIONARY_ENTRY_VALUE_INDEX]: 'The Value'
      },
      syntax: 'The Name = The Value',
      variants: space('The Name', '=', 'The Value')
    },
    {
      captures: {
        [matcher.NAME_UNESCAPED_INDEX]: 'Name',
        [matcher.DICTIONARY_ENTRY_EQUALS_INDEX]: '=',
        [matcher.DICTIONARY_ENTRY_VALUE_INDEX]: '='
      },
      syntax: 'Name = =',
      variants: space('Name', '=', ' ', '=')
    },
    {
      captures: {
        [matcher.NAME_UNESCAPED_INDEX]: 'Name',
        [matcher.DICTIONARY_ENTRY_EQUALS_INDEX]: '=',
        [matcher.DICTIONARY_ENTRY_VALUE_INDEX]: ':'
      },
      syntax: 'Name = :',
      variants: space('Name', '=', ' ', ':')
    },
    {
      captures: {
        [matcher.NAME_ESCAPED_QUOTES_INDEX]: '`',
        [matcher.NAME_ESCAPED_INDEX]: '<=:',
        [matcher.DICTIONARY_ENTRY_EQUALS_INDEX]: '=',
        [matcher.DICTIONARY_ENTRY_VALUE_INDEX]: '`<=:`'
      },
      syntax: '`<=:` = `<=:`',
      variants: space('`', '<=:', '`', '=', '`<=:`')
    },
    {
      captures: {
        [matcher.NAME_ESCAPED_QUOTES_INDEX]: '```',
        [matcher.NAME_ESCAPED_INDEX]: '<`=``:',
        [matcher.DICTIONARY_ENTRY_EQUALS_INDEX]: '=',
        [matcher.DICTIONARY_ENTRY_VALUE_INDEX]: '`<=:`'
      },
      syntax: '```<`=``:``` = `<=:`',
      variants: space('```', '<`=``:', '```', '=', '`<=:`')
    }
  ],

  EMPTY_LINE_SCENARIOS: [
    {
      captures: {
        [matcher.EMPTY_INDEX]: ''
      },
      syntax: '',
      variants: space('')
    }
  ],

  FIELD_SCENARIOS: [
    {
      captures: {
        [matcher.NAME_UNESCAPED_INDEX]: 'Name',
        [matcher.NAME_OPERATOR_INDEX]: ':',
        [matcher.FIELD_VALUE_INDEX]: 'Value'
      },
      syntax: 'Name: Value',
      variants: space('Name', ':', 'Value')
    },
    {
      captures: {
        [matcher.NAME_UNESCAPED_INDEX]: 'The Name',
        [matcher.NAME_OPERATOR_INDEX]: ':',
        [matcher.FIELD_VALUE_INDEX]: 'The Value'
      },
      syntax: 'The Name: The Value',
      variants: space('The Name', ':', 'The Value')
    },
    {
      captures: {
        [matcher.NAME_UNESCAPED_INDEX]: 'Name',
        [matcher.NAME_OPERATOR_INDEX]: ':',
        [matcher.FIELD_VALUE_INDEX]: ':'
      },
      syntax: 'Name: :',
      variants: space('Name', ':', ' ', ':')
    },
    {
      captures: {
        [matcher.NAME_ESCAPED_QUOTES_INDEX]: '`',
        [matcher.NAME_ESCAPED_INDEX]: '<=:',
        [matcher.NAME_OPERATOR_INDEX]: ':',
        [matcher.FIELD_VALUE_INDEX]: '`<=:`'
      },
      syntax: '`<=:` : `<=:`',
      variants: space('`', '<=:', '`', ':', '`<=:`')
    },
    {
      captures: {
        [matcher.NAME_ESCAPED_QUOTES_INDEX]: '```',
        [matcher.NAME_ESCAPED_INDEX]: '<`=``:',
        [matcher.NAME_OPERATOR_INDEX]: ':',
        [matcher.FIELD_VALUE_INDEX]: '`<=:`'
      },
      syntax: '```<`=``:``` : `<=:`',
      variants: space('```', '<`=``:', '```', ':', '`<=:`')
    }
  ],

  INVALID_SCENARIOS: [
    {
      syntax: 'Invalid',
      variants: space('Invalid')
    },
    {
      syntax: 'Invalid <',
      variants: space('Invalid', '<')
    },
    {
      syntax: '< Invalid',
      variants: space('<', 'Invalid')
    },
    {
      syntax: '<',
      variants: space('<')
    },
    {
      syntax: '#',
      variants: space('#')
    },
    {
      syntax: '--',
      variants: space('--')
    },
    {
      syntax: ':',
      variants: space(':')
    },
    {
      syntax: ': Invalid',
      variants: space(':', 'Invalid')
    },
    {
      syntax: '=',
      variants: space('=')
    },
    {
      syntax: '= Invalid',
      variants: space('=', 'Invalid')
    }
  ],

  LIST_ITEM_SCENARIOS: [
    {
      captures: {
        [matcher.LIST_ITEM_INDEX]: '-'
      },
      syntax: '-',
      variants: space('-')
    },
    {
      captures: {
        [matcher.LIST_ITEM_INDEX]: '-',
        [matcher.LIST_ITEM_VALUE_INDEX]: 'Item'
      },
      syntax: '- Item',
      variants: space('-', 'Item')
    },
    {
      captures: {
        [matcher.LIST_ITEM_INDEX]: '-',
        [matcher.LIST_ITEM_VALUE_INDEX]: 'The Item'
      },
      syntax: '- The Item',
      variants: space('-', 'The Item')
    },
    {
      captures: {
        [matcher.LIST_ITEM_INDEX]: '-',
        [matcher.LIST_ITEM_VALUE_INDEX]: '-'
      },
      syntax: '- -',
      variants: space('-', ' ', '-')
    }
  ],

  NAME_SCENARIOS: [
    {
      captures: {
        [matcher.NAME_UNESCAPED_INDEX]: 'Name',
        [matcher.NAME_OPERATOR_INDEX]: ':'
      },
      syntax: 'Name:',
      variants: space('Name', ':')
    },
    {
      captures: {
        [matcher.NAME_UNESCAPED_INDEX]: 'The Name',
        [matcher.NAME_OPERATOR_INDEX]: ':'
      },
      syntax: 'The Name:',
      variants: space('The Name', ':')
    },
    {
      captures: {
        [matcher.NAME_ESCAPED_QUOTES_INDEX]: '`',
        [matcher.NAME_ESCAPED_INDEX]: '<=:',
        [matcher.NAME_OPERATOR_INDEX]: ':'
      },
      syntax: '`<=:`:',
      variants: space('`', '<=:', '`', ':')
    },
    {
      captures: {
        [matcher.NAME_ESCAPED_QUOTES_INDEX]: '```',
        [matcher.NAME_ESCAPED_INDEX]: '<`=``:',
        [matcher.NAME_OPERATOR_INDEX]: ':'
      },
      syntax: '```<`=``:```:',
      variants: space('```', '<`=``:', '```', ':')
    }
  ],

  SECTION_SCENARIOS: [
    {
      captures: {
        [matcher.SECTION_HASHES_INDEX]: '#',
        [matcher.SECTION_NAME_UNESCAPED_INDEX]: 'Name'
      },
      syntax: '# Name',
      variants: space('#', 'Name')
    },
    {
      captures: {
        [matcher.SECTION_HASHES_INDEX]: '##',
        [matcher.SECTION_NAME_UNESCAPED_INDEX]: 'The Name'
      },
      syntax: '## The Name',
      variants: space('##', 'The Name')
    },
    {
      captures: {
        [matcher.SECTION_HASHES_INDEX]: '#',
        [matcher.SECTION_NAME_UNESCAPED_INDEX]: '#',
        [matcher.SECTION_TEMPLATE_INDEX]: 'Other Name'
      },
      syntax: '# # < Other Name',
      variants: space('#', ' ', '#', '<', 'Other Name')
    },
    {
      captures: {
        [matcher.SECTION_HASHES_INDEX]: '###',
        [matcher.SECTION_NAME_UNESCAPED_INDEX]: '##',
        [matcher.SECTION_TEMPLATE_INDEX]: '###'
      },
      syntax: '### ## < ###',
      variants: space('###', ' ', '##', '<', '###')
    },
    {
      captures: {
        [matcher.SECTION_HASHES_INDEX]: '#',
        [matcher.SECTION_NAME_ESCAPED_QUOTES_INDEX]: '`',
        [matcher.SECTION_NAME_ESCAPED_INDEX]: '<=:',
        [matcher.SECTION_TEMPLATE_INDEX]: '`<=:`'
      },
      syntax: '# `<=:` < `<=:`',
      variants: space('#', '`<=:`', '<', '`<=:`')
    },
    {
      captures: {
        [matcher.SECTION_HASHES_INDEX]: '#',
        [matcher.SECTION_NAME_ESCAPED_QUOTES_INDEX]: '```',
        [matcher.SECTION_NAME_ESCAPED_INDEX]: '<`=``:',
        [matcher.SECTION_TEMPLATE_INDEX]: '```<`=``:```'
      },
      syntax: '# ```<`=``:``` < ```<`=``:```',
      variants: space('#', '```<`=``:```', '<', '```<`=``:```')
    }
  ]

};

module.exports = [].concat(...Object.values(SCENARIOS));
