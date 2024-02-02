const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

// const hello = 'Hello James';
// console.log(hello);
// let text = '';
// fs.readFile('./txt/input.txt', 'utf-8', (err, data) => {
//     text = data;
//     console.log(data);
//     const jamesText = 'Hello James this is sample text';
//     fs.writeFile('./txt/output.txt', jamesText + '\n' + text, (err, data) => {
//         console.log('wrote file');
//     });
// });


// fs.readFile('./txt/output.txt', 'utf-8', (Err, data) => console.log(data));


// const cachedData = '';
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const bufferedData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const parsedData = JSON.parse(bufferedData);


const server = http.createServer((request, response) => {
    console.log('Hello James', request.url, url.parse(request.url, true));
    const { query, pathname: urlPath } = url.parse(request.url, true);
    if (urlPath === '/overview') {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        const cardsHTMLElement = parsedData.map(el =>
            replaceTemplate(templateCard, el)
        ).join('');
        const output = templateOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHTMLElement);
        response.end(output);
    } else if (urlPath === '/product') {
        const id = query.id;
        const currProduct = parsedData[id];
        const output = replaceTemplate(templateProduct, currProduct);
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        const cardsHTMLElement = parsedData.map(el =>
            replaceTemplate(templateCard, el)
        ).join('');
        response.end(output);
    } else if (urlPath === '/api') {
        response.writeHead(200, {
            'Content-Type': 'application/json'
        })
        response.end(bufferedData);
    } else {
        response.writeHead(404, {
            "Content-Type": 'text/html'
        });
        response.end('<h1>Page not found</h1>')
    }
});

server.listen(3000, '127.0.0.1', () => console.log('started server'));