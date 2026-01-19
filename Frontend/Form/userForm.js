import { validateUsername, validateEmail, validatePassword } from "./validation.js";

const wrapper = document.getElementById('formwrapper');
const signUpForm = document.querySelector(".userForm")
const loginForm = document.getElementById("userForm");

const username = document.getElementById("username");
const email = document.getElementById("email");
const Loginemail = document.getElementById("Loginemail")
const password = document.getElementById("password");
const Loginpassword = document.getElementById("Loginpassword")

const usernameError = document.getElementById("usernameError");
const signupEmailError = document.getElementById("signupEmailError");
const signupPasswordError = document.getElementById("signupPasswordError");
const loginEmailError = document.getElementById("loginEmailError");
const loginPasswordError = document.getElementById("loginPasswordError")

username.addEventListener("input", () =>{
    const value = username.value.trim();
    usernameError.textContent = validateUsername(value)? "": "Username must be 3-15 letters or numbers";
});

email.addEventListener("input", ()=>{
    const value = email.value.trim();
    signupEmailError.textContent = validateEmail(value)? "": "Enter a valid email";
});
Loginemail.addEventListener("input", () =>{
    const value = Loginemail.value.trim();
    loginEmailError.textContent = validateEmail(value)? "": "Enter a valid email"
})
password.addEventListener("input", ()=>{
    const value = password.value.trim();
    signupPasswordError.textContent = validatePassword(value)? "" : "Password must be strong";
});
Loginpassword.addEventListener("input", ()=>{
    const value = Loginpassword.value.trim();
    loginPasswordError.textContent = validatePassword(value)? "" : "Password must be strong";
});

signUpForm.addEventListener("submit", function (e){
    e.preventDefault();

    let valid = true;

    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!validateUsername (usernameValue)){
        usernameError.textContent = "Invalid username";
        valid = false;
    }

    if (!validateEmail(emailValue)){
        signupEmailError.textContent = "Invalid email";
        valid = false;

    }

    if (!validatePassword(passwordValue)){
        signupPasswordError.textContent = "Invalid Password";
        valid = false;
    }

    if (!valid) return;
    alert("SignUp form submitted successfully")

  signUpForm.reset();
  usernameError.textContent = "";
  signupEmailError.textContent = "";
  signupPasswordError.textContent = "";
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let valid = true;

  const emailValue = Loginemail.value.trim();
  const passwordValue = Loginpassword.value.trim();

  if (!validateEmail(emailValue)) {
    loginEmailError.textContent = "Invalid email";
    valid = false;
  }

  if (!validatePassword(passwordValue)) {
    loginPasswordError.textContent = "Invalid password";
    valid = false;
  }

  if (!valid) return;

  alert("Login form submitted successfully!");
  // loginForm.submit();  // Uncomment when connecting to backend

  loginForm.reset();
  loginEmailError.textContent = "";
  loginPasswordError.textContent = "";
});


        const togglebtn = document.getElementById('togglebtn');
        const toggleHeading = document.getElementById('toggleHeading');
        const toggleText = document.getElementById('toggleText');

        togglebtn.addEventListener('click',  ()=> {
            wrapper.classList.toggle('active');

            if (wrapper.classList.contains('active')){
                toggleHeading.textContent = "Already have an account?";
                toggleText.textContent = "Login to your account";
                togglebtn.textContent = "Login";
            }
            else{
                toggleHeading.textContent = "Don't have an account?";
                toggleText.textContent = "Sign up to get started!"
                togglebtn.textContent = "Sign Up"
            }
        })