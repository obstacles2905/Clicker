const http = require('http');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const results = require('./public/json/results.json');
const port = 8082;
const express = require("express");

const app = express();
app.use(express.static('public'));


const types = {
  '.js' : {
  	contentType: 'text/javascript'
  },
  '.css' : {
  	contentType: 'text/css'
  },
  '.jpg' : {
  	contentType: 'image/jpg'
  },
  '.html': {
  	contentType: 'text/html; charset=utf8'
  },
  '.json': {
      contentType: 'application/json'
  },
  default: {
  	contentType: 'text/html'
  }
};

app.listen(port, (req, res) => {
  console.info(`Server is running on ${port}`);
});

app.get("/", (request, response) => {
    let filePath = './public/index.html';
    let fileExtension = path.extname(filePath);

    let responseParams = types[fileExtension] || types.default;
    response.setHeader("Content-Type", responseParams.contentType);

    const readStream = fs.createReadStream(filePath);

    readStream.on('error', err => {
        response.statusCode = 404;
        response.end();
    });

    readStream.pipe(response);
});

// server.on('request', (request, response) => {
//   const {method, url, headers} = request;
//   console.log(`${method} ${url}`);
//
//   if (method === 'POST') {
//   	let postData = '';
//     request.on('data', data => {
//       postData += data;
//     });
//
//     request.on('end', () => {
//       processPost(request, response, postData);
//     });
//   } else {
//     processGet(request, response);
//   }
// });


function processPost(request, response, postData) {
  let data = {};
  data = JSON.parse(postData);
  try {
    let total = addData(results, data);
    let sortedArray = arrSort(total);
    fs.writeFile('./public/json/results.json', JSON.stringify(sortedArray));
    
    response.statusCode = 201;
  } catch (e) {
    response.statusCode = 400;
  }

  console.log('POST=', data);

  response.end();
}
function addData(results, postData) {
    let total = results; //добавление нового результата в массив
    for (var key in postData) {
        total[key] = postData[key];
    }
    return total;
} //функция добавления нового результата в таблицу


function arrSort(total) { //функция сортировки таблицы рекордов
    let paired = _.pairs(total); //трансформирую json в массив для дальнейшей сортировки
    let sorted = paired.sort((a, b) => b[1] - a[1]); //сортирую массив
    let objected = _.object(sorted); //преобразовываю отсортированный массив обратно в объект
    sorted.length = 10;

    return sorted;

}

const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
sigs.forEach((sig) => {
    process.on(sig, () => {
        console.info(`${sig} called, shutdown application`)
        app.close(() => {
            process.exit(0);
        });
    });
});
