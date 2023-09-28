const socket=io()

document.getElementById('deleteProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const productId = document.getElementById('productIdToDelete').value;

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
        });

        if (response.ok) {

            loadProducts();

        } else {
           
        }
    } catch (error) {
        console.error('Error al enviar la solicitud DELETE:', error);
    }
});

document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const productData = {
        
        title: formData.get('title'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        thumbnail: formData.get('thumbnail'),
        code: formData.get('code'),
        stock: parseInt(formData.get('stock')),
        category: formData.get('category')
    };

   
    console.log(productData);

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        if (response.ok) {

        } else {
            
        }
    } catch (error) {
        console.error('Error al enviar la solicitud POST:', error);
    }
});




socket.on('productListUpdate', (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach((product) => {
        const li = document.createElement('li');
        li.textContent = `ID: ${product.id}, Título: ${product.title}, Descripción: ${product.description}`;
        productList.appendChild(li);
    });
});


socket.on('newProduct',( newProduct , products)=>{
    console.log(`Se ha dado de alta: ${newProduct.title}`)

    let ul=''
    products.forEach(product=>{
        ul += `<li id="${product.id}">Id: ${product.id} Product: ${product.title} Price : ${product.price}</li>`;
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
        ul += `<li id="${product.id}">Id: ${product.id} Product: ${product.title} Price : ${product.price}</li>`;
    });

    let ulProduct = document.getElementById('mainProducts');
    ulProduct.innerHTML = ul;
}

const loadProducts = () => {
    fetch('/api/products/?limit=99')
        .then(data => {
            return data.json();
        })
        .then(products => {
            let ul = '';
            products.products.forEach(product => {
                ul += `<li id="${product.id}">Id: ${product.id} Product: ${product.title} Price : ${product.price}</li>`;
            });
            let ulProduct = document.getElementById('mainProducts');
            ulProduct.innerHTML = ul;
        });
}

loadProducts()