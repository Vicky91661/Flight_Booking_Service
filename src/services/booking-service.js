const axios=require('axios');
const {BookingRepository}=require('../repositories');
const{ServerConfig}=require('../config');
const AppError = require('../utils/errors/app-error');
const db =require('../models');
const status = require('http-status');
const bookingRepository = new BookingRepository();


async function createBooking(data)
{
    const transaction=await db.sequelize.transaction();
    try{
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;
        if (data.noOfSeats > flightData.totalSeat) {
            throw new AppError('Not enough seats available ', status.BAD_REQUEST);
        }
        const totalBillingAmount = data.noOfSeats * flightData.price;
        const newData = { ...data, totalCost: totalBillingAmount };
        const booking=await bookingRepository.createBooking(newData,transaction)
        
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{
            seats:data.noOfSeats
        });

        await transaction.commit();
        return booking;
    }
    catch(error)
    {
        await transaction.rollback();
        throw error;
    }
}

module.exports={
    createBooking

}