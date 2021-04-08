var panier = JSON.parse(localStorage.panier);
console.log(panier);

var total = 0;

for (let element of panier) {
    if (element.quantite > 0) {
        let parent = document.getElementById("container");
        parent.insertAdjacentHTML('beforeend', `
        <div class="panier__ctn__article">
        <img src="${element.imageUrl}" alt="">
        <h3>${element.name}</h3>
        <input type="number" id="${element._id}" min="0" value="${element.quantite}" onchange="changeQuantité(id)">
        <p id="total${element._id}">${(element.price * element.quantite / 100).toFixed(2)}€</p>
    </div>
    `)

        total += (element.price * element.quantite / 100);
    }

}

let parent = document.getElementById("container");
parent.insertAdjacentHTML('beforeend', `
        <h2 class="panier__ctn__total">TOTAL : ${total.toFixed(2)} €</h2> 
    `);

document.getElementById("total").innerHTML = `TOTAL : ${total.toFixed(2)} €`;


function test() {
    console.log("test");
};

function changeQuantité(id) {
    let panierBefore = JSON.parse(localStorage.panier);

    for (let element of panierBefore) {
        if (element._id === id) {
            element.quantite = document.getElementById(`${id}`).value;
            document.getElementById(`total${id}`).textContent=`${(element.price * element.quantite / 100).toFixed(2)}€`
            document.getElementById("total").textContent = `TOTAL : ${total.toFixed(2)} €`;
        }
    }
    localStorage.setItem("panier",JSON.stringify(panierBefore));

};