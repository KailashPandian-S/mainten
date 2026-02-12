let itemsNavLinkElement = document.getElementById("itemNav");
let dashboardNavLink = document.getElementById("dashboardNav");
let errorMessage = document.getElementById("errorMessage");
let contentElement = document.getElementById("contents");
let userNameElement = document.getElementById("userName");
let requestsNavLinkElement = document.getElementById("requestNav");
let orgDashboardNavLinkElement = document.getElementById("orgDashboardNav");
let spinnerElement = document.getElementById("spinner");
spinnerElement.style.display = "none";
let orgEntities = [];
let userDashboard = [];
let addRequests = [];
let orgDashboard = [];

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
    let newStr = "";
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


async function clearAllOrgDashboard(){
    orgDashboard = [];
    userDashboard = [];
    contentElement.textContent = "";
    let requestObj = {
        'method': 'DELETE',
        'headers': {    
            'Content-Type': 'application/json'
        }
    }   
    let response = await fetch(`http://localhost:8080/dashboard/org?orgId=${orgId}`, requestObj);
    displayContentsOfOrgDashBoard();
    showClearAlert();
}


async function getUserDashBoardFromDb(userName) {
    //api call to get user dashboard from db based on user
    // spinnerElement.style.display = "block";
    let requestObj = {
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json'
        }
    }
    let response = await fetch(`http://localhost:8080/dashboard?orgId=${orgId}&userId=${userName}`, requestObj);
    userDashboard =await response.json();
    console.log(userDashboard);
    // spinnerElement.style.display = "none";
}


async function getAllRequestsFromDb(orgn)  {
    //api call to get user dashboard from db based on user
    // spinnerElement.style.display = "block";
    let requestObj = {
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json'
        }
    }
    let response = await fetch(`http://localhost:8080/request?orgId=${orgId}`, requestObj);
    addRequests = await response.json();
    console.log(addRequests);
    // spinnerElement.style.display = "none";
}

async function getOrgDashBoardFromDb(orgn){
   let requestObj = {
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json'
        }
    }
    let response = await fetch(`http://localhost:8080/dashboard/org?orgId=${orgId}`, requestObj);
    orgDashboard =await response.json();
    console.log(orgDashboard);

    //fetch org dashboard data from db
}     

