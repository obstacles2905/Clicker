const COLORS = ["red", "blue", "yellow", "green"];
const BLOCKS_AMOUNT = 40;

let totalScore = 0;
let timer = 60;
let testTimer;

$(document).ready(function() {
    document.getElementById("totalScore").innerText = totalScore;
    document.getElementById("timer").innerText = timer;
    renderScoreboardTable();
});

$("div").on("click", ".field > div", function() {
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

$(".new").click(function() {
    $('.new').data('clicked', true);
    testTimer = setInterval(timerFunc, 1000);

    generateOriginalBlocks();
});

$(".pause").click(function() {
    if ($(".new").data('clicked')) {
        window.clearInterval(testTimer);
        $('.field > div').prop("disabled", true);
    }
    else {
        alert("First press the 'New Game' button");
    }
});

$(".start").click(function() {
    if ($('.new').data('clicked')) {
        testTimer = setInterval(timerFunc, 1000);
        $('.field > div').prop("disabled", false);
    }
    else {
        alert("First press the 'New Game' button");
    }
});

function generateOriginalBlocks() {
    for (let i = 0; i < BLOCKS_AMOUNT; i++) {
        generateBlock();
    }
}

function generateBlock() {
    const randColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    const posX = (Math.random() * ($(".field").width() - 30)).toFixed();
    const posY = (Math.random() * ($(".field").height() - 30)).toFixed();

    const block = document.createElement('div');
    block.className = "block";
    block.style.backgroundColor = randColor;
    block.style.position = "absolute";
    block.style.left = `${posX}px`;
    block.style.top = `${posY}px`;

    document.getElementById("field").appendChild(block);
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

function timerFunc() {
    --timer;
    document.getElementById("timer").innerText = timer;

    const minBlocksAmountToSpawn = 0;
    const maxBlocksAmountToSpawn = 5;
    if (timer % 3 === 0) {
        const spawnCoef = Math.floor(Math.random() * (maxBlocksAmountToSpawn - minBlocksAmountToSpawn + 1));
        for (let i = 0; i < spawnCoef; i++) {
            generateBlock();
        }
    }

    if (timer === 0) {
        window.clearInterval(testTimer);

        const playerName = prompt("The game is over, your score is: " + totalScore, "Player");

        sendGameStats(playerName, totalScore);

        renderScoreboardTable();

        reset();

        document.getElementById("totalScore").innerText = totalScore;
        document.getElementById("timer").innerText = timer;
        $('.block').remove();
        $('.new').data('clicked', false);
    }
}

function sendGameStats(name, score) {
    $.ajax({
        url: 'http://localhost:8083/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({name, score}),
    });
}

function renderScoreboardTable() {
    $.get('http://localhost:8083/scoreboard', function(scoreboardData) {
          const items = ['<h5>Scoreboard</h5>'];

          $.each(scoreboardData, (key, value) => {
            items.push('<ul id="score">' + `${value.name}: ${value.score}` +'</ul>');
          });
          $('<li/>', {
            'id': 'result',
            html: items.join('')
          }).appendTo('body');
    });
}

function reset() {
    totalScore = 0;
    timer = 60;
}

