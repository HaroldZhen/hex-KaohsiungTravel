var copy = require('recursive-copy');

async function init() {
  await copy('src', 'build');
}

init();