"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _concatStream = _interopRequireDefault(require("concat-stream"));

var _lodash = _interopRequireDefault(require("lodash.template"));

var _mapStream = _interopRequireDefault(require("map-stream"));

var _vinylFs = _interopRequireDefault(require("vinyl-fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @Author: lixiang 
 * @Date: 2019-09-18 22:06:08 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-21 19:58:14
 */
function createModule(dir) {
  return new Promise((resolve, reject) => {
    _vinylFs.default.src(_path.default.resolve(__dirname, '..', 'templates', '**', '*'), {
      dot: true
    }).pipe(renameFiles({
      gitignore: '.gitignore'
    })).pipe(templateFiles({
      name: _path.default.basename(dir)
    })).pipe(_vinylFs.default.dest(dir)).pipe(connectFiles(resolve)).once('error', reject);
  });
}

function renameFiles(renames) {
  return (0, _mapStream.default)((file, cb) => {
    if (file.basename in renames) {
      file.basename = renames[file.basename];
    }

    cb(null, file);
  });
}

function templateFiles(data) {
  return (0, _mapStream.default)((file, cb) => {
    file.contents = Buffer.from((0, _lodash.default)(file.contents)(data));
    cb(null, file);
  });
}

function connectFiles(cb) {
  return (0, _concatStream.default)(files => cb(files.map(file => file.path)));
}

var _default = createModule;
exports.default = _default;