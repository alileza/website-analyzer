'use strict';

let express      = require('express');
let ejs          = require('ejs-locals-custom');
let bodyParser   = require('body-parser');
let path         = require('path');
let request      = require('request');
let cheerio      = require('cheerio')

let app          = express();

app.engine('.html', ejs);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));

let AnalyzeHTML = (html) => {
    let $ = cheerio.load(html);
    let result = "<br/>";
    
    result += `* Title of the page is <strong>${$('title').text()}</strong> <br/>`;
    
    // do another html analysis
    
    return result;
}

app.get('/', (req, res, next) => {
    return res.render("index");
});

app.post('/', (req, res, next) => {
    try {
        request.get(req.body.url)
            .on('response', (response) => {
                let str = "";
                response.on('data', function(data) {
                    str += data.toString();
                })
                response.on("end", function(){
                    let result = AnalyzeHTML(str);
                    return res.status(200).json({
                        message: result
                    });
                })
            })
            .on('error', (err) => {
                return res.status(400).json({
                    message: err.toString()
                });
            });
    } catch (e) {
        return res.status(400).json({
            message: e.toString()
        });
    }
});

app.listen(1993);
console.log("app is running on port 1993");
