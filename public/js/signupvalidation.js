const username = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("pass");
const confirmpass = document.getElementById("cpass");

const form = document.getElementById("signupform");
const erro = document.querySelector(".error-message");
const passErro = document.querySelector(".error-msg");
const regex = document.querySelector(".password-error");
const emailErro = document.querySelector(".email-message");
// console.log(email.value)
const passReq = document.querySelector(".error-pass");
const empthyEmail = document.querySelector(".error-email");
const nameError=document.querySelector(".error-name")
form.addEventListener("submit", (e) => {
  // e.preventDefault();

  validateInputs(e);
});

const validateInputs = (e) => {
  const nameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passValue = password.value.trim();
  const cpassValue = confirmpass.value.trim();

  if (nameValue === "" ) {
    erro.style.display = "block";
    e.preventDefault();
  }
  if(nameValue.length<3){
    nameError.style.display="block"
    e.preventDefault();

  }
  function isValidEmail(emails) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emails);
  } 
  
  if (emailValue === "") {
    empthyEmail.style.display = "block";
    e.preventDefault()
  }else{


 
  if (!isValidEmail(emailValue)) {
    emailErro.style.display = "block";
    e.preventDefault();
  }
  }

  if (passValue != cpassValue) {
    passErro.style.display = "block";
    e.preventDefault();
  }

  function isValidPassword(password) {
    const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/;
      return passwordRegex.test(password);
  }
  if(passValue===""){
    passReq.style.display="block"
    e.preventDefault()
  }else{
    if (!isValidPassword(passValue)) {
      regex.style.display = "block";
      e.preventDefault();
    }
    
  }

 
};
