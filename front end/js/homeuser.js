let itemsNavLinkElement = document.getElementById("itemNav");
let dashboardNavLink = document.getElementById("dashboardNav");
let errorMessage = document.getElementById("errorMessage");
let contentElement = document.getElementById("contents");
let userNameElement = document.getElementById("userName");
let spinnerElement = document.getElementById("spinner");
spinnerElement.style.display = "none";
let orgEntities = [];
let userDashBoard = [];
// let temp = {
//     "user": "xyz@gmail.com",
//     "organisation": "xyzorg",
// }

// temp = JSON.stringify(temp);
// localStorage.setItem("userDetails", temp)
let userDetails = localStorage.getItem("userDetails");
userDetails = JSON.parse(userDetails);
console.log(userDetails);
let orgId = userDetails["organisation"];

userNameElement.textContent = userDetails["user"];


function removeSpaces(str){
    newStr = "";
    for(let char of str){
        if(char !== " "){
            newStr += char;
        }
    }
    return newStr;

}

async function getAllOrgEntitiesFromDb(orgn) {
    //api call to get entities from db based on orgnization
    // spinnerElement.style.display = "block";
    let requestObj = {
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json'
        }
    }

  const response = await fetch(`http://localhost:8080/items?orgId=${orgn}`,requestObj);
   orgEntities = await response.json();
   console.log(orgEntities);
//    spinnerElement.style.display = "none";
 
}


// async function samplegetAllOrgEntitiesFromDb(orgn) {
//     //api call to get entities from db based on orgnization
//     let requestObj = {
//         'method': 'GET',
//         'headers': {
//             'Content-Type': 'application/json'
//         }
//     }

//     const response = await fetch(`http://localhost:8080/items?orgId=${orgn}`);
//    orgEntities = await response.json();
//    console.log(orgEntities);
 
// }

// samplegetAllOrgEntitiesFromDb("sampleorg@gmail.com");


async function getUserDashBoardFromDb(userName,orgId) {
    //api call to get user dashboard from db based on user
    // spinnerElement.style.display = "block";
    let requestObj = {
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json'
        }
    }
    let response = await fetch(`http://localhost:8080/dashboard?orgId=${orgId}&userId=${userName}`, requestObj);
    userDashBoard =await response.json();
    console.log(userDashBoard);
    // spinnerElement.style.display = "none";
}

async function initPage() {
  try {
    spinnerElement.style.display = "block";

    await getAllOrgEntitiesFromDb(userDetails["organisation"]);
    await getUserDashBoardFromDb(userDetails["user"], userDetails["organisation"]);

    displayContentsOfItems(); 

  } catch (e) {
    console.error(e);
  } finally {
    spinnerElement.style.display = "none";
  }
}

initPage();





function showSuccess() {
    const alertBox = document.getElementById("successAlert");
    alertBox.style.display = "block";

    setTimeout(() => {
        alertBox.style.display = "none";
    }, 2000);
}

function showRequestSuccessAlert() {
    const alertBox = document.getElementById("requestSuccessAlert");
    alertBox.style.display = "block";

    setTimeout(() => {
        alertBox.style.display = "none";
    }, 2000);
}

async function addNewItem(obj) {

    //request to add new item into org
    let date = new Date();
    let formattedDate = String(date.getDate()).padStart(2, "0") + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        date.getFullYear();
    obj["date"] = formattedDate;
    obj["organisation"] = orgId;
    obj["user"] = userDetails["user"];
    //api call post request
    let reqBodyObj = {
        "itemId" : 1,
        "itemName": obj["itemName"],
        "orgId" : orgId,
        "addedDate": obj["date"],
    }
    console.log(reqBodyObj);
    console.log("adding new item request");
    let requestObj = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(reqBodyObj)
    }
    let response = fetch(`http://localhost:8080/request?orgId=${orgId}`, requestObj);
    
    console.log(response);
    showRequestSuccessAlert();

}

