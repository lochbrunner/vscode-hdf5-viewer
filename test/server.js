const express = require('express');
const Mustache = require('mustache');
const { readFileSync, readFile } = require('fs');
const morgan = require('morgan');
const yargs = require('yargs');

const highfive = require('../build/Release/highfive.node')

const index_html_template = readFileSync('dist/client/index.html', 'utf8');

const html = Mustache.render(index_html_template, {
    resourcePrefix: 'assets'
});


const argv = yargs
    .option('filename', { alias: 'f', default: 'test_data/sample.hdf5' })
    .option('port', { alias: 'p', default: '3000' })
    .help().alias('help', 'h')
    .argv;


const app = express();
app.use(express.json());
app.use(morgan('short'));
app.use('/assets', express.static('./dist/client'))

app.get('/', (req, res) => {
    res.send(html)
});


const file = new highfive.HighFiveHandler(argv.filename);
app.post('/api', (req, res) => {
    const name = req.body.key;
    if (req.body.command === 'list') {
        res.send(file.list(name));
    } else {
        res.send(JSON.stringify({ 'error': 'Unknown command: ' + res.body.commands }));
    }
});

app.listen(argv.port, () => {
    console.log(`Listening on http://localhost:${argv.port}`)
});

