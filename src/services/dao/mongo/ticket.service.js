import Ticket from "../../db/models/ticket.model.js";
import crypto from 'crypto';

export default class TicketService {
  constructor() {}

  createTicket = async (ticketData) => {
    try {
      const ticket = await Ticket.create(ticketData);
      return ticket;
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      throw error;
    }
  };
  getTicketByCode = async (code) => {
    try {
      const ticket = await Ticket.findOne({ code }).lean();
      return ticket;
    } catch (error) {
      console.error("Error al buscar el ticket por código:", error);
      throw error;
    }
  };
}
