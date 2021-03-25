const express = require("express");
const app = express();
const router = express.Router();

router.get("/", (request, response) => {
    let filePath = './public/index.html';
    let fileExtension = path.extname(filePath);

    let responseParams = types[fileExtension] || types.default;
    response.setHeader("Content-Type", responseParams.contentType);

    const readStream = fs.createReadStream(filePath);

    readStream.on('error', () => {
        response.statusCode = 404;
        response.end();
    });

    readStream.pipe(response);
});

router.post("/", (request, response) => {
    console.log("aaaaaaaaaaaaaaa", request.body);
});

module.exports = router;