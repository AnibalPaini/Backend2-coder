const formNewProduct = document.getElementById("formNewProduct");

formNewProduct.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(formNewProduct);
  const productData = {};

  formData.forEach((value, key) => {
    productData[key] = value;
  });

  fetch("/api/products/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  })
  .then((result) => result.json())  // Convertimos la respuesta a JSON
  .then((newProduct) => {
    if (newProduct._id) {  // Verificamos si se creó correctamente
      alert("Producto creado!");

      const productsList = document.getElementById("productsList");

      const newItem = document.createElement("li");
      newItem.innerHTML = `
        <p>${newProduct.title}</p>
        <p>${newProduct.description}</p>
        <p>$${newProduct.price}</p>
        <button class="delete-btn" data-id="${newProduct._id}">Eliminar producto</button>
      `;

      productsList.appendChild(newItem);
    }
  })
  .catch((error) => console.error("Error al agregar producto:", error));

  // Vaciamos el formulario
  const inputsForm = document.querySelectorAll(".inputsForm");
  inputsForm.forEach((input) => {
    input.value = "";
  });
});

