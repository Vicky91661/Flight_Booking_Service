const express= require('express');

const v1Routers=require('./v1');

const router = express.Router();


router.use('/v1',v1Routers);

module.exports=router;