const socket=io()

socket.on('newProduct',( newProduct , products)=>{
    console.log(`Se ha dado de alta: ${newProduct.title}`)

    let ul=''
    products.forEach(product=>{
        ul+=`<li>${product.title}</li>` 
    })

    let ulProduct=document.getElementById('mainProducts')
    ulProduct.innerHTML=ul

})


socket.on('productDeleted', ({ productId, products }) => {
    console.log(`Producto eliminado: ${productId}`);

    const productElement = document.getElementById(productId);
    if (productElement) {
        productElement.remove();
    }

    updateProductList(products);

});


function updateProductList(products) {
    let ul = '';
    products.forEach(product => {
        ul += `<li>${product.title}</li>`;
    });

    let ulProduct = document.getElementById('mainProducts');
    ulProduct.innerHTML = ul;
}

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