/**
 * BUILD
 *
 * Lädt alle Konfigurationsfiles und stellt die dementsprechende Konfiguration zusammen.
 * Diese wird anschliessend an webpack weitergegeben
 */
const fs = require('fs')
const { spawn } = require('child_process')

const loadFile = (path, optional = false) => {
    console.log(`Loading ${path}...`)
    let data = {}

    try {
        data = JSON.parse(fs.readFileSync(path, {
            encoding: 'utf-8',
        }))
    } catch (err) {
        if (!optional) {
            console.error(`${path} not found or invalid json! Its required.`)
            process.exit(1)
        }
    }

    return data
}

const test = () => {
    console.info('Running Testing....')

    return new Promise((resolve, reject) => {
        //make sure we test everything here not just core once we merged this PR
        // eslint-disable-next-line quotes
        const bat = spawn('yarn test', {
            shell: true,
        })
        bat.stdout.on('data', data => {
            console.log(data.toString())
        })
        bat.stderr.on('data', data => {
            console.error(data.toString())
        })
        bat.on('exit', code => {
            console.log(`Child exited with code ${code}`)

            if (code === 0) {
                resolve()

                return
            }
            reject()
        })
    })
}

const build = async (projectPath, mode = 'dev', ignoreTests = false) => {
    console.time('Building Took')
    //project specific config, this will be overwritten by developer config
    const PROJECT_CONFIG = loadFile(
        `${projectPath}/configs/project.config.json`,
    )
    //developer config will not be overwritten by anything
    const DEVELOPER_CONFIG = loadFile(
        `${projectPath}/configs/developer.config.json`,
        mode === 'build',
    )
    //Loading package.json needed for version
    const PROJECT_PACKAGE_CONFIG = loadFile(`${projectPath}/package.json`)
    //loading the corresponding default env config
    const ENV_CONFIG = loadFile(`${__dirname}/env/process.env.${mode}.json`)
    //if it exists replace it with project specific env config
    const ENV_PROJECT_CONFIG = loadFile(
        `${projectPath}/configs/process.env.json`,
        true,
    )
    let projectConfig = {
        ...PROJECT_CONFIG.APP_CONFIG,
    }

    const webpackConfig = {
        ...DEVELOPER_CONFIG.WEBPACK,
        DEBUG: DEVELOPER_CONFIG.DEBUG,
        APP_NAME: PROJECT_PACKAGE_CONFIG.name,
        APP_VERSION: PROJECT_PACKAGE_CONFIG.version,
        PROJECT_PATH: projectPath,
    }

    //replace ENV_CONFIG with ENV_PROJECT_CONFIG if availible
    const envConfig = {
        ...ENV_CONFIG,
        ...ENV_PROJECT_CONFIG,
        DEBUG: DEVELOPER_CONFIG.DEBUG,
    }

    // WICHTIG: Im build Fall darf die DEVELOPER_CONFIG nicht zur projectConfig dazugeschleust werden
    if (mode !== 'build') {
        projectConfig = {
            ...projectConfig,
            ...DEVELOPER_CONFIG.APP_CONFIG,
        }
        console.info('\u001b[1;33m overwriting with developer.config.json..')
    }
    console.info('\u001b[1;36m\u001b[40m USING API CONFIG: \x1b[0m\u001b[40m')
    console.table(projectConfig.API.value)

    console.info('\n', {
        webpackConfig,
    }, '\x1b[0m\n')

    if (mode === 'build' && !ignoreTests) {
        try {
            await test()
        } catch (err) {
            console.error(
                '\u001b[31;1m Tests Failed. Aborting build. If you want to skip testing you can add --it as argument.',
            )
            process.exit(1)
        }
    }

    console.info('\u001b[32;1mrunning webpack...\n')
    const bat = spawn(
        mode === 'build' ? 'webpack' : 'webpack-dev-server',
        [
            mode === 'dev' ? '-d' : '-p',
            `--config ${__dirname}/webpack/index.js`,
            `--env.WEBPACK_CONFIG ${encodeURIComponent(
                JSON.stringify(webpackConfig),
            )}`,
            `--env.PROJECT_CONFIG ${encodeURIComponent(
                JSON.stringify(projectConfig),
            )}`,
            `--env.PROJECT_PATH ${projectPath}`,
            `--env.ENV_CONFIG ${encodeURIComponent(JSON.stringify(envConfig))}`,
            `--env.BUILD_MODE ${mode}`,
        ],
        {
            shell: true,
        },
    )

    bat.stdout.on('data', data => {
        console.log(data.toString())
    })
    bat.stderr.on('data', data => {
        console.error(data.toString())
    })
    bat.on('exit', code => {
        console.log(`Child exited with code ${code}`)
        console.timeEnd('Building Took')
        process.exit(code)
    })
}

module.exports = build
