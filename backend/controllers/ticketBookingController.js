import AppError from "../utils/appError.js";
import Ticket from "../models/ticketModel.js";
import Station from "../models/stationModel.js";
import catchAsync from "../utils/catchAsync.js";
import { io } from "../server.js"
import TicketHistory from "../models/ticketHistoryModel.js";

const getTickets = catchAsync(async (req, res, next) => {
    const departure_city = req.query.departure_city;
    const arrival_city = req.query.arrival_city;
    const date = req.query.date;
<<<<<<< HEAD
    const tickets = await Ticket.find({ departure_city: departure_city, arrival_city: arrival_city, truncatedDate: date});
    console.log("tickets: ", tickets);
    const starting_depots = await Station.findOne({location: departure_city});
=======
    const tickets = await Ticket.find({ departure_city: departure_city, arrival_city: arrival_city, truncatedDate: date });
    const starting_depots = await Station.findOne({ location: arrival_city });
>>>>>>> d77585d4e9fe5e62aacbb97cea7b55b005749683
    res.status(200).json({
        status: "success",
        tickets: tickets,
        starting_depots: starting_depots
    })
})

const bookTicket = catchAsync(async (req, res, next) => {
    const ticket = await Ticket.findById(req.body.ticket_id);
    ticket.booked_seats = [...ticket.booked_seats, ...req.body.chosen_seats];
    await ticket.save();
    // console.log(req.body)
    const newBooking = await TicketHistory.create({
        ...req.body,
        "time_start": ticket.departure_time,
        "date_start": ticket.date,
        "stage": "Đang xử lí"
    })
    io.emit("book-ticket", newBooking);
    res.status(200).json({
        status: "success",
    })
})


export default { getTickets, bookTicket };
