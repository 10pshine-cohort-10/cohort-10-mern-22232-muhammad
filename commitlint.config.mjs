/** Enforces Conventional Commits, e.g. `feat(notes): add soft delete`. */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'server',
        'client',
        'auth',
        'notes',
        'tags',
        'editor',
        'profile',
        'ci',
        'deps',
        'docs',
        'readme',
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 100],
  },
};
