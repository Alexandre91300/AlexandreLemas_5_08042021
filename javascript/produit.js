var idOfProduct = localStorage.id;


var product = [];

var request = new XMLHttpRequest(); // On crée un nouvel objet de type  XMLHttpRequest  qui correspond à notre objet AJAX. C'est grâce à lui qu'on va créer et envoyer notre requête 
request.onreadystatechange = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        let response = JSON.parse(this.responseText);
        product = response;
        console.log(product);
        productHtml(product);

    }
};
request.open("GET", `http://localhost:3000/api/teddies/${idOfProduct}`);
request.send(); // on envoie finalement la requête au service web


function productHtml(element) {
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


    for (const color of element.colors) {
        let container = document.getElementById("selectColor");
        container.insertAdjacentHTML('beforeend', `
                    <option>${color}</option>
`);
    }
};

function addPanier(id){
    let panierBefore = JSON.parse(localStorage.panier);
    var quantité = document.getElementById("quantité").value ;
    console.log(quantité);

    for(let element of panierBefore){

        if (element._id == id){
            element.quantite += quantité;
        }
        
    }
    localStorage.setItem("panier",JSON.stringify(panierBefore));
}
