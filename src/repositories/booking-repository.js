const CrudRepostory = require('./CRUD-repository');
const { Booking } = require('../models');

class BookingRepository extends CrudRepostory {
    constructor() {
        super(Booking);
    }
}

module.exports = BookingRepository;