const path = require('node:path')
const fs = require('fs')
const checkIsNeedRebuildLevel2 = require('./checkIsNeedRebuildLevel2')
const useRebuildPackage = require('./useRebuildPackage')
const { DEFAULT_REBUILD_DIFF_TIME_MS } = require('./constants')
const tsconfigFileName = 'tsconfig.json'
const defaultOptions = {
    rebuildDiffTimeMs: DEFAULT_REBUILD_DIFF_TIME_MS,
    isAutoIncrementVersion: false,
}
module.exports = (packageRootDir, options = {}) => {
    const mergedOptions = Object.assign({}, defaultOptions, options)
    const { rebuildDiffTimeMs, isAutoIncrementVersion } = mergedOptions

    let pathToTsConfig = path.join(packageRootDir, tsconfigFileName)
    const pathToTypescript = require.resolve('typescript', {
        paths: [packageRootDir],
    })
    if (!pathToTypescript) throw new Error('typescript module is not found')
    const ts = require(pathToTypescript)
    const tsSysReadFile = ts.sys.readFile
    const readConfigFileResult = ts.readConfigFile(
        pathToTsConfig,
        tsSysReadFile
    )
    let tsconfig = readConfigFileResult.config
    const readConfigFileResultError = readConfigFileResult.error
    if (readConfigFileResultError) {
        tsconfig = null
        pathToTsConfig = path.join(process.cwd(), tsconfigFileName)
        const readConfigFileResult = ts.readConfigFile(
            pathToTsConfig,
            tsSysReadFile
        )
        if (!readConfigFileResult.error) {
            tsconfig = readConfigFileResult.config
        }
    }
    if (!tsconfig) throw new Error('tsconfig is not found')
    let tsconfigOutDir = tsconfig.compilerOptions.outDir
    if (!tsconfigOutDir) {
        // throw new Error('outDir is not defined')
        tsconfigOutDir = './dist'
    }
    const tsconfigOutDirAbs = path.join(packageRootDir, tsconfigOutDir)
    const isOutDirExists = fs.existsSync(tsconfigOutDirAbs)

    const rebuildPackage = useRebuildPackage({
        tsconfigOutDirAbs,
        packageRootDir,
        pathToTsConfig,
        isAutoIncrementVersion,
    })
    if (!isOutDirExists) {
        rebuildPackage()
    } else {
        const tsConfigRootDir = tsconfig.config.compilerOptions.rootDir
        if (!tsConfigRootDir) throw new Error('rootDir is not defined')
        const tsConfigRootDirAbs = path.join(packageRootDir, tsConfigRootDir)
        checkIsNeedRebuildLevel2({
            rebuildPackage,
            tsconfigOutDirAbs,
            tsConfigRootDirAbs,
            rebuildDiffTimeMs,
        })
    }
    const transpiledModule = require(tsconfigOutDirAbs)
    return transpiledModule
}
