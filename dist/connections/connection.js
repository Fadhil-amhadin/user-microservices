"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const logger_1 = __importDefault(require("../helpers/logger"));
const pool = {};
class Postgres {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbUser = process.env.DB_USER || 'postgres';
            const dbPass = process.env.DB_PASS || 'postgre';
            const config = {
                application_name: 'ts-user',
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || '5433',
                database: process.env.DB_DB || 'shopping_mall_xyz_users',
                user: dbUser,
                password: dbPass,
                max: 10,
                idleTimeoutMilis: 5 * 1000
            };
            if (pool.connection === undefined)
                pool.connection = yield new pg_1.Pool(config);
        });
    }
    query(text) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultData;
            const client = yield pool.connection.connect();
            try {
                resultData = yield client.query(text);
            }
            catch (error) {
                yield client.query('ROLLBACK');
                logger_1.default.error(error);
            }
            finally {
                yield client.release();
                return resultData;
            }
        });
    }
    release() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return pool.client.release();
            }
            catch (error) {
                logger_1.default.error(error);
            }
        });
    }
}
exports.default = Postgres;
