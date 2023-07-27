const express= require('express');
const {ServerConfig,logger} = require('./config');
const apiroutes=require('./routes');


const app = express();
app.use('/api',apiroutes);


app.listen(ServerConfig.PORT,()=>{
    console.log(`Sucessfully started the server at ${ServerConfig.PORT}`);
    // logger.info("sucessfully started the server",{});
});