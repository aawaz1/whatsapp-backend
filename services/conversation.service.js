
import { ConversationModel, userModel } from "../models/index.js"
import createHttpError from "http-errors"

 export const doesConversationExist = async(sender_id , receiver_id) => {
    let convos = await ConversationModel.find({
        isGroup : false,
        $and :[{  users : {$elemMatch : {$eq : sender_id}}},
            {users : {$elemMatch : {$eq : receiver_id}}},
            
        ]
    }).populate("users" , "-password")
    // .populate("latestMessage")

    if(!convos) throw createHttpError.BadRequest("Oops Something Went Wrong!");

    // populate message model

//     convos = await userModel.populate(convos , {
//         path : "latestMessage.sender",
//         select : "name email picture status"
//     })

//   return convos[0];
 }

 export const createConversation = async(data) => {
    const newConvo = await ConversationModel.create(data)
    if(!newConvo)
    throw createHttpError.BadRequest("Oops..Something Went Wrong!")

    return newConvo;
 }


 export const populateConversation = async(id , fieldToPopulate , fieldToRemove) => {

    const populateConvo = await ConversationModel.findOne({_id : id}).populate(fieldToPopulate, fieldToRemove);
    if(!populateConvo)
    throw createHttpError.BadRequest("Oops..Something Went Wrong!")

    return populateConvo;
 
 }


 export const getUsersConversations = async (user_id) => {
    let conversations;
    await ConversationModel.find({users : {$elemMatch : {$eq : user_id}} }).
    populate("users", "-password")
    .populate("admin" ,"-password")
    // .populate("latestMessage")
    .sort({updatedAt : -1})
    .then(async(results) => {
        results = await userModel.populate(results , {
            // path : "latestMessage.sender",
            select : "name email picture , status ",
        });
        conversations = results;
    }).catch((err) => {
throw createHttpError.BadRequest("Opps Something  Went Wrong")})

 }