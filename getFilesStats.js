const path = require('node:path')
const fs = require('fs')
module.exports = ({ scanDir, allowedExt }) => {
    const stats = {}
    const scanFilesInDir = dir => {
        const dirContains = fs.readdirSync(dir)
        for (const dirContainsItem of dirContains) {
            const dirContainsItemAbsolutePath = path.join(dir, dirContainsItem)
            const dirContainsItemStat = fs.statSync(dirContainsItemAbsolutePath)
            const isDirContainsItemDir = dirContainsItemStat.isDirectory()
            if (isDirContainsItemDir) {
                scanFilesInDir(dirContainsItemAbsolutePath)
                continue
            }
            const dirContainsItemExt = path.extname(dirContainsItemAbsolutePath)
            const isRequiredExt = dirContainsItemExt === `.${allowedExt}`
            if (!isRequiredExt) {
                continue
            }
            stats[dirContainsItemAbsolutePath] = dirContainsItemStat
        }
    }
    scanFilesInDir(scanDir)
    return stats
}
