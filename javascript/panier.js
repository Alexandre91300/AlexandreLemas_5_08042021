// - DEFINITION DES VARIABLES -
//   ************************
let form = document.getElementById("form");
let lastName = document.getElementById("lastName");
let firstName = document.getElementById("firstName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let email = document.getElementById("email");
let storagePanier = JSON.parse(localStorage.panier);

let lastNameError = document.getElementById("lastNameError");
let firstNameError = document.getElementById("firstNameError");
let addressError = document.getElementById("addressError");
let cityError = document.getElementById("cityError");
let btn = document.getElementById("btn");

let regexNumber = /[0-9]|\./;
let regexSymbole = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;

var total = 0;
var contact = {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: "",
};
var products = [];
var commande = {
    contact,
    products
};

// - DEFINITION DES FONCTIONS -
//   ************************

// - Gestion du panier -

// Affichage du panier par ajout de HTML pour chaque produit
function displayPanier() {
    for (let element of storagePanier) {
        if (element.quantite > 0) {
            let parent = document.getElementById("container");
            parent.insertAdjacentHTML('beforeend', `
                <div class="panier__ctn__article" id="ctn${element._id}">
                    <img src="${element.imageUrl}" alt="">
                    <h3>${element.name}</h3>
                    <input type="number" id="${element._id}" min="0" value="${element.quantite}" onchange="changeAmount(id)">
                    <p id="total${element._id}">${(element.price * element.quantite / 100).toFixed(2)}€</p>
                    <button id="${element._id}" onclick="deleteProduct(id)">X</button>
                </div>
                `)

            total += (element.price * element.quantite / 100);
        }
    }
}

// Affichage du total
function displayTotal() {
    if (total > 0) {
        let parent = document.getElementById("container");
        parent.insertAdjacentHTML('beforeend', `
                    <h2 class="panier__ctn__total" id="total">TOTAL : ${total.toFixed(2)} €</h2> 
                `);

        document.getElementById("totalForm").innerHTML = `TOTAL : ${total.toFixed(2)} €`;
    }
}

// Gestion du changement de quantité produit
// Fonction appelé dans le HTML
function changeAmount(id) {
    let panierBefore = JSON.parse(localStorage.panier);
    for (let element of panierBefore) {
        if (element._id === id) {
            element.quantite = document.getElementById(`${id}`).value;
            document.getElementById(`total${id}`).textContent = `${(element.price * element.quantite / 100).toFixed(2)}€`;

            total = 0;

            for (let element of panierBefore) {
                if (element.quantite > 0) {
                    total += (element.price * element.quantite / 100);
                }
            }

            document.getElementById("totalForm").innerHTML = `TOTAL : ${total.toFixed(2)} €`;
            document.getElementById("total").innerHTML = `TOTAL : ${total.toFixed(2)} €`;

            if (element.quantite == 0) {
                let obj = document.getElementById(`ctn${id}`);
                obj.remove()
            }

            displayForm();
        }
    }
    localStorage.setItem("panier", JSON.stringify(panierBefore));
};

// Suppression d'éléments
// Fonction appelé dans le HTML
function deleteProduct(id) {
    let panierBefore = JSON.parse(localStorage.panier);
    for (let element of panierBefore) {
        if (element._id === id) {

            element.quantite = 0;

            let obj = document.getElementById(`ctn${id}`);
            obj.remove()

            total = 0;

            for (let element of panierBefore) {
                if (element.quantite > 0) {
                    total += (element.price * element.quantite / 100);
                }
            }

            document.getElementById("totalForm").innerHTML = `TOTAL : ${total.toFixed(2)} €`;
            document.getElementById("total").innerHTML = `TOTAL : ${total.toFixed(2)} €`;

            displayForm();

        }
    }
    // Mise à jour du localStorage
    localStorage.setItem("panier", JSON.stringify(panierBefore));
}

// - Gestion du formulaire -

// Affichage du formulaire
function displayForm() {
    if (total === 0) {
        form.classList.add("display-none");
        let parent = document.getElementById("container");
        parent.insertAdjacentHTML('beforeend', `
        <p class="panier__ctn__vide">Il semblerait qu'aucun article se trouve dans votre panier</P>
    `)
    }
}

// Test de validité du formulaire
// Fonction appelé dans le HTML
function formValidity() {

    let lastNameValidity = false;
    let firstNameValidity = false;
    let addressValidity = false;
    let cityValidity = false;

    let formValidation = false;

    // Vérification de validité des différents inputs
    if (regexNumber.test(lastName.value) || regexSymbole.test(lastName.value)) {
        formValidation = false;
        lastNameError.classList.remove("display-none");

    } else {
        lastNameError.classList.add("display-none");
        lastNameValidity = true;
    }

    if (regexNumber.test(firstName.value) || regexSymbole.test(firstName.value)) {
        formValidation = false;
        firstNameError.classList.remove("display-none");
    } else {
        firstNameError.classList.add("display-none");
        firstNameValidity = true
    }

    if (regexSymbole.test(address.value)) {
        formValidation = false;
        addressError.classList.remove("display-none");
    }
    else {
        addressError.classList.add("display-none");
        addressValidity = true;
    }

    if (regexNumber.test(city.value) || regexSymbole.test(city.value)) {
        formValidation = false;
        cityError.classList.remove("display-none");
    } else {
        cityError.classList.add("display-none");
        cityValidity = true;
    }

    if (lastNameValidity && firstNameValidity && addressValidity && cityValidity) {
        formValidation = true;
    }

    if (formValidation === false) {
        btn.disabled = true;
        if (btn.classList.contains("panier__form__disabled") === false) {
            btn.classList.add("panier__form__disabled");
        }
    } else {
        btn.disabled = false;
        if (btn.classList.contains("panier__form__disabled")) {
            btn.classList.remove("panier__form__disabled");
        }
    }
}

// Soumission du formulaire
// Fonction appelé à la soummission du formulaire
form.addEventListener("submit", function (e) {
    e.preventDefault();
    contact.lastName = lastName.value;
    contact.firstName = firstName.value;
    contact.address = address.value;
    contact.city = city.value;
    contact.email = email.value;

    addProductArrayApi()
    apiPost()
});

// Ajout de chaque éléments du panier dans l'array "products" qui va être envoyé à l'API
function addProductArrayApi() {
    for (let element of storagePanier) {
        if (element.quantite > 0) {
            for (let i = element.quantite; i > 0; i--) {
                products.push(element._id)
            }
        }
    }
}

// Envoi le formulaire et les produit à l'API, elle va retourner l'id de commande
function apiPost() {
    fetch('http://localhost:3000/api/teddies/order', {
        method: "POST",
        body: JSON.stringify(commande),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then(response => response.json())
        .then(json => {
            localStorage.setItem("idOfCommand", json.orderId);
            localStorage.setItem("PriceOfCommand", total);

            window.location.href = "http://127.0.0.1:5500/html/confirmation.html";

        })
        .catch(err => alert('Request Failed', err));
}

// - APPEL DES FONCTIONS -
//   *******************

displayPanier()
displayTotal()
displayForm()
formValidity()

