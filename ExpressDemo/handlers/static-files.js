const fs = require('fs');
const path = require('path');
const url = require('url');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function getContentType(url) {
    let http = new XMLHttpRequest();
    let contentType = null;
    http.open('HEAD', url);
    http.onreadystatechange = function () {
        if(this.readyState == this.DONE) {
            console.log(this.status);
            contentType = this.getResponseHeader('Content-Type');
        }
    };
    // http.send();

    return contentType;
}

module.exports = (req, res) => {
    req.pathname = req.pathname || url.parse(req.url).pathname;

    if (req.pathname.startsWith('/content/') && req.method === 'GET') {
        let filePath = path.normalize(path.join(__dirname, `..${req.pathname}`));

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, {
                    'ContentType': 'text/plain'
                });

                res.write('Resource not found!');
                res.end();
                return;
            }

            res.writeHead(200, {
                'ContentType': getContentType(req.pathname)
            })
    
            res.write(data);
            res.end();
        });
    } else {
        return true;
    }
}