import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    name : ({
        type : String,
        required : [ true , "Please provide a Name"],
       
    }),
    email : ({
        type : String,
        required : [ true , "Please provide an Email"],
        unique : [true , "This Email address already exits" ],
        lowercase : [true],
        validate :[validator.isEmail , "Please provide A Valid Email"],
       
    }),
    picture : ({
        type : String,
        default :"",
        
    }),
    status : ({
        type : String,
        default :"Hey There I Am Using Whatsapp",
        
      }),
      password : ({
        type : String,
        required : [true , "Please provide a Password"],
        minLength : [8 , "Please  make your password is atleast 8 characters long"],
        maxLength : [128 , "Please  make your password is less than 128 characters long"],


      })
    

} , {
    collection : "users",
    timestamps : true,
  })


  UserSchema.pre('save' , async function(next){
    try {
        if(this.isNew){
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(this.password , salt);
            this.password = hashedPassword;
        }
        next();
        
    } catch (error) {
        next(error);
        
    }
  })


 const User = mongoose.model("User" , UserSchema);


export default  User;

