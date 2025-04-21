export default class EmailRepository {
    #dao;
  
    constructor(dao) {
      this.#dao = dao;
    }

    enviarMailTicket = async (ticket) => {
        return await this.#dao.enviarMailTicket(ticket);
    }
}