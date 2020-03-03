import path from 'path';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';


import handlerClientError from './middlewares/handlerClientError.js';
import handlerServerError from './middlewares/handlerServerError.js';


const app = express();
const port = 9000;


app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json());
app.use(compression());
app.use(helmet());



app.use(handlerClientError);
app.use(handlerServerError);

app.listen(port, ()=>{
  console.log(`Listening on ${port}`)
})
