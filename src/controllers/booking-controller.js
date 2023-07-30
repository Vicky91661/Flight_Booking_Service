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
        return res.status(status.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(status.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function makePayment(req, res) {
    try {
        const response = await BookingService.makePayment(
            {
                totalCost: req.body.totalCost,
                userId: req.body.userId,
                bookingId: req.body.bookingId
            });
        SuccessResponse.data = response;
        return res.status(status.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(status.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports = {
    createBooking,
    makePayment
}