import getCartIdFromCookies from "./products.js";

const finalizarCompraBtn = document.getElementById("finalizarCompra");

if (finalizarCompraBtn) {
  finalizarCompraBtn.addEventListener("click", async () => {
    const cartId = getCartIdFromCookies();

    console.log("Finalizando compra para el carrito:", cartId);

    window.location.href = `/api/carts/${cartId}/purchase`;
  });
}

