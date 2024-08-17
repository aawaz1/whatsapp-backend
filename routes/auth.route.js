import express from 'express';
import trimRequest from  'trim-request';
import authMiddleware from '../middlewares/authMiddleware.js';
import { login, logout, refreshToken, register } from '../controller/auth.controller.js';

const router = express.Router();

router.route("/register").post(trimRequest.all ,register);
router.route("/login").post(trimRequest.all ,login);
router.route("/logout").post(trimRequest.all ,logout);
router.route("/refreshtoken").post(trimRequest.all ,refreshToken);



export default router;

