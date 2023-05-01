import AppError from "../utils/appError.js";
import Ticket from "../models/ticketModel.js";
import Station from "../models/stationModel.js";
import catchAsync from "../utils/catchAsync.js";

const getTicket = catchAsync(async(req,res,next) => {
    const departure_city  = req.query.departure_city;
    const arrival_city = req.query.arrival_city;
    const date = req.query.date;
    const tickets = await Ticket.find({ departure_city: departure_city, arrival_city: arrival_city, truncatedDate: date});
    const starting_depots = await Station.findOne({location: arrival_city});
    res.status(200).json({
        status: "success",
        tickets: tickets,
        starting_depots: starting_depots
    })
})

const bookTicket = catchAsync(async(req,res,next) => {
    const ticket = await Ticket.findById(req.body.ticket_id);
    ticket.booked_seats = [...ticket.booked_seats, ...req.body.chosen_seats];
    await ticket.save();
    res.status(200).json({
        status: "success",
    })
})


export default {getTicket, bookTicket};