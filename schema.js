export default {
  'Module': {
    name: 'String!',
    ip: 'String',
    chip: 'String',
    type: 'Type',
    group: 'Group',
  },

  'Type': {
    name: 'String!',
    label: 'String!',
    modules: '[Module]',
  },

  'Group': {
    name: 'String!',
    label: 'String!',
    modules: '[Module]',
  },

  'Event': {
    module: 'Module!',
    attribute: 'String!',
    value: 'String!',
    previous: 'String',
  },

  'Rule': {
    name: 'String!',
    operator: 'String!', // default '&&'
    conditions: '[Condition]',
    actions: '[Action]',
  },

  'Condition': {
    rule: 'Rule!',
    module: 'Module!',
    attribute: 'String!',
    operator: 'String!', // enum ['==', '!=', '>', '<', '> x <']
    value: 'String!',
  },

  'Action': {
    rule: 'Rule!',
    module: 'Module!',
    method: 'String!',
    arguments: '[String]',
  },
}
