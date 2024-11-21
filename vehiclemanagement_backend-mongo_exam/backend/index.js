

import express ,{json}from 'express';

import { addvehicle } from './Routes/addCourseRoute.js';
import cors from 'cors';
import cookieParser  from 'cookie-parser';

const app= express();

const port=8000

app.use(json())
app.use(cookieParser())
// app.use('/',adminRouter)
app.use('/',addvehicle)

app.listen(port,()=>{
    console.log(`Server listening in the port ${port}`);
    
})


