import getCartIdFromCookies from "./products.js";

const finalizarCompraBtn = document.getElementById("finalizarCompra");
const cartId = getCartIdFromCookies();
if (finalizarCompraBtn) {
  finalizarCompraBtn.addEventListener("click", async () => {
    if (!cartId) {
      alert("No se encontró el carrito.");
      return;
    }

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
        window.location.href = `/ticket/${data.ticket.code}`;
      } else {
        console.error("Error al finalizar la compra:", data);
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Ocurrió un error inesperado.");
    }
  });
}

const precioTotal = document.querySelectorAll(".precioTotal");
const precioProducto = document.querySelectorAll(".precioProducto");
const cantidadProducto = document.querySelectorAll(".cantidadProducto");

precioProducto.forEach((precio, index) => {
  let precioNum = parseFloat(precio.textContent);
  let cantidadNum = parseInt(cantidadProducto[index].textContent);
  let total = precioNum * cantidadNum;
  precioTotal[index].textContent = total.toFixed(2);
});

document.querySelectorAll(".btnSumar").forEach((btn) => {
  btn.addEventListener("click", () => {
    const pid = btn.dataset.pid;
    const cantidadElemento = btn
      .closest(".card-body")
      .querySelector(".cantidadProducto");
    const cantidadActual = parseInt(cantidadElemento.textContent);
    const nuevaCantidad = cantidadActual + 1;

    fetch(`/api/carts/${cartId}/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: nuevaCantidad }),
    }).then(()=>window.location.reload())
  });
});

document.querySelectorAll(".btnRestar").forEach((btn)=>{
  btn.addEventListener("click", ()=>{
    const pid = btn.dataset.pid;
    const cantidadElemento=btn
      .closest(".card-body")
      .querySelector(".cantidadProducto");
    const cantidadActual= parseInt(cantidadElemento.textContent)
    const nuevaCantidad= cantidadActual-1;

    fetch(`/api/carts/${cartId}/products/${pid}`,{
      method:"PUT",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({quantity:nuevaCantidad})
    }).then(()=>window.location.reload())
  })
})

document.querySelectorAll(".btnEliminar").forEach((btn)=>{
  btn.addEventListener("click", ()=>{
    const pid= btn.dataset.pid;
    fetch(`/api/carts/${cartId}/products/${pid}`,{
      method:"DELETE",
      headers:{
        "Content-Type":"application/json"
      }
    }).then(()=>window.location.reload())
  })
})
