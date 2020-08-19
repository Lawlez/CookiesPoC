/* eslint-disable quotes */
/**
 * WEBPACK
 *
 * Webpack Entry.
 * Anhand mitgegebener Konfiguration werden die Webpack Konfigurationen ausgeführt
 */
const origWebpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CreateFileWebpack = require('create-file-webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CryptoJS = require('crypto-js/aes')
const path = require('path')
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin')
const webpack = (
    webpackConfig,
    projectConfig,
    envConfig,
    projectPath,
    mode,
) => {
    const packedMain = require(`./webpack.${mode}.js`)(webpackConfig)


// handle connecSources for CSP usage
const connectSources = []

if (mode !== 'build') {
    /** Für dev / prod "self" hinzufügen damit Hot Reloading gewährleistet
     * werden kann */
    connectSources.push("'self'")
    connectSources.push("wss://osxdev.abf.local:8081/")
}
try {
    // Hier extrahieren wir die API Hosts aus der Konfiguration die wir für
    // connect-src benötigen
    Object.entries(projectConfig.API.value).forEach(([_, content]) => {
        const url = new URL(content.host)
        connectSources.push(url.origin)
    })
} catch (e) {console.log(e)}

if (mode === 'build') {
    /** Für den build müssen wir die connect src clearen und diese später
     * manuell setzen */
    connectSources.splice(0, connectSources.length, "__APIURI__")
}
console.log('\u001b[32;1m\u001b[1mCSP connectSources:\n', connectSources, '\u001b[0m\n')


    // process.envs zusammenstellen. Mittels crypto-js wird ein APP_CONFIG_KEY generiert,
    // der uns ermöglicht unsere projekt Konfiguration verschlüssent ins window Objekt
    // zu speichern
    const envs = {
        ...envConfig,
        APP_CONFIG_KEY: CryptoJS.encrypt(
            'randomString',
            'randomString',
        ).toString(),
        APP_NAME: webpackConfig.APP_NAME,
        APP_VERSION: webpackConfig.APP_VERSION,
    }
    const encryptedProjectConfig = CryptoJS.encrypt(
        JSON.stringify(projectConfig),
        envs.APP_CONFIG_KEY,
    ).toString()
    const encryptedConfigStorage = CryptoJS.encrypt(
        'STORAGE',
        envs.APP_CONFIG_KEY,
    ).toString()

    envs.APP_CONFIG_STORAGE = encryptedConfigStorage

    const plugins = [
        new origWebpack.DefinePlugin({
        'process.env': JSON.stringify({
            ...envs,
            ERROR_FEEDBACK_ADDRESSES: {},
        }),
    }),
    new CreateFileWebpack({
        path: packedMain.output.path,
        fileName: 'config.js',
        content:
                `window['${
                encryptedConfigStorage
                }'] = '${
                encryptedProjectConfig
                }'`,
    }),
    new CspHtmlWebpackPlugin(
        {
            'default-src': "'none'",
            'img-src': ["'self'"],
            'connect-src': connectSources,
            'manifest-src': ["'self'"],
            'style-src': [
                // @todo: unsafe-inline stellt ein Sicherheitsrisiko dar und sollte in
                // Zukunft entfernt werden. Aktuell noch nicht möglich da im Timbra zum Teil
                // noch mit inline styles gearbeitet wird.
                "'unsafe-inline'",
                "'self'",
                'https://use.typekit.net/anu4fpg.css',
                'https://hello.myfonts.net/count/3b23b7',
                'https://p.typekit.net/p.css',
                'https://fonts.googleapis.com/css',
            ],
            'font-src': [
                "'self'",
                'https://use.typekit.net',
                'https://hello.myfonts.net/count/3b23b7',
                'https://fonts.gstatic.com',
            ],
        },
        {
            enabled: true,
            nonceEnabled: {
                'script-src': true,
                'style-src': false,
            },
        },
    )]

    if (mode === 'build') {
        // Shell-Script, damit die Konfiguration erstellt werden kann
        const newLine = '\\n'
        let generatorSh = '#!/bin/sh\n'
        generatorSh += 'encryptionkey=$(cat key.txt)\n'
        generatorSh += 'encryptionsto=$(cat storage.txt)\n'
        generatorSh += 'newFileName=$(head -c 10 /dev/urandom | sha256sum)\n'
        generatorSh += 'newFileName=$(echo $newFileName | cut -c 1-16)\n'
        generatorSh += 'encryptedcnf=$(cat'
        generatorSh += ' defaultApplicationConfig.json'
        generatorSh += ' | openssl enc -aes-256-cbc -md md5'
        generatorSh += ' -base64 -pass pass:"$encryptionkey" -e -A)\n'
        generatorSh += 'echo "window[\'$encryptionsto\']'
        generatorSh += ' = \'$encryptedcnf\'" > build/$newFileName.js\n'
        generatorSh += 'echo "Done encrypting!"\n'
        // eslint-disable-next-line max-len
        generatorSh += `cnf=$(cat defaultApplicationConfig.json | grep -o -E '.*"host": "(.*)"' | grep -o -E '(https://.*)')\n`
        // eslint-disable-next-line no-useless-escape
        generatorSh += "newCnf=$(echo \"${cnf//\\\"/ }\")\n"
        generatorSh += `newCnf2=\${newCnf//$'${ newLine }'/}\n`
        generatorSh += 'html=$(cat build/index.html)\n'
        generatorSh += 'echo "Putting new Host into CSP: $newCnf2 "\n'
        generatorSh += 'echo "${html//__APIURI__/$newCnf2}" > build/index.html\n'
        generatorSh += 'newHtml=$(cat build/index.html)\n'
        generatorSh += 'echo "${newHtml//config.js/$newFileName.js}" > build/index.html\n'
        generatorSh += 'echo "done!"\n\n'

        const stringifiedProjectConfig = JSON.stringify(projectConfig, null, 4)
        plugins.push(
            new CreateFileWebpack({
                path: path.resolve(packedMain.output.path, '..'),
                fileName: 'key.txt',
                content: envs.APP_CONFIG_KEY,
            }),
            new CreateFileWebpack({
                path: path.resolve(packedMain.output.path, '..'),
                fileName: 'storage.txt',
                content: envs.APP_CONFIG_STORAGE,
            }),
            new CreateFileWebpack({
                path: path.resolve(packedMain.output.path, '..'),
                fileName: 'generate.config.sh',
                content: generatorSh,
            }),
            new CreateFileWebpack({
                path: path.resolve(packedMain.output.path, '..'),
                fileName: 'defaultApplicationConfig.json',
                content: stringifiedProjectConfig,
            }),
        )
    }

    //include BUNDLE_ANALYZER if set in config
    //because of windows we have to chain it the ugly way
    if (webpackConfig && webpackConfig.DEBUG && webpackConfig.DEBUG.BUNDLE_ANALYZER) {
        plugins.push(new BundleAnalyzerPlugin())
    }

    plugins.push(
        new HtmlWebpackPlugin({
            template: `${projectPath}/public/template.html`,
        }),
    )

    return merge.strategy({
        'resolve.extensions': 'prepend',
    })(
        packedMain,
        {
            plugins,
        },
    )
}

module.exports = env => {
    const WEBPACK_CONFIG = JSON.parse(decodeURIComponent(env.WEBPACK_CONFIG))
    const PROJECT_CONFIG = JSON.parse(decodeURIComponent(env.PROJECT_CONFIG))
    const ENV_CONFIG = JSON.parse(decodeURIComponent(env.ENV_CONFIG))

    const { PROJECT_PATH } = env
    const MODE = env.BUILD_MODE

    return webpack(
        WEBPACK_CONFIG,
        PROJECT_CONFIG,
        ENV_CONFIG,
        PROJECT_PATH,
        MODE,
    )
}
