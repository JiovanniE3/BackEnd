
const loadProducts = () => {


    let apiUrl = `/api/carts/${cartId}`;


    fetch(apiUrl)
        .then(data => {
            
            return data.json();
        })
        .then(Object => {
            console.log(Object);
            let ul = '';
            Object.cart.products.forEach(product => {
                ul += `<li id="${product.id}"> Id:${product.product.id} Product: ${product.product.title} Cantidad : ${product.quantity} </li>`;
            });
            let ulProduct = document.getElementById('mainProducts');
            ulProduct.innerHTML = ul;
        });
}

loadProducts();
