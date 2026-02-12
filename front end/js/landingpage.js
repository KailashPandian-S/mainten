let idElement = document.getElementById("orgId");
let passElement = document.getElementById("orgPass");
let showHideElement = document.getElementById("passShowHide");
let accessButton = document.getElementById("accessBtn");
let errorElement = document.getElementById("errorMessage");
let idErrorElement = document.getElementById("IdErrorMessage");
let passErrorElement = document.getElementById("passErrorMessage");
let modalElement = document.getElementById("orgLoginModal");
let modalSuccessElement = new bootstrap.Modal(modalElement);

showHideElement.addEventListener("click",
    function(e) {
        e.preventDefault();

        if (passElement.type === "password") {
            passElement.type = "text";
            showHideElement.textContent = "hide password";
        } else {
            passElement.type = "password";
            showHideElement.textContent = "show password";
        }

    }
);





accessButton.addEventListener("click",
    async function() {
        let reqBodyObj = {
            "orgMailId": idElement.value,
            "orgPass": passElement.value
        };
        if(idElement.value == "" || passElement.value == ""){
              errorElement.classList.add("d-block");
              return;
        }
        
        errorElement.classList.add("d-none");
        
        let requestObj = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(reqBodyObj)
        }
          //check db
       
       let fetchPromise = fetch("http://localhost:8080/auth/org/login", requestObj)
        .then(response => response.text())
        .then(responseString => {
            return responseString;
        });
       
        let responseData = await fetchPromise;
      

       console.log(responseData);

        //api call  

        let dbValidated = false;
        if(responseData ==="Success"){
            dbValidated = true;
        }
        

        
        if(dbValidated){
            localStorage.setItem("orgMailId",reqBodyObj.orgMailId);
            modalSuccessElement.show();
            
        }
        else{
            errorElement.classList.add("d-block");
            return;
        }

    }

);

idElement.addEventListener("blur",function(event){
   
    if(event.target.value === ""){
        idErrorElement.textContent = "*required";
    }else{
        idErrorElement.textContent = "";
    }
});

passElement.addEventListener("blur",function(event){
   
    if(event.target.value === ""){
        passErrorElement.textContent = "*required";
    }else{
        passErrorElement.textContent = "";
    }
}); 


function directToAdminLogin(){
    window.location.href = "adminlogin.html";
};

function directToUserLogin(){
    window.location.href = "userlogin.html";
};