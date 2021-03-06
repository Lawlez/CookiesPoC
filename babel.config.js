module.exports = {
    presets: [['@babel/preset-env', {
        targets: {
            node: 'current',
        },
    }], '@babel/preset-react'],
    plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-optional-chaining',
        ['@babel/plugin-proposal-decorators', {
            legacy: true,
        }],
        ['@babel/plugin-transform-runtime', {
            absoluteRuntime: false,
            corejs: false,
            helpers: false,
            regenerator: true,
            useESModules: true,
        }],
    ],
}
