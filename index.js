import app from './app.js'




// PORT
const PORT = process.env.PORT || 8000;

app.listen(PORT , (req,res) => {
   console.log('port is running on : ' , PORT);
})



 