async function addNewFault(obj) {
    //update dashboard 
    //add faults
    let date = new Date();
    let formattedDate = String(date.getDate()).padStart(2, "0") + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        date.getFullYear();

    obj["date"] = formattedDate;
    obj["organisation"] = orgId;
    obj["user"] = userDetails["user"];
    console.log(obj);
    showSuccess();
    //update db 
    let reqBodyObj = {
        "dashboardItemId" : 0,
        "dashboardItemName" : obj["item"],
        "quantity" : obj["quantity"],
        "addedDate" : obj["date"]
    }
    let requestObj = {
        'method': 'POST',
        'headers': {   
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(reqBodyObj)
    }
    let response = fetch(`http://localhost:8080/dashboard?orgId=${orgId}&userId=${userDetails["user"]}`, requestObj);
    //update userDashBoard
    console.log(response);
    console.log(obj);
    userDashBoard.push(reqBodyObj);


}




function addItemModal(entityName) {
    let modalElement = document.createElement("div");
    modalElement.classList.add("modal-styles");
    modalElement.classList.add("modal", "fade");
    modalElement.id = entityName + "modal";
    modalElement.setAttribute("tabindex", "-1");
    modalElement.setAttribute("aria-hidden", "true");

    let modalDialogContainer = document.createElement("div");
    modalDialogContainer.classList.add("modal-dialog");

    let modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-content");

    let modalHeaderContainer = document.createElement("div");
    modalHeaderContainer.classList.add("modal-header");

    let modalTitleHeading = document.createElement("h5");
    modalTitleHeading.classList.add("modal-title");
    modalTitleHeading.textContent = "add item";

    let closeButton = document.createElement("button");
    closeButton.classList.add("close");
    closeButton.setAttribute("data-dismiss", "modal");
    closeButton.innerHTML = "<span>&times;</span>";

    modalHeaderContainer.appendChild(modalTitleHeading);
    modalHeaderContainer.appendChild(closeButton);

    /* ---------- MODAL BODY ---------- */
    let modalBodyContainer = document.createElement("div");
    modalBodyContainer.classList.add("modal-body");

    let itemNamePara = document.createElement("p");
    itemNamePara.classList.add("quantity-modal");
    itemNamePara.textContent = "Item Name : ";

    let itemNameInput = document.createElement("input");
    itemNameInput.type = "text";
    itemNameInput.classList.add("item-name-input");


    itemNamePara.appendChild(itemNameInput);
    modalBodyContainer.appendChild(itemNamePara);

    /* ---------- MODAL FOOTER ---------- */
    let modalFooterContainer = document.createElement("div");
    modalFooterContainer.classList.add("modal-footer");



    let addBtn = document.createElement("button");
    addBtn.classList.add("btn", "btn-primary", "d-none");
    addBtn.setAttribute("data-dismiss", "modal");
    addBtn.textContent = "Add";

    itemNameInput.addEventListener("keyup", function() {

        if (itemNameInput.value === "") addBtn.classList.add("d-none");
        else addBtn.classList.remove("d-none");
    });
    addBtn.addEventListener("click", function() {
        let obj = {
            "itemName": itemNameInput.value
        };
        itemNameInput.value = "";
        addNewItem(obj);
    });

    modalFooterContainer.appendChild(addBtn);

    /* ---------- ASSEMBLE MODAL ---------- */
    modalContainer.appendChild(modalHeaderContainer);
    modalContainer.appendChild(modalBodyContainer);
    modalContainer.appendChild(modalFooterContainer);

    modalDialogContainer.appendChild(modalContainer);
    modalElement.appendChild(modalDialogContainer);
    document.body.appendChild(modalElement);
}







function addModal(entityName) {
    let modalElement = document.createElement("div");
    modalElement.classList.add("modal-styles");
    modalElement.classList.add("modal", "fade");
    modalElement.id = removeSpaces(entityName) + "modal";
    modalElement.setAttribute("tabindex", "-1");
    modalElement.setAttribute("aria-hidden", "true");

    let modalDialogContainer = document.createElement("div");
    modalDialogContainer.classList.add("modal-dialog");

    let modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-content");

    let modalHeaderContainer = document.createElement("div");
    modalHeaderContainer.classList.add("modal-header");

    let modalTitleHeading = document.createElement("h5");
    modalTitleHeading.classList.add("modal-title");
    modalTitleHeading.textContent = entityName;

    let closeButton = document.createElement("button");
    closeButton.classList.add("close");
    closeButton.setAttribute("data-dismiss", "modal");
    closeButton.innerHTML = "<span>&times;</span>";

    modalHeaderContainer.appendChild(modalTitleHeading);
    modalHeaderContainer.appendChild(closeButton);

    /* ---------- MODAL BODY ---------- */
    let modalBodyContainer = document.createElement("div");
    modalBodyContainer.classList.add("modal-body");

    let quantityPara = document.createElement("p");
    quantityPara.classList.add("quantity-modal");
    quantityPara.textContent = "quantity : ";

    let quantityInput = document.createElement("input");
    quantityInput.type = "text";
    quantityInput.classList.add("quantity-input");
    quantityInput.addEventListener("keyup",
        function(e) {
            if (e.key === "Backspace" || e.key === "Enter") return;
            if (!((e.key >= "0" && e.key <= "9"))) {
                alert("Quantity should be a number");
                quantityInput.value = "";
            }
        }

    );

    quantityPara.appendChild(quantityInput);
    modalBodyContainer.appendChild(quantityPara);

    /* ---------- MODAL FOOTER ---------- */
    let modalFooterContainer = document.createElement("div");
    modalFooterContainer.classList.add("modal-footer");



    let addBtn = document.createElement("button");
    addBtn.classList.add("btn", "btn-primary");
    addBtn.setAttribute("data-dismiss", "modal");
    addBtn.textContent = "Add";
    addBtn.addEventListener("click", function() {
        let obj = {
            "item": modalTitleHeading.textContent,
            "quantity": parseInt(quantityInput.value)
        };
        quantityInput.value = "";
        addNewFault(obj);
    });

    modalFooterContainer.appendChild(addBtn);

    /* ---------- ASSEMBLE MODAL ---------- */
    modalContainer.appendChild(modalHeaderContainer);
    modalContainer.appendChild(modalBodyContainer);
    modalContainer.appendChild(modalFooterContainer);

    modalDialogContainer.appendChild(modalContainer);
    modalElement.appendChild(modalDialogContainer);
    document.body.appendChild(modalElement);
}

function createAndAppendContentOfItems(e) {
    let entityName = e;
    let cardContainer = document.createElement("div");
    let cardPara = document.createElement("p");
    cardPara.textContent = e;
    let buttonElement = document.createElement("button");
    buttonElement.textContent = "+";
    buttonElement.setAttribute("data-toggle", "modal");
    buttonElement.setAttribute("data-target", "#" + removeSpaces(entityName) + "modal");
    buttonElement.type = "button";
    addModal(entityName);
    cardContainer.classList.add("item-card", "shadow-sm", "d-flex", "flex-row");
    cardPara.classList.add("item-name-card");
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("ml-auto");
    buttonElement.classList.add("btn", "btn-info", "add-button-card");
    cardContainer.appendChild(cardPara);
    buttonContainer.appendChild(buttonElement);
    cardContainer.appendChild(buttonContainer);
    contentElement.appendChild(cardContainer);
}

function displayContentsOfItems() {
    let addItemButtonContainer = document.createElement("div");
    let additemButton = document.createElement("button");
    additemButton.textContent = "Add";
    additemButton.setAttribute("data-toggle", "modal");
    additemButton.setAttribute("data-target", "#addItemmodal");
    additemButton.type = "button";
    addItemModal("addItem");
    additemButton.classList.add("btn", "btn-warning");
    addItemButtonContainer.classList.add("add-item-button-container", "text-right");
    addItemButtonContainer.appendChild(additemButton);
    contentElement.appendChild(addItemButtonContainer);


    if (orgEntities.length === 0) {
        errorMessage.classList.remove("d-none");
        return;
    }
    errorMessage.classList.add("d-none");
    for (let e of orgEntities) {
        createAndAppendContentOfItems(e["itemName"]);
    }


}

function displayContentsOfDashBoard() {
    if (userDashBoard.length === 0) {
        errorMessage.classList.remove("d-none");
        return;
    }
    errorMessage.classList.add("d-none");
    for (let obj of userDashBoard) {
        //here 
        let cardContainer = document.createElement("div");
        let cardPara = document.createElement("p");
        let cardDate = document.createElement("p");
        let cardTextContainer = document.createElement("div");
        cardTextContainer.classList.add("d-flex", "flex-column");
        cardDate.textContent = obj["addedDate"];
        cardPara.textContent = obj["dashboardItemName"];
        let quantityElement = document.createElement("p");
        quantityElement.textContent = "qty :" + obj["quantity"];
        cardContainer.classList.add("item-card", "shadow-sm", "d-flex", "flex-row");
        cardPara.classList.add("item-name-card");
        cardDate.classList.add("item-date-card");
        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("ml-auto");
        quantityElement.classList.add("item-name-card");
        cardTextContainer.appendChild(cardPara);
        cardTextContainer.appendChild(cardDate);
        cardContainer.appendChild(cardTextContainer);
        buttonContainer.appendChild(quantityElement);
        cardContainer.appendChild(buttonContainer);
        contentElement.appendChild(cardContainer);


    }
}


itemsNavLinkElement.addEventListener("click", function() {
    contentElement.textContent = "";
    itemsNavLinkElement.classList.add("active");
    dashboardNavLink.classList.remove("active");
    displayContentsOfItems();
});


dashboardNavLink.addEventListener("click", function() {
    contentElement.textContent = "";
    itemsNavLinkElement.classList.remove("active");
    dashboardNavLink.classList.add("active");
    displayContentsOfDashBoard();

});
