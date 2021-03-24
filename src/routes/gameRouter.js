const express = require("express");
const app = express();

app.get("/", (req, res, next) => {
    console.log("///////////////////////");
    next();
});

app.post("/", (req, res, next) => {

});

module.exports = gameRouter;

