import './index.css';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";

const appSettings = {
    databaseURL: process.env.DATABASE_URL
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const flashMessageEl = document.getElementById('flash-message');
const shoppingListUlEl = document.getElementById('shopping-list');


onValue(shoppingListInDB, function(snapshot) {
    
    if (snapshot.exists()){
        const shoppingListArray = Object.entries(snapshot.val());
        clearShoppingCartEl();
        
        for (let index = 0; index < shoppingListArray.length; index++) {
            const currentItem = shoppingListArray[index];

            addItemToShoppingEl(currentItem);
        }
    } else {
        shoppingListUlEl.innerHTML = 'No Items here... yet';
    }

    
});

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;

    push(shoppingListInDB, inputValue)

    clearInputEl();
});


function clearInputEl() {
    inputFieldEl.value = '';
}

function clearShoppingCartEl() {
    shoppingListUlEl.innerHTML = '';
}

function addItemToShoppingEl(currentItem) {

    let itemValue = currentItem[1];
    let itemID = currentItem[0];

    let li = document.createElement('li');
    li.style.listStyleType = 'none';
    li.innerText = itemValue;
    li.setAttribute('id', itemID);

    li.addEventListener('click', function(event) {
        let itemID = event.target.id;
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);
    });

    shoppingListUlEl.appendChild(li);
}
