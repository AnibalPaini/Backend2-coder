//Clases
import CartService from "./dao/mongo/cart.service.js";
import ProductService from "./dao/mongo/product.service.js";
import UserService from "./dao/mongo/user.service.js";
import TicketService from "./dao/mongo/ticket.service.js"
import SendEmailService from "./dao/mongo/email.service.js"

//Importamos repositorios
import CartRepository from "./repository/cart.repository.js";
import UserRepository from "./repository/users.repository.js";
import ProductRepository from "./repository/product.repository.js";
import TicketRepositoryService from "./repository/ticket.repository.js";
import EmailRepository from "./repository/email.repository.js";

//creamos isnstancias de clases
const cartService = new CartService();
const productService = new ProductService();
const userService = new UserService();
const ticketService= new TicketService();
const sendEmailService= new SendEmailService();

//Creamos servicios
export const cartRepositoryService = new CartRepository(cartService);

export const userRepositoryService = new UserRepository(userService);

export const productRepositoryService = new ProductRepository(productService);

export const ticketRepositoryService = new TicketRepositoryService(ticketService);

export const sendEmailRepositoryService= new EmailRepository(sendEmailService);
