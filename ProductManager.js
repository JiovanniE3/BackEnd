class ProductManager {
    constructor() {
      this.products = [];
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
      if (arguments.length === 6) { 
        if (this.products.find(product => product.code === code)) {
          return `Ya existe el Code ${code} en Products`;
        } else {
          let newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
          };
  
          if (this.products.length === 0) {
            newProduct.id = 1;
          } else {
            newProduct.id = this.products[this.products.length - 1].id + 1;
          }
  
          this.products.push(newProduct);
          return `${newProduct.title} agregado correctamente`;
        }
      } else {
        return `Escribe todos los valores (title, description, price, thumbnail, code, stock)`;
      }
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductsById(idProduct) {
      let foundProduct = this.products.find((product) => product.id === idProduct);
      return foundProduct ? foundProduct : `No existe el id ${idProduct} en Products`;
    }
  }
  
  let test = new ProductManager();
  
 console.log(test.getProducts());
 console.log(test.addProduct("producto prueba","Este es un producto prueba",200,"Sin Imagen","abc123",25));
 console.log(test.getProducts());
 console.log(test.addProduct("producto prueba","Este es un producto prueba",200,"Sin Imagen","abc123",25));
 console.log(test.getProductsById(2));