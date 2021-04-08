localStorage.setItem("id",0);

var products = []; // Contient la liste des produits
var panier = []; // Contient le panier et la quantitée

// Utiliser Fetch
var request = new XMLHttpRequest(); // On crée un nouvel objet de type  XMLHttpRequest  qui correspond à notre objet AJAX. C'est grâce à lui qu'on va créer et envoyer notre requête 
request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        let response = JSON.parse(this.responseText);
        products = response;
        panier = products;
        panierInit()
        for(let element of products){
             addHtml(element)
         }
    }
};
request.open("GET", "http://localhost:3000/api/teddies"); // On demande à ouvrir une connexion vers un service web. C'est ici que l'on précise quelle méthode HTTP on souhaite, ainsi que l'URL du service web
request.send(); // on envoie finalement la requête au service web


  // Function add HTML
const addHtml = (element) => {
    var parent = document.getElementById("container");
    parent.insertAdjacentHTML('beforeend', `
    <div class="article__container__box">
    <img class="article__container__box__img" src="${element.imageUrl}" alt="image produit">
    <h2 class="article__container__box__title">${element.name}</h2>
    <p class="article__container__box__price">${(element.price / 100).toFixed(2)}€</p>
    <button class="article__container__box__btn article__container__box__btn--add" onclick="addPanier('${element._id}')">Ajouter au panier</button>
    <a class="article__container__box__btn" href="./html/produit.html" onmouseover="localId('${element._id}')">Détails</a>
    </div> 
`);
};

function localId(id){
    localStorage.setItem("id",id);
}

function panierInit () {
    if(products.quantite === null){
        for(const product of panier){
            product.quantite = 0;
        }
        localStorage.setItem("panier",JSON.stringify(panier));
        console.log(JSON.parse(localStorage.panier));
    };
    

};

function addPanier(id){
    console.log("Add : " + id);
    let panierBefore = JSON.parse(localStorage.panier);
    console.log(panierBefore);
    for(let element of panierBefore){

        if (element._id == id){
            element.quantite += 1;
        }
        
    }
    localStorage.setItem("panier",JSON.stringify(panierBefore));
}






