let idElement = document.getElementById("orgId");
let passElement = document.getElementById("orgPass");
let passConfirmationElement  = document.getElementById("orgPassConfirmation");
let showHideElement = document.getElementById("passShowHide");
let accessButton = document.getElementById("accessBtn");
let errorElement = document.getElementById("errorMessage");
let idErrorElement = document.getElementById("IdErrorMessage");
let passErrorElement = document.getElementById("passErrorMessage");
let passConfirmationErrorElement = document.getElementById("passConfirmationErrorMessage");







function validatePasswords(){
        if(passElement.value.length < 6){
            errorElement.classList.remove("d-none");
            errorElement.textContent = "password must be at least 6 characters long";
            return false;
        }
        let numberFound = false;
        let upperCaseFound = false;
        let lowerCaseFound = false;
        for(let c of passElement.value){
            if(c === ' '){
                errorElement.classList.remove("d-none");
                errorElement.textContent = "password cannot contain spaces";
                return false;
            }
            else if(!isNaN(c)){
                numberFound = true;
            }                   
           else if(c === c.toUpperCase() && isNaN(c)){
                upperCaseFound = true;
            }
            if(c === c.toLowerCase() && isNaN(c)){
                lowerCaseFound = true;
            }
        }

        if(!numberFound || !upperCaseFound || !lowerCaseFound){
            errorElement.classList.remove("d-none");
            errorElement.textContent = "password must contain one uppercase letter, one lowercase letter and one number";
            return false;
        }
        return true;
}   



showHideElement.addEventListener("click",
    function(e) {
        e.preventDefault();

        if (passElement.type === "password") {
            passElement.type = "text";
            passConfirmationElement.type = "text";
            showHideElement.textContent = "hide password";
        } else {
            passElement.type = "password";
            passConfirmationElement.type = "password";
            showHideElement.textContent = "show password";
        }

    }
);



accessButton.addEventListener("click",
    async  function() {
        if(passConfirmationElement.value != passElement.value){
            errorElement.classList.remove("d-none");
            errorElement.textContent = "passwords do not match";
            return; 
        }

        let reqBodyObj = {
            "orgMailId": idElement.value,
            "orgPass": passElement.value
        };

        if(idElement.value == "" || passElement.value == ""){
              errorElement.classList.remove("d-none");
              errorElement.textContent = "please fill all the fields";
              return;
        }

        let validPass = validatePasswords();
        if(!validPass){
            passElement.value = "";
            passConfirmationElement.value = "";
            return;
        }


      
        errorElement.classList.add("d-none");
        idElement.value = "";
        passElement.value = "";
        passConfirmationElement.value = "";

        let requestObj = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(reqBodyObj)
        }

        //check db
     
        let fetchPromise =
        fetch("http://localhost:8080/auth/org/register", requestObj)
        .then(response => response.text())
        .then(responseString => {
            return responseString
        });

        let responseData = await fetchPromise;


        //check db
        //api call  
        //need to check if org id already exists

        let canProceed = false;
        if(responseData === "Success"){
            canProceed = true;
        }
        if(canProceed){
            localStorage.setItem("orgMailId",reqBodyObj.orgMailId);
            window.location.href = "adminregister.html";
        }
        else{
            errorElement.classList.remove("d-none");
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

passConfirmationElement.addEventListener("blur",function(event){
   
    if(event.target.value === ""){      
        passConfirmationErrorElement.textContent = "*required";
    }
    else{
        passConfirmationErrorElement.textContent = "";
    }   
});
