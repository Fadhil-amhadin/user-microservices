"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../helpers/logger"));
const errorHandler = (err, req, res, next) => {
    let code = 500;
    let msg = {
        payload: [],
        errors: [
            {
                code: "ERR1111",
                message: "Internal server error",
                type: "Server Error"
            }
        ]
    };
    if (err.name === "UserNotFound") {
        code = 404;
        msg.errors[0].code = "ERR1000";
        msg.errors[0].message = "User not found";
        msg.errors[0].type = "Not Found";
    }
    else if (err.name === "CredentialInvalid") {
        code = 404;
        msg.errors[0].code = "ERR1101";
        msg.errors[0].message = "Credential is Invalid";
        msg.errors[0].type = "Not Match";
    }
    else if (err.name === "EmailNotRegistered") {
        code = 404;
        msg.errors[0].code = "ERR1102";
        msg.errors[0].message = "Email Not Registered";
        msg.errors[0].type = "Not Found";
    }
    else if (err.message) {
        code = 400;
        msg.errors[0].code = "ERR1003";
        msg.errors[0].message = err.message;
        msg.errors[0].type = "Bad Input";
    }
    else if (err.name === "InvalidSignature") {
        code = 403;
        msg.errors[0].code = "ERR1004";
        msg.errors[0].message = "Signature is Invalid";
        msg.errors[0].type = "Not Match";
    }
    if (err.name !== 'TypeError') {
        logger_1.default.error(msg.errors[0].message);
    }
    else if (err.message) {
        logger_1.default.error(msg.errors[0].message);
    }
    else {
        logger_1.default.error(err);
    }
    res.status(code).json(msg);
};
exports.default = errorHandler;
