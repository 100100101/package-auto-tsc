const path = require('path')
const fs = require('fs')
module.exports = ({ packageRootDir }) => {
    const packageJsonPath = path.join(packageRootDir, 'package.json')
    const packageJson = require(packageJsonPath)
    let packageCurrentVersion = packageJson.version
    if (!packageCurrentVersion) {
        packageCurrentVersion = '1.0.0'
        packageJson.version = packageCurrentVersion
    }
    const splittedPackageCurrentVersion = packageCurrentVersion.split('.')
    const packageVersionMinorPart = splittedPackageCurrentVersion[2]
    const packageVersionMinorPartInt = parseInt(packageVersionMinorPart)
    const packageVersionMinorPartIncremented = packageVersionMinorPartInt + 1
    const newVersionArray = splittedPackageCurrentVersion.map((part, index) => {
        if (index === 2) {
            return packageVersionMinorPartIncremented
        }
        return part
    })
    const newVersionString = newVersionArray.join('.')

    const newPackageJson = JSON.parse(JSON.stringify(packageJson))
    newPackageJson.version = newVersionString
    const newPackageJsonJson = JSON.stringify(newPackageJson, null, 4)
    fs.writeFileSync(packageJsonPath, newPackageJsonJson)
    console.log(`\x1b[45mNew version is @${newVersionString}\x1b[0m\n`)
}




