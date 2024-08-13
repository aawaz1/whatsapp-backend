import createHttpError from "http-errors";
import logger from "../config/logger.config.js";
import { findUser } from "../services/user.service.js";
import { createConversation, doesConversationExist, getUsersConversations, populateConversation } from "../services/conversation.service.js";

export const create_open_conversation = async (req, res, next) => {
    try {
        const sender_id = req.user.userId; 
        const { receiver_id } = req.body;
        
        // Check if receiver id is provided
        if (!receiver_id) {
            logger.error("Please provide the user id you want to start a conversation with!");
            throw createHttpError.BadRequest("Receiver ID is required.");
        }

        // Check if chat exists
        const existed_conversation = await doesConversationExist(sender_id, receiver_id);

        if (existed_conversation) {
            res.json(existed_conversation);
        } else {
            let receiver_user = await findUser(receiver_id);

            let convoData = {
                name : receiver_user.name,
                picture : receiver_user.picture,
                isGroup : false,
                users : [sender_id , receiver_id]

            };

            const newConvo = await createConversation(convoData);
            const populateConvo = await populateConversation(newConvo._id, "users" , "-password")
            res.status(200).json(populateConvo)
        }
    } catch (error) {
        next(error);
    }
};


export const getAllConversation = async (req,res,next) => {
    try {

        const user_id = req.user.userId;
        const conversations = await getUsersConversations(user_id);
        res.status(200).json(conversations);        
    } catch (error) {
        
    }

}