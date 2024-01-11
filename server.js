import express from 'express';

const app = express();
 const PORT = 8080;

 // body parser middleware
app.use(express.json());

 app.listen(8080 , () => {
    console.log('Port is running on :' ,PORT);
})




app.get('/', (req, res) => {
     res.send("Hello from the port 8080");
  });


