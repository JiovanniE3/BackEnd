
loadProductDetails(productId);

function loadProductDetails(productId) {

    fetch(`/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            let ulProduct = document.getElementById('mainProducts');
             
            ulProduct.innerHTML = `
                <h2>${product.title}</h2>
                <p>Descripción: ${product.description}</p>
                <p>Categoría: ${product.category}</p>
                <p>Precio: ${product.price}</p> 
                <button class="add-to-cart" data-product-id="${product.id}">Agregar al carrito</button>`;
            
        })
        .catch(error => {
            console.error('Error al cargar los detalles del producto:', error);
        });
}

console.log(productId);

document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('add-to-cart')) {
        const productId = event.target.getAttribute('data-product-id'); 
        
        try {
            const response = await fetch(`/api/carts/${userCart}/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Producto agregado al carrito con éxito');
                alert(`Se agrego al Carrito ${userCart}`)
            } else {
                console.error('Error al agregar el producto al carrito');
            }
        } catch (error) {
            console.error('Error de red al agregar el producto al carrito:', error);
        }
    }
});
