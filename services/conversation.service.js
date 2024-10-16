
import { ConversationModel, userModel } from "../models/index.js"
import mongoose from "mongoose"
import createHttpError from "http-errors"

 export const doesConversationExist = async(sender_id , receiver_id) => {
    let convos = await ConversationModel.find({
        isGroup : false,
        $and :[{  users : {$elemMatch : {$eq : sender_id}}},
            {users : {$elemMatch : {$eq : receiver_id}}},
            
        ]
    }).populate("users" , "-password")
    .populate("latestMessage")

    if(!convos) throw createHttpError.BadRequest("Oops Something Went Wrong!");

    // populate message model

    convos = await userModel.populate(convos , {
        path : "latestMessage.sender",
        select : "name email picture status"
    })

  return convos[0];
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
    try {
      return await ConversationModel.find({ users: { $elemMatch: { $eq: user_id } } })
        .populate("users", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });  // Ensure it returns the conversations ordered
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  };


// export const getUsersConversations = async (user_id) => {
//     try {
//         // Ensure the user_id is a valid ObjectId
//         if (!mongoose.Types.ObjectId.isValid(user_id)) {
//             throw createHttpError.BadRequest("Invalid User ID");
//         }

//         // Convert user_id to ObjectId
//         const userObjectId = new mongoose.Types.ObjectId(user_id);
//         console.log("User ID:", user_id);
//         console.log("Constructed Query:", { users: { $elemMatch: { $eq: userObjectId } } });

//         // Find conversations involving the user
//         let conversations = await ConversationModel.find({ users: { $elemMatch: { $eq: userObjectId } } })
//             .populate("users", "name email picture status") // Include only the specified fields
//             .populate("admin", "name email picture status")  // Include only the specified fields
//             .sort({ updatedAt: -1 });

//         return conversations;
//     } catch (err) {
//         console.error("Error in getUsersConversations:", err);
//         throw createHttpError.InternalServerError("Oops! Something Went Wrong");
//     }
// };

