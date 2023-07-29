const status = require('http-status');
const {BookingService}=require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
async function createBooking(req,res)
{
    try {
        const response=await BookingService.createBooking(
            {
                flightId:req.body.flightId,
                userId:req.body.userId,
                noOfSeats:req.body.noOfSeats
            });
        SuccessResponse.data = response;
        return res.status(status.CREATED).json(SuccessResponse);
    } catch (error) {
        console.log(error.code);
        if (error.code == 'ECONNREFUSED') {
    
            throw new AppError('Server is down', status.BAD_REQUEST);
        }
        ErrorResponse.message = 'something went wrong while creating airplane';
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    createBooking
}