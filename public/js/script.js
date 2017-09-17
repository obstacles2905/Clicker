const COLOR_ARR = ["red", "blue", "yellow", "green"];
var total_score = 0;
var newBtn;
var timer = 60;
var testTimer;
var posXArr;
var posYArr;
var result;

$(document).ready(function() {
    document.getElementById("total_score").innerText = total_score;
    document.getElementById("timer").innerText = timer; 
    getData();
})


$("div").on("click", ".field > div", function() { //классификация очков за блок каждого цвета
    $(this).remove();
    switch ($(this).css("background-color")) {
        case "green": total_score += 1;
            break;
        case "blue": total_score += 2;
            break;
        case "yellow": total_score += 3;
            break;
        case "red": total_score += 4;
            break;
        default: break;
    }
    document.getElementById("total_score").innerText = total_score;
})

$(".new").click(function() { //обработка нажатия кнопки новой игры
    
    $('.new').data('clicked', true);
    testTimer = setInterval(timerFunc, 1000);
     
    for (var i = 0; i<40; i++) { 
        createBlock();
    }
    
})

$(".pause").click(function() { //обработка нажатия кнопки паузы
    if ($(".new").data('clicked')) {
        window.clearInterval(testTimer);
        $('.field > div').prop("disabled", true);
    }
    else {
        alert("First press the 'New Game' button");
    }
})

$(".start").click(function() { //обработка нажатия кнопки продолжения игры
    if ($('.new').data('clicked')) {
        testTimer = setInterval(timerFunc, 1000);
        $('.field > div').prop("disabled", false);
    }
    else {
        alert("First press the 'New Game' button");
    }
    
})

function createBlock() { //функция создания и отрисовки блоков
        var randColor = COLOR_ARR[Math.floor(Math.random() * COLOR_ARR.length)];
        var posX = (Math.random() * ($(".field").width() - 30)).toFixed();
        var posY = (Math.random() * ($(".field").height() - 30)).toFixed();
        newBtn = document.createElement('div');
        newBtn.className = "block";
        newBtn.style.backgroundColor = randColor;
        newBtn.style.position = "absolute";
        newBtn.style.left = posX+'px';
        newBtn.style.top = posY+'px';
        document.getElementById("field").appendChild(newBtn);
}
function addRecord(name, record) { //Функция добавления нового рекорда в таблицу
    let newTR = document.createElement('tr');
    let newName = document.createElement('td');
    let newScore = document.createElement('td');
    newName.innerText = name;
    newScore.innerText = total_score;
    newTR.appendChild(newName);
    newTR.appendChild(newScore);
    document.getElementById("resulttable").appendChild(newTR);
}

function timerFunc() { //функция генерации новых блоков с течением времени
    let minSpawn = 0;
    let maxSpawn = 2;
    --timer;
    document.getElementById("timer").innerText = timer;
    
    if (timer % 5 == 0) { //создание и добавление новых блоков каждые пять секунд
        let spawnCoef = Math.floor(Math.random() * (maxSpawn - minSpawn + 1));
        for (var i = 0; i< spawnCoef; i++) {
            createBlock();
        }
    }
    if (timer == 0) { //действия, происходящие после истечения времени
        window.clearInterval(testTimer);
        result = prompt("The game is over, your score is: "+total_score, "Player");    
        postData(total_score, result);
        $.getJSON('http://localhost:8080/json/results.json', function(data){
          var items = ['<h5>Scoreboard</h5>'];
          console.log("get data called");
          $.each(data, function(key, val){
            items.push('<ul id="score">' + (key+1+'.') + ' ' + val +'</ul>');
          });
          $('<li/>', {
            'id': 'result',
            html: items.join('')
          }).appendTo('body');

        });
        total_score = 0;
        timer = 60;
        document.getElementById("total_score").innerText = total_score;
        document.getElementById("timer").innerText = timer;
        $('.block').remove();
        $('.new').data('clicked', false);
        
    }
    
}
function getData() {
    $.getJSON('http://localhost:8080/json/results.json', function(data){
      var items = ['<h5>Scoreboard</h5>'];
      console.log("get data called");
      $.each(data, function(key, val){
        items.push('<ul id="score">' + (key+1+'.') + ' ' + val +'</ul>');
      });
      $('<li/>', {
        'id': 'result',
        html: items.join('')
      }).appendTo('body');

    });
}

function postData(name, score) {
    console.log(name + " " +score);
    var data = {};
    data[score] = name;
    $.ajax({
       url: 'http://localhost:8080',
       type: 'POST',
       contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            console.log(data);
        }
    });
}