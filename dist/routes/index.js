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
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
const httpLogger_1 = __importDefault(require("../middlewares/httpLogger"));
const router = (0, express_1.Router)();
router.use(authentication_1.default);
router.use(httpLogger_1.default);
router.use(errorHandler_1.default);
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return userController_1.userController.login(req, res, next); }));
router.post('/signup', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return userController_1.userController.register(req, res, next); }));
router.patch('/patchUser', authorization_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return userController_1.userController.patchUser(req, res, next); }));
router.delete('/deleteUser', authorization_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return userController_1.userController.deleteUser(req, res, next); }));
exports.default = router;
