const express = require("express");
const router = express.Router();
const PostgresProvider = require("../database/postgresProvider");
const logger = require("../logger");

router.get("/", (request, response) => {
    const htmlFilePath = "./public/index.html";

    const readStream = fs.createReadStream(htmlFilePath);

    readStream.on("error", () => {
        response.statusCode = 404;
        response.end();
    });

    readStream.pipe(response);
});

router.get("/scoreboard", async (request, response) => {
    logger.info({message: "Handling GET /scoreboard endpoint"});
    const postgresProvider = new PostgresProvider();
    const top10Scores = await postgresProvider.getTop10Scores();

    return response.send(top10Scores);
});

router.post("/", async (request) => {
    const postgresProvider = new PostgresProvider();
    await postgresProvider.sendDataToScoreboardTable(request.body);
});

module.exports = router;