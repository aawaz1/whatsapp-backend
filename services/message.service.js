import createHttpError from "http-errors";
import validator from "validator";
import { ConversationModel, MessageModel } from "../models/index.js"
import bcrypt from 'bcrypt';

export const createMessage = async(data) => {
    let newMessage = await MessageModel.create(data);
    if(!newMessage)
        throw createHttpError.BadRequest("Oops Something Went Wrong");
        return newMessage;

    
   

}

export const populateMessage = async(id) => {
    let msg = await MessageModel.findById(id).populate({
        path : "sender",
        select : "name picture",
        model : "userModel",
    }).populate({
        path : "conversation",
        select : "name isGroup users",
        model : "ConversationModel",
        populate : {
            path :"users",
            select : "name email picture status",
            model : "userModel"
        }
    });
 if(!msg) throw createHttpError.BadRequest("Oops Something Went Wrong");
 return msg;
    
 

}

export const updateLatestMessage = async(convo_id , msg) => {
 const updatedConvo = await ConversationModel.findByIdAndUpdate(convo_id , {
    latestMessage : msg ,

 });

 if(!updatedConvo) throw createHttpError.BadRequest("Oops Something Went Wrong");
 return updatedConvo;

}


export const getConvoMessages = async(convo_id) => {

    try {
      const message =   await MessageModel.find({conversation : convo_id})
      .populate("sender",
    "name picture email status").populate("conversation")

    if(!message){
        throw createHttpError.BadRequest("Oops Something Went Wrong");
    }

    return message;
        
    } catch (error) {
        console.log(error)
        
    }
}