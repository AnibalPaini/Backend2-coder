// services/sendMail.js
import { transporter } from "../../../controller/email.controller.js";
import config from "../../../config/config.js";

export default class SendEmailService {
  constructor() {}

  enviarMailTicket = async (ticket) => {
    try {
      const productosHTML = ticket.productosComprados
        .map(
          (prod) =>
            `
                    <tr>
                        <td>${prod.title}</td>
                        <td>${prod.quantity}</td>
                        <td>$${prod.price}</td>
                        <td>$${prod.subtotal}</td>
                    </tr>
                `
        )
        .join("");

      let htmlContent = "";
      if (ticket.productosNoProcesados.length === 0) {
        htmlContent = `
                <div>
                  <h1>¡Compra realizada con éxito!</h1>
                  <p><strong>Ticket:</strong> ${ticket.code}</p>
                  <p><strong>Total:</strong> $${ticket.amount}</p>
                  <h2>Detalle de tu compra:</h2>
                  <table border="1" cellpadding="5" cellspacing="0">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio unitario</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${productosHTML}
                    </tbody>
                  </table>
                </div>
              `;
      } else {
        const productosNoProcesadosHTML = ticket.productosNoProcesados
          .map(
            (prodNo) =>
              `
                        <tr>
                            <td>${prodNo._id}</td>
                        </tr>
                    `
          )
          .join("");
        htmlContent = `
                <div>
                  <h1>¡Compra realizada con éxito!</h1>
                  <p><strong>Ticket:</strong> ${ticket.code}</p>
                  <p><strong>Total:</strong> $${ticket.amount}</p>
                  <h2>Detalle de tu compra:</h2>
                  <table border="1" cellpadding="5" cellspacing="0">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio unitario</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${productosHTML}
                    </tbody>
                  </table>
                </div>
                <div>
                    <h2>Productos que no pudieron ser procesados!</h2>
                    <p>Estos productos no se agregan al precio final!</p>
                    <table border="1" cellpadding="5" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio unitario</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productosNoProcesadosHTML}
                        </tbody>
                    </table>
                </div>
              `;
      }

      await transporter.sendMail({
        from: config.gmailAcc,
        to: ticket.purchaser,
        subject: "Compra realizada: " + ticket.code,
        html: htmlContent,
      });

      console.log("Mail enviado a:", ticket.purchaser);
    } catch (error) {
      console.error("Error al enviar el mail:", error);
    }
  };
}
