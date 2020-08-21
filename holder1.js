// Dom variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

// this is our main cart
let cart = [];
// buttons
let buttonsDOM = [];
// this class is responsible for the getting the products
class Products{
  async getProducts(){
    try{
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map(item=>{
        const {title,price} = item.fields;
        const {id} = item.sys;
        const image = item.fields.image.fields.file.url;
        return {title,price,id,image};
      });
      return products;
   }catch(error){
    console.log(error);
   }
  }
}
// this class would be responsible for displaying the data
class UI{
  // this method helps to display the products
  displayProducts(products){
    let result = ``;
    products.forEach(product =>{
      result += `
       <!-- single product -->
     <article class="product">
      <div class="img-container">
        <img src="${product.image}" alt="product" class="product-img">
        <button class="bag-btn" data-id="${product.id}">
          <i class="fas fa-shopping-cart"></i>
          add to bag
        </button>
      </div>
      <h3>${product.title}</h3>
      <h4>$${product.price}</h4>
    </article>
    <!-- end of single product -->
      `
    });
    productsDOM.innerHTML = result;
  }
  getBagBtns(){
    const btns = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = btns;
    btns.forEach(btn=>{
      let id = btn.dataset.id;
      let inCart = cart.find(item =>item.id === id);
      if(inCart){
        btn.innerText = "In Cart";
        btn.disabled = true;
      }

        btn.addEventListener("click",(event)=>{
          event.target.innerText = "In Cart";
          event.target.disabled = true;
          // get product from products array
          let cartItem = {...Storage.getProduct(id),amount:1};

          // add product to the cart
          // save cart in local storage
          // set cart values
          // display cart item
          // show the cart
        });

    })
  }
}
// this class is responsible for storage
class Storage{
  static saveProducts(products){
    localStorage.setItem("products",JSON.stringify(products));
  }
  static getProduct(id){
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }
}

// this event listener helps to wait till the DOM is loaded
document.addEventListener("DOMContentLoaded",()=>{
  // instance of UI
  const ui = new UI();
  // instance of products
  const products = new Products();
  // get all products using the getProducts method on the products class and display it using the displayProducts method from the UI method
  products.getProducts().then(products=>{
    ui.displayProducts(products);
    Storage.saveProducts(products);
    }).then(()=>{
      ui.getBagBtns();
  });
});