const fsExtra = require('fs-extra'),
      path = require('path'),
      sass = require('sass'),
      uglifyEs = require('uglify-es');

const { loadFile, writeFile } = require('../derive-common/util.js'),
      writeDirectories = require('./write-directories.js'),
      writeMedia = require('./write-media.js'),
      writePages = require('./write-pages.js');

const compileJs = async data => {
  const search = await loadFile(path.join(__dirname, 'scripts/search.js'));
  const turbolinks = await loadFile(path.join(__dirname, 'scripts/turbolinks.js'));

  const result = uglifyEs.minify({
    'search.js': search,
    'turbolinks.js': turbolinks
  });

  if(result.error) {
    console.log(result.error);
  } else {
    await writeFile(data.buildDir, 'bundle.js', result.code);
  }
};

const compileSass = data => {
  return new Promise((resolve, reject) => {
    sass.render({
      file: path.join(__dirname, 'styles/main.scss'),
      outputStyle: 'compressed',
    }, (err, result) => {
      if(err) {
        reject(err);
      } else {
        writeFile(data.buildDir, 'styles.css', result.css).then(resolve);
      }
    });
  });
};

module.exports = async (data, city) => {
  console.time('build');
  
  const urbanize = data.urbanize[city];
  
  console.time('writeDirectories');
  await writeDirectories(data, urbanize);
  console.timeEnd('writeDirectories');

  console.time('writeMedia');
  await writeMedia(data, urbanize);
  console.timeEnd('writeMedia');

  console.time('writePages');
  await Promise.all([
    compileJs(data),
    compileSass(data),
    fsExtra.copy(path.join(__dirname, 'static/'), data.buildDir),
    writePages(data, urbanize)
  ]);
  console.timeEnd('writePages');

  console.time('index');
  // await index(data); // TODO: Needs to be javascript though
  console.timeEnd('index');    
  
  console.timeEnd('build');
};