// - DEFINITION DES VARIABLES -
//   ************************
let total = document.getElementById("total");
let idCommande = document.getElementById("idCommande");

var storageTotal = JSON.parse(localStorage.PriceOfCommand);
var storageidCommande = localStorage.idOfCommand;

// - DEFINITION DES FONCTIONS -
//   ************************

// Affichage de la commande
function displayCommand() {
    total.textContent = `Total : ${storageTotal.toFixed(2)} €`;
    idCommande.textContent = `Numéro de commande : ${storageidCommande}`;
}

// - APPEL DES FONCTIONS -
//   *******************

displayCommand()
window.localStorage.clear();