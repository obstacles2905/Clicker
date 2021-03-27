const {Client} = require("pg");
const logger = require("../logger");

class PostgresProvider {
    constructor() {
        this.client = new Client({
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
        });
        this.client.connect();
    }

    get scoreboardTable() {
        return "scoreboard";
    }

    async getTop10Scores() {
        try {
            const top10Scores = await this.client.query(`SELECT * FROM ${this.scoreboardTable} ORDER BY score DESC LIMIT 10`);
            return top10Scores.rows;
        } catch(err) {
            logger.error(err);
            throw err;
        }
    }

    async sendDataToScoreboardTable(data) {
        try {
            await this.client.query(`INSERT INTO ${this.scoreboardTable} (name, score) VALUES ('${data.name}', '${data.score}')`);
            logger.info("Scoreboard data has been successfully sent");
        } catch(err) {
            logger.error(err);
            throw err;
        }
    }
}

module.exports = PostgresProvider;