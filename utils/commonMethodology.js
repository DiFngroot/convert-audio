const fs = require('fs')
const path = require('path')

/**
 * 删除指定目录下的所有文件
 * @param {string} dirPath 目录路径
 */
exports.deleteAllFilesInDir = (dirPath) => {
  // 读取目录内容
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item); // 获取完整路径
    const stat = fs.statSync(itemPath); // 获取文件/目录信息

    if (stat.isFile()) {
      // 如果是文件，直接删除
      fs.unlinkSync(itemPath);
    } else if (stat.isDirectory()) {
      // 如果是目录，递归删除其中的文件
      deleteAllFilesInDir(itemPath);
    }
  }
}
