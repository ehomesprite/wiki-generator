/**
 * created by zhangzihao on 2018/9/25
 */
const path = require('path');

const utils = {
  dir(...paths) {
    return path.join(__dirname, '../../', ...paths);
  },
};

module.exports.dir = utils.dir;
