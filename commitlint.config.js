module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['backend', 'frontend', 'root', 'ci', 'docs', 'docker', 'deps'],
    ],
    'scope-empty': [1, 'never'],
  },
};
