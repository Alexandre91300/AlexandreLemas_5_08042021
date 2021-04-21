// - DEFINITION DES VARIABLES -
//   ************************

var products = []; // Contient la liste des produits
var panier = []; // Contient le panier + la quantitée


// - DEFINITION DES FONCTIONS -
//   ************************

// Récupération des données de l'API
function callApi() {
    fetch('http://localhost:3000/api/teddies')
        .then(response => response.json())
        .then(json => {
            let response = json;
            products = response;
            panier = products;
            panierInit() // Initialisation du localStorage 
            displayHtml()
            let loader = document.getElementById("loader");
            loader.classList.add("display-none");
        })
        .catch(err => {
            console.log(err);
            let errorHtml = document.getElementById("errorGestion");
            let loader = document.getElementById("loader");
            loader.classList.add("display-none");
            errorHtml.classList.remove("display-none");
        });
}

// Ajout de HTML personnalisé pour chaque produit
// Appelé dans la fonction callApi() 
function displayHtml() {
    var parent = document.getElementById("container");

    for (let element of products) {
        parent.insertAdjacentHTML('beforeend', `
            <div class="article__container__box">
            <img class="article__container__box__img" src="${element.imageUrl}" alt="image produit">
            <h2 class="article__container__box__title">${element.name}</h2>
            <p class="article__container__box__price">${(element.price / 100).toFixed(2)}€</p>
            <button class="article__container__box__btn article__container__box__btn--add" onclick="addPanier('${element._id}')">Ajouter au panier</button>
            <a class="article__container__box__btn" href="./html/produit.html" onmouseover="localId('${element._id}')">Détails</a>
            </div> 
        `);
    }
};

// Modifie le "id" du local storage en fonction du produit qui l'appel
// Fonction appelé au niveau du HTML des balises <a class="article__container__box__btn">Détails</a> 
function localId(id) {
    localStorage.setItem("id", id);
}

// Initialisation du local storage
function panierInit() {
    localStorage.setItem("id", 0);
    if (localStorage.panier === undefined) {
        for (let product of panier) {
            product.quantite = 0;
        }
        localStorage.setItem("panier", JSON.stringify(panier));
    };
};

// Ajoute un élément au panier stocké dans le localStorage
// Fonction appelé au niveau du HTML des balises <button class="article__container__box__btn" >Ajouter au panier</button>
function addPanier(id) {
    let panierBefore = JSON.parse(localStorage.panier);
    for (let element of panierBefore) {
        if (element._id == id) {
            element.quantite += 1;
            element.quantite *= 1; // Evite qu'un 0 se place avant le chiffre
        }
    }
    localStorage.setItem("panier", JSON.stringify(panierBefore));
    displayPanierCount()
}

// Affiche le nombre d'articles dans le panier au niveau du header
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

callApi() // Appel de l'API
displayPanierCount() // Affichage du nombre d'articles dans le panier au niveau du header 