const CrudRepostory = require('./CRUD-repository');
const { Booking } = require('../models');
const status = require('http-status');

class BookingRepository extends CrudRepostory {
    constructor() {
        super(Booking);
    }
    async createBooking(data,transaction)
    {
        const response = await Booking.create(data,{transaction:transaction});
        return response;
    }
    async get(data,transaction)
    {
        const response = await Booking.findByPk(data, { transaction: transaction });
        if (!response) {
            throw new AppError('Not able to find the resource', status.NOT_FOUND);
        }
        return response;
    }

    async update(id, data,transaction) //data->{col:value,..}  #Data is an object value
    {
        const response = await Booking.update(data, {
            where: {
                id: id
            }
        }, { transaction: transaction });
        return response;
    }
}



module.exports = BookingRepository;