import Ticket from "../../db/models/ticket.model.js";
import crypto from 'crypto';

export default class TicketService {
  constructor() {}

  createTicket = async ({ amount, purchaser}) => {
    try {
      console.log("Creando ticket con:", { amount, purchaser });
      const ticket = await Ticket.create({
        amount,
        purchaser,
      });
      return ticket;
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      throw error;
    }
  };
}
