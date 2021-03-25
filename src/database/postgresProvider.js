const {Client} = require("pg");

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
        const scoreboardData = await this.getScoreboardData();
        return scoreboardData
            .sort((a, b) => b.score - a.score)
            .slice(0, 9);
    };

    async getScoreboardData() {
        try {
            const scoreboardData = await this.client.query(`SELECT * FROM ${this.scoreboardTable}`);
            return scoreboardData.rows;
        } catch(err) {
            throw err;
        }
    }

    async sendDataToScoreboardTable(data) {
        try {
            await this.client.query(`INSERT INTO ${this.scoreboardTable} (name, score) VALUES ('${data.name}', '${data.score}')`);
            console.log("Scoreboard data has been successfully sent");
        } catch(err) {
            throw err;
        }
    }
}

module.exports = PostgresProvider;