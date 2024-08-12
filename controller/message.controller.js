import logger from "../config/logger.config.js";
import { createMessage, getConvoMessages, populateMessage, updateLatestMessage } from "../services/message.service.js";


export const sendMessage = async(req ,res ,next) => {
    const user_id = req.user.userId
    const {convo_id , files , message} = req.body;
    if(!convo_id  || !message){
        logger.error("Please Provide a  conversation id and a message in the body");
        return res.sendStatus(400);
    }

    const msgData = {
        sender : user_id,
        message, 
        conversation : convo_id,
        files : files || []
    };
    let newMessage = await createMessage(msgData);
    let populatedMessage = await populateMessage(newMessage._id);
    await updateLatestMessage(convo_id , newMessage);
    res.json(populatedMessage);
    try {

        res.send("Send Message")
        
    } catch (error) {
        console.log(error);
        next(error);
        
    }
    
}


export const getMessages = async(req ,res ,next) => {
    try {
    const convo_id = req.params.convo_id;
    if(!convo_id){
        logger.error("Please Add A Conversation Id In The Params");
        res.sendStatus(400);
    };

    const messages = await getConvoMessages(convo_id);
    res.json(messages);

       
        
    } catch (error) {
        console.log(error);
        
    }
    
}