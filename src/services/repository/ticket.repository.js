export default class ProductRepository {
    #dao;
  
    constructor(dao) {
      this.#dao = dao;
    }

    async createTicket({amount, purchaser}){
        return await this.#dao.createTicket({amount, purchaser})
    }
}