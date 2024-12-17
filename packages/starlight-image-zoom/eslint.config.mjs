import hideoo from '@hideoo/eslint-config'

export default hideoo({
  files: ['**/*.astro/*'],
  rules: {
    'no-unused-private-class-members': 'off',
  },
})
