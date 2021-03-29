import express from "express";
import * as fs from "fs";
import {logger} from "../logger";
import {IScoreboardData, PostgresProvider} from "../database/postgresProvider";

export const router = express.Router();

router.get("/", (request: Request, response: any) => {
    const htmlFilePath = "./public/index.html";

    const readStream = fs.createReadStream(htmlFilePath);

    readStream.on("error", () => {
        response.statusCode = 404;
        response.end();
    });

    readStream.pipe(response);
});

router.get("/scoreboard", async (request: any, response: any) => {
    logger.info({message: "Handling GET /scoreboard endpoint"});
    const postgresProvider = new PostgresProvider();
    const top10Scores = await postgresProvider.getTop10Scores();

    return response.send(top10Scores);
});

router.post("/", async (request: Request) => {
    const postgresProvider = new PostgresProvider();
    await postgresProvider.sendDataToScoreboardTable(request.body as any as IScoreboardData);
});