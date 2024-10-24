import express from "express";
import dotenv from 'dotenv';
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from 'cors';
import createHttpError from 'http-errors';
import routes from './routes/index.js'


const app = express();

// config
dotenv.config();

// morgan
if(process.env.NODE_ENV !== "production"){
    app.use(morgan("dev"));

}


// helmet
app.use(helmet());

// parse json request url
app.use(express.json());

// parse json request url encoded
app.use(express.urlencoded({extended : true}));

// sanitize request data
app.use(mongoSanitize());

// enable cookie parser
app.use(cookieParser());

// gzip compression
app.use(compression());

// file upload
app.use(fileUpload({useTempFiles : true}));

// cors
    app.use(cors({
        origin: ["http://localhost:3001", "https://whatsapp-frontend-umber-mu.vercel.app"],
      }));

// v1 routes

app.use("/api/v1", routes);




app.use(async(req,res,next) => {
    next(createHttpError.NotFound("This route does not exist"));
})


// error handler

// app.use(async(err,req,res, next) => {
//     res.status(err.status || 500);
//     res.send({error : {
//         status  : err.status || 500,
//     message : err.message ,
//  }})
//     next();

// });

app.use(async (err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
    // Do not call next() here, as it might lead to unintended consequences.
});








export default app;
