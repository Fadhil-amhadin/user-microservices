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
exports.userController = void 0;
const connection_1 = __importDefault(require("../connections/connection"));
const bcrypt_1 = require("../helpers/bcrypt");
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
const jwt_1 = require("../helpers/jwt");
const joi_1 = __importDefault(require("joi"));
class UserController {
    constructor() {
        this.postgres = new connection_1.default();
    }
    register(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = joi_1.default.object({
                    name: joi_1.default.string().min(3).required(),
                    email: joi_1.default.string().email().min(5).required(),
                    phoneNo: joi_1.default.string().min(9).required(),
                    nationalId: joi_1.default.string().min(16).required(),
                    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{8,}$')).required()
                });
                const { error } = schema.validate(request.body);
                if (error) {
                    throw { message: error.details[0].message };
                }
                let { name, email, phoneNo, nationalId, password } = request.body;
                password = (0, bcrypt_1.hashPassword)(password);
                yield this.postgres.query(`INSERT INTO "Users" ("name", "email", "phoneNo", "nationalId", "password") VALUES ('${name}', '${email}', '${phoneNo}','${nationalId}', '${password}');`);
                response.status(200).json({
                    payload: [],
                    errors: [],
                    success: true
                });
            }
            catch (error) {
                (0, errorHandler_1.default)(error, request, response, next);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const foundUser = yield this.postgres.query(`SELECT * FROM "Users" WHERE email = '${email}';`);
                if (!foundUser.rows[0]) {
                    throw { name: 'EmailNotRegistered' };
                }
                //check password
                const foundUserData = foundUser.rows[0];
                if (!(0, bcrypt_1.comparePassword)(password, foundUserData.password)) {
                    throw { name: 'CredentialInvalid' };
                }
                const userLogin = {
                    id: foundUserData.id,
                    email: foundUserData.email
                };
                const token = (0, jwt_1.signToken)(userLogin);
                res.status(200).json({
                    payload: [
                        {
                            token: {
                                accessToken: token
                            },
                            userInfo: {
                                personalInfo: {
                                    email: foundUserData.email,
                                    phoneNo: foundUserData.phoneNo,
                                    name: foundUserData.name
                                }
                            }
                        }
                    ],
                    errors: [],
                    success: true
                });
            }
            catch (error) {
                (0, errorHandler_1.default)(error, req, res, next);
            }
        });
    }
    patchUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id, name, email, phoneNo, password } = req.body;
                let container = {};
                if (name)
                    container.name = name;
                if (email)
                    container.email = email;
                if (phoneNo)
                    container.phoneNo = phoneNo;
                if (password)
                    container.password = (0, bcrypt_1.hashPassword)(password);
                const foundUser = yield this.postgres.query(`SELECT * FROM "Users" WHERE "id" = ${id};`);
                if (!foundUser.rows[0]) {
                    throw { name: 'UserNotFound' };
                }
                !container.name ? foundUser.rows[0].name : container.name;
                !container.email ? foundUser.rows[0].email : container.email;
                !container.phoneNo ? foundUser.rows[0].phoneNo : container.phoneNo;
                !container.password ? foundUser.rows[0].password : container.password;
                let data = [
                    `"name" = '${container.name}' `,
                    `"email" = '${container.email}' `,
                    `"phoneNo" = '${container.phoneNo}' `,
                    `"password" = '${container.password}' `
                ];
                yield this.postgres.query(`UPDATE "Users" SET ${data}  WHERE "id" = '${id}';`);
                const patchUser = yield this.postgres.query(`SELECT * FROM "Users" WHERE "id" = '${id}';`);
                res.status(200).json({
                    payload: [
                        {
                            id: patchUser.rows[0].id,
                            name: patchUser.rows[0].name,
                            email: patchUser.rows[0].email,
                            phoneNo: patchUser.rows[0].phoneNo
                        }
                    ],
                    errors: [],
                    success: true
                });
            }
            catch (error) {
                (0, errorHandler_1.default)(error, req, res, next);
            }
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.body;
                yield this.postgres.query(`DELETE FROM "Users" WHERE id = ${id};`);
                res.status(200).json({
                    payload: [],
                    errors: [],
                    success: true
                });
            }
            catch (error) {
                (0, errorHandler_1.default)(error, req, res, next);
            }
        });
    }
}
exports.userController = new UserController();
