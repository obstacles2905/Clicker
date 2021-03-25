const express = require("express");
const bodyParser = require('body-parser');
const router = require('./src/routes/gameRouter');
// require("dotenv").config({path: ".env"});

const port = 8082;

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", router);

app.listen(port, () => {
    console.log("////////////a", process.env.APPLICATION_PORT);
  console.info(`Server is running on ${port}`);
});

const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
sigs.forEach((sig) => {
    process.on(sig, () => {
        console.info(`${sig} called, shutdown application`)
        app.close(() => {
            process.exit(0);
        });
    });
});

process.on("error", () => {
    process.exit(0);
});
