import {Client} from "pg";
import {logger} from "../logger";

export interface IScoreboardData {
    name: string;
    score: number;
}

export interface IPostgresProvider {
    getTop10Scores(): Promise<any>;
    sendDataToScoreboardTable(data: IScoreboardData): Promise<void|Error>;
}

export class PostgresProvider implements IPostgresProvider{
    private client: Client;

    constructor() {
        this.client = new Client({
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
        });
        this.client.connect();
    }

    get scoreboardTable() {
        return "scoreboard";
    }

    async getTop10Scores(): Promise<any> {
        try {
            const top10Scores = await this.client.query(`SELECT * FROM ${this.scoreboardTable} ORDER BY score DESC LIMIT 10`);
            return top10Scores.rows;
        } catch(err) {
            logger.error(err);
            throw err;
        }
    }

    async sendDataToScoreboardTable(data: IScoreboardData): Promise<void|Error> {
        try {
            await this.client.query(`INSERT INTO ${this.scoreboardTable} (name, score) VALUES ('${data.name}', '${data.score}')`);
            logger.info("Scoreboard data has been successfully sent");
        } catch(err) {
            logger.error(err);
            throw err;
        }
    }
}
