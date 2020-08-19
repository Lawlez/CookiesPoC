/**
 * BUNDLER
 *
 * Entry File für den Bundler. Validiert alle mitgegebenen CLI Parameter und
 * startet den Build Vorgang
 */
const build = require('./build') //The actual build script import
const PROJECT_PATH = '.' //REQUIRED THE ROOT OF THE PROJECT

const args = process.argv

const MODE_INDEX = args.findIndex(arg => arg === '--mode' || arg === '--m')
let MODE = 'dev'

if (MODE_INDEX < 0) {
    console.warn('build mode not found. Fallback to dev...')
} else {
    MODE = args[MODE_INDEX + 1]
}

const IGNORE_TESTS_INDEX = args.findIndex(
    arg => arg === '--ignore-tests' || arg === '--it',
)
const IGNORE_TESTS = IGNORE_TESTS_INDEX >= 0


build(PROJECT_PATH, MODE, IGNORE_TESTS)
