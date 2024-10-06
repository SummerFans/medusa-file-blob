# Medusa File Blob
Blob file provider for Medusa v2


## medusa-config.js
```
const { loadEnv, defineConfig, Modules } = require('@medusajs/framework/utils')

loadEnv(process.env.NODE_ENV, process.cwd())

module.exports = defineConfig({
  ...
  modules: {
    ...
    [Modules.FILE]: {
      resolve: '@medusajs/medusa/file',
      options: {
        providers: [
          {
            resolve: "medusa-file-blob",
            id: 'blob',
            options: {
              blob_read_write_token: process.env.BLOB_READ_WRITE_TOKEN
              // add_random_suffix: {boolean}
              // cache_control_maxAge: {number}
            }
          }
        ]
      }
    }
    ...
  }
})

```