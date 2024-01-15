import createHttpError from "http-errors";
import { User } from "../models/index.js"


export const findUser = async(userId) => {
    const user = await User.findById(userId);
    if(!user) throw createHttpError.BadRequest("Please fil all fields");
    return user;
}