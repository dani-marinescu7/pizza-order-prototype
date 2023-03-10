const rootElement = document.getElementById('root');
let allergens;
let total = 0;

async function fetchPizzas () {
    await fetch('/api/pizza/')
        .then((response) => response.json())
        .then((data) => showPizzas(data))
}

async function fetchAllergens () {
    await fetch('/api/allergen/')
        .then((response) => response.json())
        .then((data) => allergens = data)
}
fetchAllergens()

const addNavbar = (content) => {
    return `<nav class="navbar navbar-expand-lg bg-dark fixed-top">
    <div class="container-fluid">
      <a class="navbar-brand" href="#" style="color: white;">Home</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="color: white;">
            Filter
            </a>
            <ul class="dropdown-menu">
            ${content.map(allergen => addAllergen(allergen)).join('')}
            </ul>
            </li>
        </ul>
        <form class="d-flex">
          <button class="btn btn-outline-success" disabled>Cart</button>
        </form>
      </div>
    </div>
  </nav>`
}

const addAllergen = (content) => {
    return `<li><a class="dropdown-item">
                <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="${content.id}" checked>
                <label class="form-check-label" for="flexCheckDefault">${content.name}</label>
                </div>
            </a></li>`
}

const addContainer = () => {
    return `<div class="container text-center mt-5 pt-2">
                <div id="pizzas-container" class="row row-cols-auto"></div>
            </div>`
}

const addPizzaElement = (content) => {
    return `<div class="card mx-3" style="width: 18rem;background-color: aliceblue;">
                <img src="/public/img/${content.id}.png" class="card-img-top" alt="${content.name}">
                <div class="card-body d-flex flex-column justify-content-between">
                    <h5 class="card-title">${content.name}</h5>
                    <p class="card-text">${content.ingredients.join(' ')}</p>
                    <p class="card-allergens">${content.allergens.map(allergen => showAllergen(allergens, allergen)).join(' ')}</p>
                    <p class="card-price">${content.price} $</p>
                    <div class="d-flex flex-row justify-content-between w-100">
                        <a class="btn btn-primary w-50 d-inline-block">Add to cart</a>
                        <div class="w-50 d-flex flex-row">
                            <input type="button" value="-" class="button-minus" data-field="quantity">
                            <input type="text" step="1" max="" value="1" name="quantity" class="w-25">
                            <input type="button" value="+" class="button-plus" data-field="quantity">
                        </div>
                    </div>
                </div>
            </div>`
}

const addModal = () => {
    return `<div id="modal" class="modal bg-secondary bg-opacity-50" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Cart details</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body text-center">
                            <div id="oredered-pizzas">
                                <div class="col-md-6 d-flex justify-content-between">
                                    <span>TOTAL</span><span id="total-price"></span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label for="inputName" class="form-label">Name</label>
                                <input type="text" class="form-control" id="inputName">
                            </div>
                            <div class="col-md-6">
                                <label for="inputEmail" class="form-label">Email</label>
                                <input type="email" class="form-control" id="inputEmail">
                            </div>
                            <div class="col-md-6">
                                <label for="inputCity" class="form-label">City</label>
                                <input type="text" class="form-control" id="inputCity">
                            </div>
                            <div class="col-md-6">
                                <label for="inputStreet" class="form-label">Street</label>
                                <input type="text" class="form-control" id="inputStreet">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary">Submit order</button>
                            <button id="close-modal" type="button" class="btn btn-secondary close">Close</button>
                        </div>
                    </div>
                </div>
            </div>`
}

const filterEventListener = (arr) => {
    document.querySelectorAll("input[type=checkbox]").forEach(checkbox => checkbox.addEventListener('change', () => {
        const checkedBoxes = document.querySelectorAll("input[type=checkbox]:not(:checked)")
        const unacceptedAllergens = [];
        Object.values(checkedBoxes).map(value => unacceptedAllergens.push(+value.id))
        const acceptedPizzas = []

        arr.map(pizza => {
            if (!arr.filter(pizza => pizza.allergens.some(allergen => unacceptedAllergens.includes(allergen))).includes(pizza)) {
                acceptedPizzas.push(pizza)
            }
        })
        document.getElementById('pizzas-container').innerHTML = "";
        acceptedPizzas.map(pizza => document.getElementById('pizzas-container').insertAdjacentHTML('beforeend', addPizzaElement(pizza)))
        amountEventListener();
        addToCartEventListener();
        cartEventListener();
    }));
}


const amountEventListener = () => {
    const minusButtons = document.querySelectorAll(".button-minus");
    const plusButtons = document.querySelectorAll(".button-plus");
    const inputText = document.querySelectorAll("input[type=text]");
    minusButtons.forEach((button, index) => button.addEventListener('click', () => {
        if (inputText[index].value > 1) {
            inputText[index].value--;
        }
    }));
    plusButtons.forEach((button, index) => button.addEventListener('click', () => {
        inputText[index].value++;
    }));
}

const addToCartEventListener = () => {
    document.querySelectorAll(".btn-primary").forEach((button, index) => button.addEventListener('click', () => {
        document.querySelector(".btn-outline-success").disabled = false;
        const pizza = rootElement.children[1].children[0].children[index].children[1].children[0].innerText; 
        const qty = +rootElement.children[1].children[0].children[index].children[1].children[4].children[1].children[1].value;
        const price = +rootElement.children[1].children[0].children[index].children[1].children[3].innerText.substring(0, 2);
        total += (qty * price);
        document.getElementById('oredered-pizzas').insertAdjacentHTML('afterbegin', addPizzaToOrder(pizza, qty, price));
        document.getElementById('total-price').innerHTML = "";
        document.getElementById('total-price').insertAdjacentText('afterbegin', total);
        document.getElementById('total-price').insertAdjacentText('beforeend', "$");
    }));
}
const addPizzaToOrder = (name, quantity, price) => {
    return `<div class="col-md-6 d-flex justify-content-between"><span>${name}</span><span>${quantity} x${price}$</span></div>`
}

const cartEventListener = () => {
    document.querySelector(".btn-outline-success").addEventListener('click', (event) => {
        const modal = document.getElementById('modal');
        modal.classList.remove('d-none');
        modal.classList.add('d-block');
        event.preventDefault();
    });
}

const closeModal = () => {
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.classList.remove('d-block');
            modal.classList.add('d-none');
        }
    }
    document.querySelector(".close").onclick = () => {
        modal.classList.remove('d-block');
        modal.classList.add('d-none');
    }
    document.getElementById("close-modal").onclick = () => {
        modal.classList.remove('d-block');
        modal.classList.add('d-none');
    }
}

const showPizzas = (arr) => {
    rootElement.insertAdjacentHTML('afterbegin', addContainer());
    rootElement.insertAdjacentHTML('afterbegin', addNavbar(allergens));
    filterEventListener(arr);
    arr.map(pizza => document.getElementById('pizzas-container').insertAdjacentHTML('beforeend', addPizzaElement(pizza)));
    amountEventListener();
    addToCartEventListener();
    cartEventListener();
    rootElement.insertAdjacentHTML('beforeend', addModal());
    closeModal();
}

const showAllergen = (arr, id) => arr.find(allergen => allergen.id === id).name;

const loadEvent = _ => {
    fetchPizzas();
};

window.addEventListener("load", loadEvent);
