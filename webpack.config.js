const path = require('path');

module.exports = {
    entry: './tools/example-init.js',
    output: {
        filename: 'init.js',
        path: path.resolve(__dirname, 'examples')
    },
    stats: {
        warnings: false
    }
};
