export default class ProductRepository {
    #dao;
  
    constructor(dao) {
      this.#dao = dao;
    }

    async createTicket(ticketData){
        return await this.#dao.createTicket(ticketData)
    }

    async getTicketByCode(code){
      return await this.#dao.getTicketByCode(code)
    }
}