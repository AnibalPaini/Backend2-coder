//Obtener carrito de la cookie
export default function getCartIdFromCookies() {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'cartId') {
            return value;
        }
    }
    return null;
}

//AGREGAR AL CARRITO
const addCartButtons = document.querySelectorAll('.add-cart');
addCartButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
        const productId = event.target.getAttribute('data-id');
        const quantity = 1; 
        const cartId = getCartIdFromCookies()

        if(!cartId){
            alert("Debe iniciar sesion para agregar carrito!") //si no tiene sesion iniciada, no tiene un carrito asiganado
        }

        try {
            // Enviar la solicitud PUT para agregar el producto al carrito
            const response = await fetch(`/api/carts/${cartId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product: productId,
                    quantity: quantity,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Producto agregado al carrito con éxito");
                // Aquí puedes actualizar la UI o el estado del carrito
            } else {
                alert(data.message || "Error al agregar el producto al carrito");
            }
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            alert("Hubo un problema al agregar el producto al carrito");
        }
    });
});

const cartButton= document.querySelector(".cartButton")
if (cartButton) {
    cartButton.addEventListener('click' , ()=>{
        const cid=getCartIdFromCookies()
        console.log(cid);
        window.location.replace(`/carts/${cid}`)
    })   
}

  
