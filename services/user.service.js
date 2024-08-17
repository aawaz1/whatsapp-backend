import createHttpError from "http-errors";
import { userModel } from "../models/index.js"


export const findUser = async(userId) => {
    const user = await userModel.findById(userId);
    if(!user) throw createHttpError.BadRequest("Please fil all fields");
    return user;
}

export const searchUsers = async (keyword) => {
    const users = await userModel.find({
       $or : [
        {name: { $regex: keyword, $options: "i" }, },
        {email: { $regex: keyword, $options: "i" }, }
        
       ]
    })

    return users;

}