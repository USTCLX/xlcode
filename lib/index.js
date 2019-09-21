/*
 * @Author: lixiang 
 * @Date: 2019-09-18 22:06:08 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-21 19:58:14
 */
import path from 'path';
import concat from 'concat-stream';
import template from 'lodash.template';
import map from 'map-stream';
import fs from 'vinyl-fs';

function createModule(dir) {
  return new Promise((resolve, reject) => {
    fs.src(path.resolve(__dirname, '..', 'templates', '**', '*'), { dot: true })
      .pipe(renameFiles({ gitignore: '.gitignore' }))
      .pipe(templateFiles({ name: path.basename(dir) }))
      .pipe(fs.dest(dir))
      .pipe(connectFiles(resolve))
      .once('error', reject)
  })
}

function renameFiles(renames) {
  return map((file, cb) => {
    if (file.basename in renames) {
      file.basename = renames[file.basename];
    }
    cb(null, file);
  })
}

function templateFiles(data) {
  return map((file, cb) => {
    file.contents = Buffer.from(template(file.contents)(data));
    cb(null, file)
  })
}

function connectFiles(cb) {
  return concat(files => cb(files.map(file => file.path)))
}

export default createModule;