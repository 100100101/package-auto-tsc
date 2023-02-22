Auto typescript compile package if the last modified ts file is newer than the newest out js file, and optional auto increment version

# Use
You mast have installed dependencies in your package:

``typescript``,

``@types/node``

and

``your-package-root-dir/tsconfig.json`` file with 

``compilerOptions.rootDir`` - with index.ts

and

``compilerOptions.outDir``

#

In ``your-package-root-dir/index.js`` write:
```
const usePackageBuilder = require('package-auto-tsc')
module.exports = usePackageBuilder(__dirname[, options])
```
# Options
``rebuildDiffTimeMs`` - default ``4`` seconds
``isAutoIncrementVersion`` - default ``true``

