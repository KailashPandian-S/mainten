let idElement = document.getElementById("orgId");
let passElement = document.getElementById("orgPass");
let showHideElement = document.getElementById("passShowHide");
let accessButton = document.getElementById("accessBtn");
let errorElement = document.getElementById("errorMessage");
let idErrorElement = document.getElementById("IdErrorMessage");
let passErrorElement = document.getElementById("passErrorMessage");
let orgId = localStorage.getItem("orgMailId");

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




//user login 
accessButton.addEventListener("click",
   async function() {
        let reqBodyObj = {
            "userMailId": idElement.value,
            "userPass": passElement.value,
            "userType": "admin",
            "userOrg" : orgId
        };

        if(idElement.value == "" || passElement.value == ""){
              errorElement.classList.add("d-block");
              return;
        }
        
        errorElement.classList.add("d-none");
    

      

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
        fetch("http://localhost:8080/auth/user/login", requestObj)
        .then(response => response.text())
        .then(responseString => {
            return responseString
        });

        let responseData = await fetchPromise;


        //login if valid direct to admin home page 
        let dbValidated = false; //temp
        if(responseData === "Success"){
            dbValidated = true;
        }
        if(dbValidated){
            let userDetails = {
                "user" : reqBodyObj.userMailId,
                "organisation" : orgId,
                "type": reqBodyObj.userType
            }
            let userDetailsString = JSON.stringify(userDetails);   
            localStorage.setItem("userDetails",userDetailsString);
            window.location.href = "homeadmin.html";
        }
        else{
            errorElement.classList.add("d-block");
            return;
        }
        

        console.log(reqBodyObj);


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
