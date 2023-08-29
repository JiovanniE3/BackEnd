const fs = require('fs')

class ProductManager {
    constructor(path) {
        this.path = path
    }

    async getProducts() {
        if (fs.existsSync(this.path)) {
            return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        } else return []
    }

    async addProducts(title, description, price, thumbnail, code, stock, category) {
        let products = await this.getProducts()

        if (products.length > 0) {
            let findProduct = products.find(product => product.code === code)

            if (findProduct) {
                console.log(`The Code ${code} already exists`)
                return
            } else {
                let newProduct = {
                    title, description, price, status:true, thumbnail, code, stock, category
                }

                if (products.length === 0) {
                    newProduct.id = 1
                } else {
                    newProduct.id = products[products.length - 1].id + 1
                }

                products.push(newProduct)
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
            }
        }
    }

    async getProductsById(idProduct) {
        let products = await this.getProducts()
        let findProduct = products.find(product => product.id === idProduct)
        return findProduct ? findProduct : null;
    }

    async updateProduct(title, description, price, thumbnail, code, stock, category,idProduct) {
        let products = await this.getProducts();
        let updatedProductIndex = products.findIndex(product => product.id === idProduct);

        if (updatedProductIndex !== -1) {
            let updatedProduct = {
                
                title,
                description,
                price,
                status:true,
                thumbnail,
                code,
                stock,
                category,
                idProduct
                
            };

            products[updatedProductIndex] = updatedProduct;

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5));
            console.log(`${title} has been updated`);
        } else {
            console.log(`Product with ID ${idProduct} was not found. (updateProduct)`);
        }
    }

    async deleteProduct(idProduct) {
        let products = await this.getProducts();
    
        let deleteProductIndex = products.findIndex(product => product.id === idProduct);
    
        if (deleteProductIndex !== -1) {

            console.log(`Product ${deleteProductIndex.title} has been deleted.`);

            products.splice(deleteProductIndex, 1); 
    
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5));
            
        } else {

            console.log(`Product with ID ${idProduct} was not found. (deleteProduct)`);

        }
    }
}

const develop = async () => {
    let path = './files/products.json'
    let productFile = new ProductManager(path)
    // await productFile.addProducts('Laptop HP Pavilion', 'Intel Core i5, 8GB RAM, 256GB SSD', 799.99, 'hp_pavilion.jpg', 'LT-HP-001', 20,"Laptops");
    // await productFile.updateProduct('Laptop HP Pavilion', 'Intel Core i5, 8GB RAM, 256GB SSD', 800, 'hp_pavilion.jpg', 'LT-HP-001', 20,"Laptops",11);
    console.log(await productFile.getProducts());
}

develop()
