'use strict';
const {Enums}=require('../utils/common');
const { BOOKED, CANCELLED, INITIATED, PENDING } = Enums.BOOKING_STATUS;

module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {

    flightId:
    {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status:
    {
      type:DataTypes.ENUM,
      values: [BOOKED, CANCELLED, INITIATED, PENDING],
      defaultValue: INITIATED,
      allowNull: false
    },
    noOfSeats:
    {
      type:DataTypes.INTEGER,
      allowNull: false,
      defaultValue:1
    },
    totalCost: 
    {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
  }, {});
  Booking.associate = function(models) {
    // associations can be defined here
  };
  return Booking;
};