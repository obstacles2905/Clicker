import express, {Express} from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import {router} from "./src/routes/clickerRouter";

import {logger} from "./src/logger";
dotenv.config();

const port = process.env.APPLICATION_PORT;

const app: Express = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", router);

app.listen(port, () => {
  console.info(`Server is running on ${port}`);
});

const sigs = ["SIGINT", "SIGTERM", "SIGQUIT"];
sigs.forEach((sig) => {
    process.on(sig, () => {
        logger.info(`${sig} called, shutdown application`);
        app.close(() => {
            process.exit(0);
        });
    });
});