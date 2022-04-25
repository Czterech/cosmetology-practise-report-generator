const basic = {
  ID: {
    prop: 'id',
    type: Number,
  },
  'time from (min)': {
    prop: 'minTime',
    type: Number,
  },
  'time to (min)': {
    prop: 'maxTime',
    type: Number,
  },
  gender: {
    prop: 'sex',
    // type: (value) => value.split(','),
    type: String,
  },
  'age from': {
    prop: 'minAge',
    type: Number,
  },
  'age to': {
    prop: 'maxAge',
    type: Number,
  },
  procedure: {
    prop: 'task',
    type: String,
  },
  diagnosis: {
    prop: 'diagnosis',
    type: String,
  },
  actions: {
    prop: 'actions',
    type: (value) => value.split(/;/g).map((v) => v.trim()),
  },
  category: {
    prop: 'category',
    type: String,
  },
};

const opinions = {
  category: {
    prop: 'category',
    type: String,
  },
  comments: {
    prop: 'opinion',
    type: String,
  },
};

module.exports = {
  basic,
  opinions,
};
