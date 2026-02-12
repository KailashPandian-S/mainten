let idElement = document.getElementById("orgId");
let passElement = document.getElementById("orgPass");
let passConfirmationElement  = document.getElementById("orgPassConfirmation");
let showHideElement = document.getElementById("passShowHide");
let accessButton = document.getElementById("accessBtn");
let errorElement = document.getElementById("errorMessage");
let idErrorElement = document.getElementById("IdErrorMessage");
let passErrorElement = document.getElementById("passErrorMessage");
let passConfirmationErrorElement = document.getElementById("passConfirmationErrorMessage");
let orgId = localStorage.getItem("orgMailId");






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
        errorElement.classList.add("d-none");
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
    async function() {



        if(passConfirmationElement.value != passElement.value){
            errorElement.classList.remove("d-none");
            errorElement.textContent = "passwords do not match";
            return; 
        }

        let reqBodyObj = {
            "userMailId": idElement.value,
            "userPass": passElement.value,
             "userType" : "member",
             "userOrg" : orgId
        };

        console.log(reqBodyObj);

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


        //check db
        //api call  

        let requestObj = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(reqBodyObj)
        }
          //check db
        let fetchPromise =
        fetch("http://localhost:8080/auth/user/register", requestObj)
        .then(response => response.text())
        .then(responseString => {
            return responseString
        });

        let responseData = await fetchPromise;
        console.log(responseData);
        let validToProceed = false;
        if(responseData === "Success"){
            validToProceed = true;
        }
        if(validToProceed){
            let userDetails = {
                "user" : reqBodyObj.userMailId,
                "organisation" : orgId,
                "type": reqBodyObj.userType
            }
            let userDetailsString = JSON.stringify(userDetails);   
            localStorage.setItem("userDetails",userDetailsString);
            window.location.href = "homeuser.html";
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
