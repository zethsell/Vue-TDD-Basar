module.exports = {
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\js$': 'babel-jest',
  },
}