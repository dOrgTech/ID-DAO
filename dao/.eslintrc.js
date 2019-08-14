module.exports = {
  'env': {
    'es6': true,
    'node': true,
    "browser": true,
    "node": true,
    "mocha": true,
  },
  'extends': [
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'rules': {
  },
};
