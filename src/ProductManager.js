const { log } = require('console')
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

    async addProducts(title, description, price, thumbnail, code, stock) {
        let products = await this.getProducts()

        if (products.length > 0) {
            let findProduct = products.find(products => products.code === code)

            if (findProduct) {
                console.log(`The Code ${code} already exists`)
                return
            } else {
                let newProduct = {
                    title, description, price, thumbnail, code, stock
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

    async getProductsbyId(idProduct) {

        let products = await this.getProducts()

        let findProduct = products.find(products => products.id === idProduct)

        return findProduct ? console.log(findProduct) : console.log(`Product with ID ${idProduct} was not found. (getProductbyID)`)
    }

    async updateProduct(title, description, price, thumbnail, code, stock, idProduct) {

        let products = await this.getProducts();
    
        let updatedProductIndex = products.findIndex(product => product.id === idProduct);
    
        if (updatedProductIndex !== -1) {
            let updatedProduct = {
                
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                id: idProduct,
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

    
    

    await productFile.addProducts('Laptop HP Pavilion', 'Intel Core i5, 8GB RAM, 256GB SSD', 799.99, 'hp_pavilion.jpg', 'LT-HP-001', 20);
    await productFile.updateProduct('Monitor LG UltraGear 27"', '1440p, 144Hz, IPS Panel', 100, 'lg_monitor.jpg', 'MN-LG-011', 20, 11)
    await productFile.getProductsbyId(11)
    await productFile.deleteProduct(1)

    console.log(await productFile.getProducts());
    
}

develop()