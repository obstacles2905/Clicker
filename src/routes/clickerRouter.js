const express = require("express");
const router = express.Router();
const PostgresProvider = require("../database/postgresProvider");

router.get("/", (request, response) => {
    let clickerFilePath = "./public/index.html";

    const readStream = fs.createReadStream(clickerFilePath);

    readStream.on("error", () => {
        response.statusCode = 404;
        response.end();
    });

    readStream.pipe(response);
});

router.get("/scoreboard", async (request, response) => {
    console.info("Handling /scoreboard endpoint");
    const postgresProvider = new PostgresProvider();
    const top10Scores = await postgresProvider.getTop10Scores();

    return response.send(top10Scores);
});

router.post("/", async (request) => {
    const postgresProvider = new PostgresProvider();
    await postgresProvider.sendDataToScoreboardTable(request.body);
});

module.exports = router;