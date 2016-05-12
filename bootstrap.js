// Set the `src` folder as a root path.
require('app-module-path').addPath(__dirname + '/src');

// Use Babel
require('babel-register')({
  presets: ['es2015']
})
