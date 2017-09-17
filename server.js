const http = require('http');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
var results = require('./public/json/results.json');

console.log(results);
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
const server = http.createServer();

server.on('request', (request, response) => {
  const {method, url, headers} = request;
  console.log(`${method} ${url}`);

  if (method === 'POST') {
  	let postData = '';
    request.on('data', data => {
      postData = postData + data;
    });

    request.on('end', () => {
      processPost(request, response, postData);
    });
  } else {
    processGet(request, response);
  }
});


function processPost(request, response, postData) {
  
  let data = {};
  data = JSON.parse(postData);
  try {
    let total = addData(results, data);
    let sorted_arr = arrSort(total);
    fs.writeFile('./public/json/results.json', JSON.stringify(sorted_arr));
    
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
function arrSort(total) {
    let paired = _.pairs(total); //трансформирую json в массив для дальнейшей сортировки
    let sorted = paired.sort(function(a, b){return b[1] - a[1]}); //сортирую массив
    let objected = _.object(sorted); //преобразовываю отсортированный массив обратно в объект
    if (sorted.length > 10) { //удаление элементов в случае если их больше десяти
        do {
            sorted.pop();
            console.log("sorted length in do while: ", sorted.length);
        }
        while(sorted.length > 10);
    }
    return sorted;

} //функция сортировки таблицы рекордов
function processGet (request, response) {
  const {method, url, headers} = request;	

  if (url === '/results') {
  	
  }  

  let filePath = url;
  if (filePath === '/') {
  	filePath = '/index.html';
  }

  let fileExt = path.extname(filePath);
  
  let responseParams = types[fileExt] || types.default;

  response.setHeader("Content-Type", responseParams.contentType);

  filePath = './public' + filePath;
  let readStream = fs.createReadStream(filePath);

  readStream.on('error', err => {
    response.statusCode = 404;
    response.end();
  });

  readStream.pipe(response);
}

server.listen(8080);