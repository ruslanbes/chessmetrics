const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const fs = require('fs')

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/main.ts'),
  output: {
    filename: 'chessmetrics.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@ui': path.resolve(__dirname, 'ui'),
      '@engine': path.resolve(__dirname, 'ui/engine')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /\.test\.ts$/, /\.spec\.ts$/]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
        extractComments: false
      })
    ]
  },
  plugins: [
    // Plugin to copy manifest and icons
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('CopyExtensionFiles', (compilation) => {
          const distPath = path.resolve(__dirname, 'dist')
          
          // Copy manifest.json
          const manifestSrc = path.resolve(__dirname, 'manifest.json')
          const manifestDest = path.resolve(distPath, 'manifest.json')
          if (fs.existsSync(manifestSrc)) {
            fs.copyFileSync(manifestSrc, manifestDest)
            console.log('✅ Copied manifest.json')
          }
          
          // Copy icons
          const iconsSrc = path.resolve(__dirname, 'icons')
          const iconsDest = path.resolve(distPath, 'icons')
          if (fs.existsSync(iconsSrc)) {
            fs.mkdirSync(iconsDest, { recursive: true })
            const iconFiles = fs.readdirSync(iconsSrc).filter(f => f.endsWith('.png'))
            for (const iconFile of iconFiles) {
              fs.copyFileSync(
                path.resolve(iconsSrc, iconFile),
                path.resolve(iconsDest, iconFile)
              )
            }
            console.log(`✅ Copied ${iconFiles.length} icon files`)
          }
        })
      }
    }
  ],
  target: 'web'
}
