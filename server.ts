import express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import {router} from "./src/routes/clickerRouter";

import {logger} from "./src/logger";
dotenv.config();

const port = process.env.APPLICATION_PORT;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", router);

const server = app.listen(port, () => {logger.info(`Server is running on ${port}`)});

const sigs = ["SIGINT", "SIGTERM", "SIGQUIT"];
sigs.forEach((sig) => {
    process.on(sig, () => {
        logger.info(`${sig} called, shutdown application`);
        server.close(() => {
            process.exit(0);
        });
    });
});