async function initPage() {
  try {
    spinnerElement.style.display = "block";
    await getAllOrgEntitiesFromDb(userDetails["organisation"]);
    await getUserDashBoardFromDb(userDetails["user"]);
    await getAllRequestsFromDb(userDetails["organisation"]);
    await getOrgDashBoardFromDb(userDetails["organisation"]);
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

function showClearAlert(){
    const alertBox = document.getElementById("clearAlert");
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

function showDeclineAlert() {
    const alertBox = document.getElementById("requestFailiureAlert");
    alertBox.style.display = "block";   
    setTimeout(() => {
        alertBox.style.display = "none";
    }, 2000);
}

function addNewItem(obj,adminReq = false) {

    //request to add new item into org
   
    let nwObj = {};
    nwObj["orgId"] = orgId;
    nwObj["itemName"] = obj["itemName"];
    nwObj["user"] = userDetails["user"];
    console.log(nwObj);
    console.log("adding new item");
    acceptAddRequest(nwObj,adminReq);
    showRequestSuccessAlert();
    displayContentsOfItems();

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
    let requestObj = {
        "dashboardItemId": 0,
        "dashboardItemName": obj["item"],
        "quantity": obj["quantity"],
        "addedDate": obj["date"],
    };
    console.log(requestObj);
    const response = await fetch(`http://localhost:8080/dashboard?orgId=${orgId}&userId=${userDetails["user"]}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestObj)
        }
    ); 


    //update userDashBoard
    userDashboard.push(requestObj);
    orgDashboard.push(requestObj);
    


}

async function acceptAddRequest(obj, adminReq = false) {
    let date = new Date();
    let formattedDate = String(date.getDate()).padStart(2, "0") + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        date.getFullYear();
    console.log("admin request:", adminReq);
     let requestBodyObj = {
        "itemId" : 0,
        "itemName": obj["itemName"],
        "orgId" : orgId,
        "addedDate": formattedDate
    };

    console.log(requestBodyObj);
    await fetch("http://localhost:8080/items?orgId=" + orgId, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBodyObj)
    });
     orgEntities.push(requestBodyObj);
     displayContentsOfItems();
    console.log("item added to org entities");
    if(adminReq) return;
    let requestObj = {
        'method': 'DELETE',
        'headers': {    
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBodyObj)
    }   
    await fetch(`http://localhost:8080/request?orgId=${orgId}`, requestObj);
   
}


async function declineAddRequest(obj) {
    console.log("declined request");
    showDeclineAlert();
    let requestBodyObj = {
        "itemId" : 0,
        "itemName": obj["itemName"],
        "orgId" : orgId,
        "addedDate": ''
    };
    let requestObj = {
        'method': 'DELETE',
        'headers': {    
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBodyObj)
    }   
    await fetch(`http://localhost:8080/request?orgId=${orgId}`, requestObj);


    };




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
        addNewItem(obj,true);
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




function addWarningModal() {

  const modal = document.createElement("div");
  modal.id = "warningModal";
  modal.className = "modal fade show";
  modal.style.display = "block";

  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title warning-model-style" style = "font-size:20px">Warning</h5>
          <button type="button" class="close-btn btn btn-danger">&times;</button>
        </div>

        <div class="modal-body">
          <p class="warning-model-style">Are you sure you want to clear everything?</p>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary cancel-btn warning-model-style">Cancel</button>
          <button type="button" class="btn btn-danger confirm-btn warning-model-style">Clear</button>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // confirm
  modal.querySelector(".confirm-btn").addEventListener("click", () => {
    clearAllOrgDashboard();
    modal.remove();
  });

  // cancel
  modal.querySelector(".cancel-btn").addEventListener("click", () => {
    modal.remove();
  });

  // close icon
  modal.querySelector(".close-btn").addEventListener("click", () => {
    modal.remove();
  });
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
    contentElement.textContent = "";
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
    // contentElement.textContent = "";
    if (userDashboard.length === 0) {
        errorMessage.classList.remove("d-none");
        return;
    }
    errorMessage.classList.add("d-none");
    for (let obj of userDashboard) {
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

function displayContentsOfOrgDashBoard() {
    // contentElement.textContent = "";
    if (orgDashboard.length === 0) {
        errorMessage.classList.remove("d-none");
        return;
    }
    errorMessage.classList.add("d-none");
    for (let obj of orgDashboard) {
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

    let buttonContainerOd = document.createElement("div");
    let clearButtonElement = document.createElement("button");
    clearButtonElement.setAttribute("data-bs-toggle", "modal");
    clearButtonElement.setAttribute("data-bs-target", "#warningModal");
    clearButtonElement.textContent = "clear";
    clearButtonElement.type = "button";
    let estimateButtonElement = document.createElement("button");
    estimateButtonElement.textContent = "estimate";
    estimateButtonElement.type = "button";
    buttonContainerOd.classList.add("d-flex","flex-row", "justify-content-end","mr-3","mt-3");
    clearButtonElement.classList.add("btn", "btn-danger", "add-button-card","mr-3");
    estimateButtonElement.classList.add("btn", "btn-info", "add-button-card");
    estimateButtonElement.addEventListener("click", function() {
        window.open(`http://localhost:8080/estimate?orgId=${orgId}`);
    });
    buttonContainerOd.appendChild(clearButtonElement);
    clearButtonElement.onclick = addWarningModal;
    buttonContainerOd.appendChild(estimateButtonElement);
    contentElement.appendChild(buttonContainerOd);
    

}


function displayContentsOfRequests() {
    //  contentElement.textContent = "";
    if(addRequests.length === 0) {
        errorMessage.classList.remove("d-none");
        return; 
    }
    

    errorMessage.classList.add("d-none");
    for(let req of addRequests)
    {
    let cardContainer = document.createElement("div");
    cardContainer.setAttribute("id", removeSpaces(req["itemName"])+"reqCard");
    let cardPara = document.createElement("p");
    cardPara.textContent = req["itemName"];
    let buttonElement = document.createElement("button");
    buttonElement.textContent = "✔";
    buttonElement.type = "button";
    let buttonElement2 = document.createElement("button");
    buttonElement2.textContent = "x";
    buttonElement2.type = "button";
    cardContainer.classList.add("item-card", "shadow-sm", "d-flex", "flex-row");
    cardPara.classList.add("item-name-card");
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("ml-auto");
    buttonElement.classList.add("btn", "btn-success", "add-button-card","mr-3");
    buttonElement2.classList.add("btn", "btn-danger", "add-button-card");
    buttonElement.addEventListener("click", function() {
        //approve request
        let cardToRemove = document.getElementById(removeSpaces(req["itemName"])+"reqCard");
        let entityName = cardToRemove.firstChild.textContent;
        let obj = {
            "itemName": entityName
        };
        acceptAddRequest(obj);
        cardToRemove.remove();
        let removedReqIndex = addRequests.indexOf(req);
        if(removedReqIndex > -1){
            addRequests.splice(removedReqIndex,1);
        }
        showRequestSuccessAlert()
    });
    buttonElement2.addEventListener("click", function() {
        //deny request
        let cardToRemove = document.getElementById(removeSpaces(req["itemName"])+"reqCard");
        declineAddRequest(req);
        let removedReqIndex = addRequests.indexOf(req);
        if(removedReqIndex > -1){
            addRequests.splice(removedReqIndex,1);
        }
        cardToRemove.remove();
    });
    cardContainer.appendChild(cardPara);
    buttonContainer.appendChild(buttonElement);
    buttonContainer.appendChild(buttonElement2);
    cardContainer.appendChild(buttonContainer);
    contentElement.appendChild(cardContainer);

    } 
 

}

itemsNavLinkElement.addEventListener("click", function() {
    contentElement.textContent = "";
    itemsNavLinkElement.classList.add("active");
    dashboardNavLink.classList.remove("active");
    requestsNavLinkElement.classList.remove("active");
    orgDashboardNavLinkElement.classList.remove("active");
    displayContentsOfItems();
});


dashboardNavLink.addEventListener("click", function() {
    contentElement.textContent = "";
    itemsNavLinkElement.classList.remove("active");
    dashboardNavLink.classList.add("active");
    requestsNavLinkElement.classList.remove("active");
    orgDashboardNavLinkElement.classList.remove("active");
    displayContentsOfDashBoard();

});


requestsNavLinkElement.addEventListener("click", function() {
    contentElement.textContent = "";
    itemsNavLinkElement.classList.remove("active");
    dashboardNavLink.classList.remove("active");
    requestsNavLinkElement.classList.add("active");
    orgDashboardNavLinkElement.classList.remove("active");
    displayContentsOfRequests();
    });



orgDashboardNavLinkElement.addEventListener("click", function() {
    contentElement.textContent = "";
    itemsNavLinkElement.classList.remove("active");
    dashboardNavLink.classList.remove("active");
    requestsNavLinkElement.classList.remove("active");
    orgDashboardNavLinkElement.classList.add("active");
    displayContentsOfOrgDashBoard();
    });

