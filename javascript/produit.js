// - DEFINITION DES VARIABLES -
//   ************************

let loader = document.getElementById("loader");
let errorHtml = document.getElementById("errorGestion");



var idOfProduct = localStorage.id;
var product = [];


// - DEFINITION DES FONCTIONS -
//   ************************

// Récupération des données de l'API en fonction de l'Id du produit
function callApi() {
    fetch(`http://localhost:3000/api/teddies/${idOfProduct}`)
        .then(response => response.json())
        .then(json => {
            product = json;
            loader.classList.add("display-none");
            displayHtml(product);
        })
        .catch(err => {
            console.log(err);
            loader.classList.add("display-none");
            errorHtml.classList.remove("display-none");
        });
}

// Affichage de la fiche produit par ajout de HTML 
function displayHtml(element) {
    let parent = document.getElementById("produit");
    parent.insertAdjacentHTML('beforeend', `
    <img class="produit__img"  src="${element.imageUrl}" alt="">
        <div class="produit__ctn">
            <h1 class="produit__title">${element.name}</h1>
            <p class="produit__price">${(element.price / 100).toFixed(2)}€</p>
            <p class="produit__description">${element.description}</p>
            <form class="produit__ctn__form" id="form">
                <label for="selectColor">Couleur</label>
                <select name="productColor" id="selectColor">
                </select>
                <label for="quantité">Quantité</label>
                <input type="number" id="quantité" min="1" value="1">
                <button type="button" onclick="addPanier('${element._id}')">Ajouter au panier</button>
            </form>
        </div>
        `);
    for (let color of element.colors) {
        let container = document.getElementById("selectColor");
        container.insertAdjacentHTML('beforeend', `
                    <option>${color}</option>
        `);
    }
};

// Ajoute un élément au panier stocké dans le localStorage
// Fonction appelé dans le HTML
function addPanier(id) {
    let panierBefore = JSON.parse(localStorage.panier);
    var quantite = document.getElementById("quantité").value;

    for (let element of panierBefore) {

        if (element._id == id) {
            for (let i = quantite; i > 0; i--) {
                element.quantite += 1;
                element.quantite *= 1;
            }
        }
    }
    localStorage.setItem("panier", JSON.stringify(panierBefore));
    displayPanierCount()
}

// Affiche le nombre d'articles dans le panier du header
function displayPanierCount() {
    let totalArticle = 0;
    let counter = document.getElementById("counter");
    let panier = JSON.parse(localStorage.panier);
    for (let element of panier) {
        if (element.quantite > 0) {
            totalArticle += element.quantite;
            totalArticle *= 1;
        }
    }

    if (totalArticle === 0) {
        counter.classList.add("display-none");
    } else {
        counter.classList.remove("display-none");
        counter.textContent = `${totalArticle}`;
    }
}


// - APPEL DES FONCTIONS -
//   *******************
callApi()
displayPanierCount()
