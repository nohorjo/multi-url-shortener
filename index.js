const express = require('express');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const static = path.join(__dirname, 'static');

app.use(express.urlencoded({extended: true}));
app.use(express.static(static));

app.get(['/', ''], (req, res) => res.redirect('/index.html'));

app.post('/new', async (req, res) => {
    const urls = [].concat(req.body.urls);
    let randID, file;
    do {
        randID = Math.random().toString(36).substr(2, 10);
        file = `${path.join(static, randID)}.html`;
    } while (await fs.pathExists(file));
    await fs.outputFile(file, `
        ${urls.map(url => `<a href=${url}>${url}</a>`).join('<br/>')}
        <input type="button" onclick="openAll()" value="Open links" />
        <script>
            function openAll() {
                ${urls.map(url => `open("${url}", "_blank")`)}
                close();
            }
        </script>
    `);
    res.send(`<a href="/${randID}.html">${req.protocol}://${req.get('host')}/${randID}.html</a>`);
});

app.listen(process.env.PORT, () => console.log('Server listening'));
