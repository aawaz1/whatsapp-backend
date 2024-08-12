import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types
const conversationSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true,"Conversation  Name is Required"],
        trim : true,
    },
    isGroup : {
        type : Boolean,
        required : true,
        default : false,
    },
    users : [{
        type : ObjectId,
        ref : 'userModel'
    }], 
    latestMessage : [
       { type : ObjectId,
        ref : "MessageModel",
    }
    ],
    admin :{
        type : ObjectId,
        ref :"userModel",
    }
} , {
    collection : "conversations" ,timestamps : true
})



const ConversationModel = mongoose.models.ConversationModel || mongoose.model("ConversationModel" ,conversationSchema);

export default ConversationModel