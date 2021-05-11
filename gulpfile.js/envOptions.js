const srcPath = './src';
const distPath = './build';
// const nodePath = './node_modules';

const envOptions = {
  string: 'env',
  default: {
    env: 'dev',
  },
  html: {
    src: [`${srcPath}/**/*.html`],
    path: distPath,
  },
  style: {
    src: [`${srcPath}/style/scss/**/*.scss`, `${srcPath}/style/scss/**/*.sass`],
    path: `${distPath}/style/css`,
  },
  javascript: {
    src: [`${srcPath}/scripts/**/*.js`],
    concat: 'all.js',
    path: `${distPath}/scripts`,
    entries: `${srcPath}/scripts/all.js`,
  },
  vendors: {
    src: [
      // `${nodePath}/jquery/dist/**/jquery.min.js`,
      // `${nodePath}/axios/dist/**/axios.min.js`,
    ],
    concat: 'vendors.js',
    path: `${distPath}/scripts`,
  },
  img: {
    src: [`${srcPath}/images/**/*`],
    path: `${distPath}/images`,
  },
  clean: {
    src: distPath,
  },
  browserDir: distPath,
  deploySrc: `${distPath}/**/*`,
};

exports.envOptions = envOptions;