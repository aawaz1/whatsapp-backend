import mongoose from 'mongoose';
import app from './app.js'
import logger from './config/logger.config.js';




// env variables
const {DATABASE_URL} = process.env;
const PORT = process.env.PORT || 8000;

// exit on mongodb error
mongoose.connection.on('error', (err) => {
   logger.error(`mongodb connection error : ${err}`);
   process.exit(1);
})

// mongodb connection
mongoose.connect(DATABASE_URL).then(() => {
   logger.info("Connected to MongoDB");
});

// mongodb debug mode
if(process.env.NODE_ENV !== 'production'){
   mongoose.set('debug', true);

}


let server;

server = app.listen(PORT , () => {
   logger.info(`port is running on ${process.env.PORT}`);
   // console.log("pid" , process.pid);
   // throw new Error('Error in serveer');
})


// handle server errors

 const exitHandler  = () => {
   if(server){
      logger.info("Server Closed");
      process.exit(1);

   }else{
      process.exit(1);   
   }

 }

const unexpectedErrorHandler = (error) => {
   logger.error(error);
   exitHandler();

};

process.on("uncaughtException" , unexpectedErrorHandler);
process.on("unhandleRejection" , unexpectedErrorHandler);


// SIGTERM
process.on("SIGTERM" , () => {
   if(server){
      logger.info("Server Closed");
      process.exit(1);

   }
});


 


