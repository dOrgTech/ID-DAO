module.exports = {
  'env': {
    'es6': true,
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
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 2018
  },
  'rules': {
    'max-len': ['error', 120, 2],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }]
  },
  "plugins": [
    "@typescript-eslint"
  ]
};
