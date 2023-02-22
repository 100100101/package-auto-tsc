const path = require('node:path')
const fs = require('fs')
const checkIsNeedRebuildLevel2 = require('./checkIsNeedRebuildLevel2')
const useRebuildPackage = require('./useRebuildPackage')
const { DEFAULT_REBUILD_DIFF_TIME_MS } = require('./constants')
const defaultOptions = {
    rebuildDiffTimeMs: DEFAULT_REBUILD_DIFF_TIME_MS,
    isAutoIncrementVersion: true,
}
module.exports = (packageRootDir, options = {}) => {
    const mergedOptions = Object.assign({}, defaultOptions, options)
    const { rebuildDiffTimeMs, isAutoIncrementVersion } = mergedOptions

    const pathToTsConfig = path.join(packageRootDir, 'tsconfig.json')
    const pathToTypescript = require.resolve('typescript', {
        paths: [packageRootDir]
    })
    if (!pathToTypescript) throw new Error('typescript module is not found')
    const ts = require(pathToTypescript)
    const tsconfig = ts.readConfigFile(pathToTsConfig, ts.sys.readFile)
    if (!tsconfig) throw new Error('tsconfig is not found')
    const tsconfigOutDir = tsconfig.config.compilerOptions.outDir
    if (!tsconfigOutDir) throw new Error('outDir is not defined')
    const tsconfigOutDirAbs = path.join(packageRootDir, tsconfigOutDir)
    const isOutDirExists = fs.existsSync(tsconfigOutDirAbs)
    const rebuildPackage = useRebuildPackage({ tsconfigOutDirAbs, packageRootDir, pathToTsConfig, isAutoIncrementVersion })
    if (!isOutDirExists) {
        rebuildPackage()
    } else {
        const tsConfigRootDir = tsconfig.config.compilerOptions.rootDir
        if (!tsConfigRootDir) throw new Error('rootDir is not defined')
        const tsConfigRootDirAbs = path.join(packageRootDir, tsConfigRootDir)
        checkIsNeedRebuildLevel2({ rebuildPackage, tsconfigOutDirAbs, tsConfigRootDirAbs, rebuildDiffTimeMs })
    }
    const transpiledModule = require(tsconfigOutDirAbs)
    return transpiledModule
}




