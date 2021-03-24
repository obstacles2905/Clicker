const COLORS = ["red", "blue", "yellow", "green"];
const CELLS_AMOUNT = 40;

let totalScore = 0;
let newBtn;
let timer = 60;
let testTimer;
let result;

$(document).ready(function() {
    document.getElementById("totalScore").innerText = totalScore;
    document.getElementById("timer").innerText = timer; 
    getData();
});


$("div").on("click", ".field > div", function() { //классификация очков за блок каждого цвета
    $(this).remove();
    switch ($(this).css("background-color")) {
        case "green": totalScore += 1;
            break;
        case "blue": totalScore += 2;
            break;
        case "yellow": totalScore += 3;
            break;
        case "red": totalScore += 4;
            break;
        default: break;
    }
    document.getElementById("totalScore").innerText = totalScore;
});

$(".new").click(function() { //обработка нажатия кнопки новой игры
    $('.new').data('clicked', true);
    testTimer = setInterval(timerFunc, 1000);
     
    for (let i = 0; i < CELLS_AMOUNT; i++) {
        createBlock();
    }
});

$(".pause").click(function() { //обработка нажатия кнопки паузы
    if ($(".new").data('clicked')) {
        window.clearInterval(testTimer);
        $('.field > div').prop("disabled", true);
    }
    else {
        alert("First press the 'New Game' button");
    }
});

$(".start").click(function() { //обработка нажатия кнопки продолжения игры
    if ($('.new').data('clicked')) {
        testTimer = setInterval(timerFunc, 1000);
        $('.field > div').prop("disabled", false);
    }
    else {
        alert("First press the 'New Game' button");
    }
});

function createBlock() {
    const randColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    const posX = (Math.random() * ($(".field").width() - 30)).toFixed();
    const posY = (Math.random() * ($(".field").height() - 30)).toFixed();

    newBtn = document.createElement('div');
    newBtn.className = "block";
    newBtn.style.backgroundColor = randColor;
    newBtn.style.position = "absolute";
    newBtn.style.left = `${posX}px`;
    newBtn.style.top = `${posY}px`;
    document.getElementById("field").appendChild(newBtn);
}
function addRecordToTable(name, record) {
    let newTR = document.createElement('tr');
    let newName = document.createElement('td');
    let newScore = document.createElement('td');
    newName.innerText = name;
    newScore.innerText = totalScore;
    newTR.appendChild(newName);
    newTR.appendChild(newScore);
    document.getElementById("resulttable").appendChild(newTR);
}

function timerFunc() { //функция генерации новых блоков с течением времени
    let minBlocksAmountToSpawn = 0;
    let maxBlocksAmountToSpawn = 2;

    --timer;
    document.getElementById("timer").innerText = timer;
    
    if (timer % 5 === 0) {
        let spawnCoef = Math.floor(Math.random() * (maxBlocksAmountToSpawn - minBlocksAmountToSpawn + 1));
        for (let i = 0; i < spawnCoef; i++) {
            createBlock();
        }
    }

    if (timer === 0) { //действия, происходящие после истечения времени
        window.clearInterval(testTimer);
        result = prompt("The game is over, your score is: " + totalScore, "Player");

        postData(totalScore, result);
        $.getJSON('http://localhost:8082/json/results.json', function(data){
          const items = ['<h5>Scoreboard</h5>'];

          $.each(data, function(key, val){
            items.push('<ul id="score">' + (key+1+'.') + ' ' + val +'</ul>');
          });
          $('<li/>', {
            'id': 'result',
            html: items.join('')
          }).appendTo('body');

        });

        totalScore = 0;
        timer = 60;

        document.getElementById("totalScore").innerText = totalScore;
        document.getElementById("timer").innerText = timer;
        $('.block').remove();
        $('.new').data('clicked', false);
    }
    
}
function getData() {
    $.getJSON('http://localhost:8082/json/results.json', function(data){
      const items = ['<h5>Scoreboard</h5>'];

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
    console.log(name + " " + score);
    var data = {};
    data[score] = name;
    $.ajax({
       url: 'http://localhost:8082',
       type: 'POST',
       contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            console.log(data);
        }
    });
}