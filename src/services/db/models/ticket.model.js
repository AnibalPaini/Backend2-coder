import mongoose from "mongoose";
import crypto from 'crypto';


const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    default:() => crypto.randomUUID(),
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now, 
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: { type: String }
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
