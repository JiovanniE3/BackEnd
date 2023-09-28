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
            console.log(typeof products.products[1].id);
            let ul = '';
            products.products.forEach(product => {
                ul += `<li id="${product.id}">
                        <span>Id: ${product.id}</span>
                        <a href="/products/${product.id}">${product.title}</a>
                        <span>Category: ${product.category}</span>
                        <span>Price: ${product.price}</span>
                        <button class="add-to-cart" data-product-id="${product.id}">Agregar al carrito</button>
                      </li>`;

            });


            let ulProduct = document.getElementById('mainProducts');
            ulProduct.innerHTML = ul;

            const totalPages = products.totalPages;
            const hasPrevPage = products.hasPrevPage;
            const hasNextPage = products.hasNextPage;
            const prevPage = products.prevPage;
            const nextPage = products.nextPage;


            const paginationDiv = document.getElementById('pagination');


            const firstPageLink = document.createElement('a');
            firstPageLink.href = 'products?page=1';
            firstPageLink.textContent = 'Pág.1';


            if (hasPrevPage) {
                const prevPageLink = document.createElement('a');
                prevPageLink.href = `products?page=${prevPage}`;
                prevPageLink.textContent = 'Prev.Pág.';
                paginationDiv.appendChild(prevPageLink);
            } else {
                const prevPageSpan = document.createElement('span');
                prevPageSpan.textContent = 'Prev.Pág.';
                paginationDiv.appendChild(prevPageSpan);
            }


            if (hasNextPage) {
                const nextPageLink = document.createElement('a');
                nextPageLink.href = `products?page=${nextPage}`;
                nextPageLink.textContent = 'Next.Pág.';
                paginationDiv.appendChild(nextPageLink);
            } else {
                const nextPageSpan = document.createElement('span');
                nextPageSpan.textContent = 'Next.Pág.';
                paginationDiv.appendChild(nextPageSpan);
            }


            const lastPageLink = document.createElement('a');
            lastPageLink.href = `products?page=${totalPages}`;
            lastPageLink.textContent = 'Ult.Pág.';


            paginationDiv.appendChild(firstPageLink);
            paginationDiv.appendChild(lastPageLink);

        });
}

loadProducts();




document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('add-to-cart')) {
        const productId = event.target.getAttribute('data-product-id'); 
        
        try {
            const response = await fetch(`/api/carts/1/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Producto agregado al carrito con éxito');
                alert("Se agrego al Carrito 1")
            } else {
                console.error('Error al agregar el producto al carrito');
            }
        } catch (error) {
            console.error('Error de red al agregar el producto al carrito:', error);
        }
    }
});
