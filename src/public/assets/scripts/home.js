const socket = io();

const loadProducts = () => {

    const urlSearchParams = new URLSearchParams(window.location.search);
    const query = urlSearchParams.get("query");
    const sort = urlSearchParams.get("sort");
    const limit = urlSearchParams.get("limit");
    const page = urlSearchParams.get("page");


    let apiUrl = "/api/products?";
    if (query) {
        apiUrl += `query=${query}&`;
    }
    if (sort) {
        apiUrl += `sort=${sort}&`;
    }
    if (limit) {
        apiUrl += `limit=${limit}&`;
    }
    if (page) {
        apiUrl += `page=${page}&`;
    }

    fetch(apiUrl)
        .then(data => {
            
            return data.json();
        })
        .then(products => {
            console.log(products);
            let ul = '';
            products.products.forEach(product => {
                ul += `<li id="${product.id}">Id: ${product.id} Product: ${product.title} Price : ${product.price} Category: ${product.category} </li>`;
            });
            let ulProduct = document.getElementById('mainProducts');
            ulProduct.innerHTML = ul;


        });
}

loadProducts();
