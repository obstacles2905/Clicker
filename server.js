const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer();
server.on('request', (request, response) => {
    var filePath = './public' + request.url;
    var extname = path.extname(filePath);
    var contentType = 'text/html';

    switch (extname) 
            {
                case '.ico':
                    contentType = 'image/x-icon';
                    console.log(contentType);
                    break;
                case '.html':
                    contentType = 'text/html';      
                    break;
                case '.js': 
                    contentType = 'text/javascript';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
            }
    
    
    fs.readFile('./public/index.html', function(error, content) {
        if (error) {
            response.statusCode = 404;
            response.end('Page not found');
        }
        else {
            response.writeHead(200, {'Content-Type': contentType});
            response.end(content, 'utf-8');
        }
        
       
    });
});

server.listen(8080);
