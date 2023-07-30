const axios=require('axios');
const {BookingRepository}=require('../repositories');
const{ServerConfig}=require('../config');
const AppError = require('../utils/errors/app-error');
const db =require('../models');
const status = require('http-status');
const bookingRepository = new BookingRepository();
const { Enums } = require('../utils/common');
const { BOOKED, CANCELLED, INITIATED, PENDING } = Enums.BOOKING_STATUS;

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
        const booking=await bookingRepository.create(newData,transaction)
        
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


async function makePayment(data)
{
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
        //console.log(bookingDetails);
        if(bookingDetails.status==CANCELLED)
        {
            throw new AppError('The booking has been experied', status.BAD_REQUEST);
        }
        if (bookingDetails.status == CANCELLED) {
            throw new AppError('The booking has been experied', status.BAD_REQUEST);
        }
        if (bookingDetails.status == BOOKED) {
            throw new AppError('The booking has been already booked', status.BAD_REQUEST);
        }

        const bookingTime = new Date(bookingDetails.createdAt);
        console.log("bookingTime",bookingTime.getTime());

        const currentTime = new Date();
        console.log("paymentTime", currentTime.getTime());

        console.log("time difference is ", currentTime -bookingTime);


        if(currentTime-bookingTime>300000)
        {
            await cancelBooking(data.bookingId);
            throw new AppError('The booking has been experied', status.BAD_REQUEST);
            
        }

        if(bookingDetails.totalCost!=data.totalCost)
        {
            throw new AppError('The Amount of payment doesnt match', status.BAD_REQUEST);
        }
        if (bookingDetails.userId != data.userId) {
            throw new AppError('The user doesnt match', status.BAD_REQUEST);
        }

        //we Assume here payment is successfull


        await bookingRepository.update(data.bookingId,{status:BOOKED},transaction);
        await transaction.commit();
    } 
    catch (error) {
        await transaction.rollback();
        return error;
    }
}

async function cancelBooking(bookingId)
{
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await BookingRepository.get(bookingId, transaction);
        if (bookingDetails.status == CANCELLED) {
            await transaction.commit();
            return true;
        }
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
            seats: data.noOfSeats,
            dec: 0
        });
        await bookingRepository.update(bookingId, { status: CANCELLED }, transaction);
        await transaction.commit();

    } catch (error) {
        await transaction.rollback();
        return error;
    }
}
module.exports={
    createBooking,
    makePayment,
    cancelBooking

}