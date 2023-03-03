const getFilesStats = require('./getFilesStats')
const { TS_EXT, JS_EXT } = require('./constants')
module.exports = ({
    rebuildPackage,
    tsconfigOutDirAbs,
    tsConfigRootDirAbs,
    rebuildDiffTimeMs,
}) => {
    const tsStats = getFilesStats({
        scanDir: tsConfigRootDirAbs,
        allowedExt: TS_EXT,
    })
    const tsStatsValues = Object.values(tsStats)
    const jsStats = getFilesStats({
        scanDir: tsconfigOutDirAbs,
        allowedExt: JS_EXT,
    })
    const jsStatsValues = Object.values(jsStats)

    const newestModifiedTsFileStatSorted = tsStatsValues.sort(
        (a, b) => b.mtimeMs - a.mtimeMs
    )
    const newestModifiedTsFileStat = newestModifiedTsFileStatSorted[0]
    const newestModifiedTsFileMs = newestModifiedTsFileStat.mtimeMs

    const newestBirthJsFileStatSorted = jsStatsValues.sort(
        (a, b) => b.birthtimeMs - a.birthtimeMs
    )
    const newestBirthJsFileStat = newestBirthJsFileStatSorted[0]
    const newestBirthJsFileMs = newestBirthJsFileStat.birthtimeMs

    const newestFilesTimeDiffMs =
        newestBirthJsFileMs + rebuildDiffTimeMs - newestModifiedTsFileMs

    if (newestFilesTimeDiffMs < 0) {
        rebuildPackage()
    }
}
