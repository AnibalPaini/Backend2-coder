import getCartIdFromCookies from "./products.js";
console.log("holaaaaaaaaaa");
const finalizarCompraBtn = document.getElementById("finalizarCompra");

if (finalizarCompraBtn) {
  finalizarCompraBtn.addEventListener("click", async () => {
    const cartId = getCartIdFromCookies(); // debe devolver un valor válido
    console.log("Finalizando compra para el carrito:", cartId);

    try {
      const response = await fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Compra finalizada con éxito:", data);
        // Redirigimos a una vista con los resultados
        window.location.href = `/purchase-result?code=${data.ticket.code}`;
      } else {
        console.error("Error al finalizar la compra:", data);
        alert("Error al finalizar la compra: " + data.error);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Ocurrió un error inesperado.");
    }
  });
}
