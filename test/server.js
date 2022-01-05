const express = require('express');
const Mustache = require('mustache');
const { readFileSync, readFile } = require('fs');
const morgan = require('morgan');
const yargs = require('yargs');
const hdf5 = require('jsfive');

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

function list(object) {
    const items = object.keys.map(name => {
        const item = object.get(name);
        const isGroup = typeof item.keys !== 'function';
        const path = item.name;
        const attributes = item.attrs;
        return ({
            name,
            isGroup,
            path,
            attributes
        });
    });
    return JSON.stringify(items);
}

readFile(argv.filename, (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const file = new hdf5.File(data.buffer);
    app.post('/api', (req, res) => {
        const object = file.get(req.body.key);
        if (req.body.command === 'attributes') {
            res.send(JSON.stringify(object.attrs));
        } else if (req.body.command === 'list') {
            res.send(list(object));
        } else if (req.body.command === 'name') {
            res.send(JSON.stringify(object.name));
        }
    });

    app.listen(argv.port, () => {
        console.log(`Listening on http://localhost:${argv.port}`)
    });
});

