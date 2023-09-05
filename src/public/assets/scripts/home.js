const socket=io()


const loadProducts = () => {
    fetch('/api/products')
        .then(data => {
            return data.json();
        })
        .then(products => {
            let ul = '';
            products.forEach(product => {
                ul += `<li id="${product.id}">${product.title}</li>`;
            });
            let ulProduct = document.getElementById('mainProducts');
            ulProduct.innerHTML = ul;
        });
}

loadProducts()