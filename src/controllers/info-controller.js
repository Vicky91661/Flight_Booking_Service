//const {statusCode}=require('http-status-codes');

const info = (req,res)=>{
    return res.status(500).json({
        sucess:true,
        message:'API is live',
        error:{},
        data:{}
    });
}

module.exports={info};