Auto typescript compile package if the last modified ts file is newer than the newest out js file, and optional auto increment version

# Use
You mast have ``tsconfig.json`` with 
``compilerOptions.rootDir`` - with index.ts

and

``compilerOptions.outDir``

In ``your-package-root-dir/index.js``
```
const usePackageBuilder = require('package-auto-tsc')
module.exports = usePackageBuilder(__dirname[, options])
```
# Options
``rebuildDiffTimeMs`` - default ``4`` seconds
``isAutoIncrementVersion`` - default ``true``

