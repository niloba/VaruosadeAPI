const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')

app.get('/spare-parts', (request, response) => {
    const page = request.query.page || 1;
    const name = request.query.name;
    const pageRows = 20;
    const lastRowOnPage = page * pageRows;
    const firstRowOnPage = lastRowOnPage - pageRows;

    const lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('LE.txt')
    });

    let allItems = [];

    let currentLineNum = 1;
    lineReader.on("line", function (line) {
        if (currentLineNum > firstRowOnPage && currentLineNum <= lastRowOnPage) {
            const lineArray = line.split("\t");

            const item = {
                seeria: lineArray[0].replace(/^"|"$/g, ''),
                name: lineArray[1].replace(/^"|"$/g, ''),
                hind: lineArray[10].replace(/^"|"$/g, '')
            };
            
            allItems.push(item);
        }
        currentLineNum++;
    }).on('close', function () {
        if (name !== undefined) {
            allItems = allItems.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
        }
        response.send(allItems);
    }) 
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})