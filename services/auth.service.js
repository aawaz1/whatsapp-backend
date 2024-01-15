import createHttpError from "http-errors";
import validator from "validator";
import  User  from "../models/userModel.js";
import bcrypt from 'bcrypt';

export const createUser = async (userData) => {
    const {name , email ,password,picture,status} = userData;

    // check if fields are empty

    if(!name || !email || !password  ){
        throw createHttpError.BadRequest("Please Fill All The Required Details")

    }

    // check name length
    if(!validator.isLength(name , {
        min :2,
        max : 18
    })){
        throw createHttpError.BadRequest("Please make sure your name is between 2 to 18 characters")

    }

    // check status length
    if(status && status.length > 64){
          throw createHttpError.BadRequest("Please Make Sure Your Status is Less than 64 Characters");
         };

    // check if email address is valid
    if(!validator.isEmail(email)){
        throw createHttpError.BadRequest("Please make sure to provide a valid email address");
    }

    // check if user already exists
    const checkDb = await User.findOne({email});
    if(checkDb){
        throw createHttpError.BadRequest("Please try again with email since it already exists");
    }

    // check password length
    if(!validator.isLength(password , {
        min :6,
        max : 128,
    })){
        throw createHttpError.BadRequest("Please make sure your password is between 6 to 128 characters")};


        // hash password--> to be done in the user model




        const user = await new User({
            name,
            email,
            password,
            picture,
            status,
        }).save();

        return user;
};

export const signUser = async(email ,password) => {
    const user = await User.findOne({email : email.toLowerCase()}).lean();

    // check if user exists
    if(!user) throw createHttpError.NotFound("Invalid credentials");

     // compare passwords

     let passwordMatches = await bcrypt.compare(password,user.password );

     if(!passwordMatches) throw createHttpError.NotFound("Invalid credentials");

     return user;
    }

   