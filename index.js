import app from './app.js'
import logger from './config/logger.config.js';




// env variables
const PORT = process.env.PORT || 8000;

app.listen(PORT , (req,res) => {
   logger.info(`port is running on ${process.env.PORT}`);
})



 


