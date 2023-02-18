//*Boton y contenido vacio del carrito - mostrar y ocultar
const carToggle = document.querySelector(".car__toggle")
const carBlock = document.querySelector(".car__block")
const productsList = document.querySelector("#products-container")
const car = document.querySelector('#car')
const carList = document.querySelector('#car__list')

let carProducts = [] 

carToggle.addEventListener("click", () => {
    carBlock.classList.toggle("nav__car__visible")
})
//?Listeners
eventListenersLoader()

function eventListenersLoader(){
    productsList.addEventListener('click', addProduct);
    //* Se ejecuta cuando se carga la página
    document.addEventListener('DOMContentLoaded', () => {
        carProducts = JSON.parse(localStorage.getItem('car')) || [];
        carElementsHTML();
    })

}

//*petición al axios
const baseURL = "https://academlo-api-production.up.railway.app/api"

function getProducts() {
    axios.get(`${baseURL}/products`)
        .then(function(response){
            const products = response.data
            printProducts(products)
        })
        .catch(function (error){
            console.log(error)
        })
};
getProducts()

//* Pintar productos en la pagina web
function printProducts(products) {
    let html = '';
    for(let i = 0; i < products.length; i++){
        html += `
        <div class="product__container">
            <div class="product__container__img">
                <img src="${products[i].images.image1}" alt="">
            </div>
            <div class="product__container__name">
                <p>${products[i].name}</p>
            </div>
            <div class="product__container__price">
                <p>$ ${products[i].price.toFixed(2)}</p>
            </div>
            <div class="product__container__button">
                <button class="car__button add__to__car" id="add__to__car" data-id="${products[i].id}">Add to car</button>
            </div>
        </div>
        `
    }
    productsList.innerHTML = html;
}
//*agragar productos al carrito
//*1. Capturar la información del producto al que le de click
function addProduct(e) {
    if(e.target.classList.contains('add__to__car')){
        const product = e.target.parentElement.parentElement
        //console.log(product)
        carProductsElement(product)
    }
}

//*2. Tranformar la infomrmación html en un array
function carProductsElement(product){
    const infoProduct = {
        id: product.querySelector('button').getAttribute('data-id'),
        image: product.querySelector('img').src,
        name: product.querySelector('.product__container__name p').textContent,
        price: product.querySelector('.product__container__price p').textContent,
        quantity: 1
    }
    //* Agregar contador
    if(carProducts.some(product => product.id === infoProduct.id)){
        const product = carProducts.map(product => {
            if(product.id === infoProduct.id) {
                product.quantity ++;
                return product;
            } else {
                return product;
            }
        })
        carProducts = [...product]
    } else {
        carProducts = [...carProducts, infoProduct]
    }
    carElementsHTML()
    //carProducts = infoProduct
}
//*3. Pintar los productos dentro del carrito
function carElementsHTML(){
    carList.innerHTML = "";

    carProducts.forEach(product => {
        const div = document.createElement('div')
        div.innerHTML = `
        <div class="car__product">
            <div class="car__product__image">
                <img src="${product.image}" alt="">
            </div>
            <div class="car__product__description">
                <div>
                    <p>${product.name}</p>
                </div>
                <div>
                    <p>Precio: ${product.price}</p>
                </div>
                <div>
                    <p>Cantidad: ${product.quantity}</p>
                </div>
                <div class="car__product__button">
                    <button class="delete__product" data-id="${product.id}">Delete</button>
                </div>
            </div>
        </div>
        <hr>
        `;
        carList.appendChild(div)
        //*Eliminar producto
        div.querySelector('.delete__product').addEventListener('click', () => {
            deleteProduct(product.id);
          });
    })
    //* Local Storage
    productsStorage()
}

//*4. Delete
function deleteProduct(id) {
    carProducts = carProducts.filter((product) => product.id !== id);
    carElementsHTML();
}

//*5. Vaciar carrito
document.querySelector('#empty__car').addEventListener('click', () => {
    carProducts = [];
    carElementsHTML();
})

function productsStorage(){
    localStorage.setItem('car', JSON.stringify(carProducts))
}