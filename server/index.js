import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import postRoutes from './Routes/posts.js';
import userRoutes from './Routes/users.js';

const app=express();
dotenv.config();

app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());

app.use('/posts',postRoutes);
app.use('/user',userRoutes);

//const CONNECTION_URL='mongodb+srv://EltonFernandes:Elton825@cluster0.clvyzqr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const PORT=process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL)       //Second params is not needed but to avoid warnings used
 .then(()=>{app.listen(PORT,()=>console.log(`Server started on PORT ${PORT}`))})
 .catch((error)=>console.log(error.message));  


    
