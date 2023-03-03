const fs = require('fs')
const { execFileSync } = require('node:child_process')
const autoIncrementVersion = require('./autoIncrementVersion')
module.exports = ({
    tsconfigOutDirAbs,
    packageRootDir,
    pathToTsConfig,
    isAutoIncrementVersion,
}) => {
    return () => {
        fs.rmSync(tsconfigOutDirAbs, { recursive: true, force: true })
        const pathToTsc = require.resolve('typescript/bin/tsc', {
            paths: [packageRootDir],
        })
        execFileSync(process.execPath, [pathToTsc, '--build', pathToTsConfig], {
            cwd: packageRootDir,
        })
        console.log(`\x1b[46m\nuse-package-builder:\x1b[0m`)
        console.log(
            `\x1b[45mPackage has been rebuilt: \n\n${packageRootDir}\x1b[0m\n`
        )
        if (isAutoIncrementVersion) {
            autoIncrementVersion({ packageRootDir })
        }
    }
}
