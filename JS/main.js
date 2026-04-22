var allUsers = [];

if (localStorage.getItem("allUsers") != null) {
  allUsers = JSON.parse(localStorage.getItem("allUsers"));
}

var signInEmailInput = document.getElementById("signInEmail");
var signInPassInput = document.getElementById("signInPass");

var signUpNameInput = document.getElementById("signUpName");
var signUpEmailInput = document.getElementById("signUpEmail");
var signUpPassInput = document.getElementById("signUpPass");

var welcomeMsg = document.getElementById("welcomeMsg");

var isExist = false;
var isFound = undefined;
var isPassCorrect = undefined;

function signIn() {
  var idx = undefined;

  if (signInEmailInput.value != "" && signInPassInput.value != "") {
    for (var i = 0; i < allUsers.length; i++) {
      if (
        allUsers[i].email == signInEmailInput.value &&
        allUsers[i].password == signInPassInput.value
      ) {
        isFound = true;
        isPassCorrect = true;
        idx = i;
        break;
      } else if (
        allUsers[i].email == signInEmailInput.value &&
        allUsers[i].password != signInPassInput.value
      ) {
        isFound = undefined;
        isPassCorrect = false;
      } else if (
        allUsers[i].email != signInEmailInput.value &&
        allUsers[i].password != signInPassInput.value
      ) {
        isFound = false;
        isPassCorrect = undefined;
      }
    }

    if (isFound == true && isPassCorrect == true) {
      document.getElementById(
        "invalidSignInMsg"
      ).innerHTML = `<p class="text-success text-center mb-4">Successfully logged in.</p>`;

      // localStorage.setItem("storedUserName", allUsers[idx].name);
      localStorage.setItem("currentSessionUser", JSON.stringify(allUsers[idx]));

      window.open("./home_page.html", "_self");
    } else if (isFound == false && isPassCorrect == undefined) {
      document.getElementById(
        "invalidSignInMsg"
      ).innerHTML = `<p class="text-danger text-center mb-4">No account found with this email. Please sign up first.</p>`;
    } else if (isFound == undefined && isPassCorrect == false) {
      document.getElementById(
        "invalidSignInMsg"
      ).innerHTML = `<p class="text-danger text-center mb-4">Incorrect password. Please try again</p>`;
    } else if (isFound == undefined && isPassCorrect == undefined) {
      document.getElementById(
        "invalidSignInMsg"
      ).innerHTML = `<p class="text-danger text-center mb-4">No account found with this email. Please sign up first.</p>`;
    }
  } else if (signInEmailInput.value == "" && signInPassInput.value != "") {
    document.getElementById(
      "invalidSignInMsg"
    ).innerHTML = `<p class="text-danger text-center mb-4">Email is required!</p>`;
  } else if (signInEmailInput.value != "" && signInPassInput.value == "") {
    document.getElementById(
      "invalidSignInMsg"
    ).innerHTML = `<p class="text-danger text-center mb-4">Password is required!</p>`;
  } else if (signInEmailInput.value == "" && signInPassInput.value == "") {
    document.getElementById(
      "invalidSignInMsg"
    ).innerHTML = `<p class="text-danger text-center mb-4">Email and Password are required!</p>`;
  }
}

function signUp() {
  var user = {
    name: signUpNameInput.value,
    email: signUpEmailInput.value,
    password: signUpPassInput.value,
  };

  if (user.email != "" && user.password != "" && user.name != "") {
    if (
      validateUserName() == true &&
      validateUserEmail() == true &&
      validateUserPassword() == true
    ) {
      if (allUsers != null) {
        for (var i = 0; i < allUsers.length; i++) {
          if (allUsers[i].email == user.email) {
            isExist = true;
            break;
          }
        }
      }
      if (isExist == false) {
        allUsers.push(user);
        localStorage.setItem("allUsers", JSON.stringify(allUsers));
        document.getElementById(
          "invalidSignUpMsg"
        ).innerHTML = `<p class="text-success text-center mb-4">Account created! You can now log in.</p>`;
        window.open("./index.html", "_self");
      } else if (isExist == true) {
        document.getElementById(
          "invalidSignUpMsg"
        ).innerHTML = `<p class="text-danger text-center mb-4">Email already exists. Log in if you have an account.</p>`;
      }
    } else if (
      validateUserName() != true &&
      validateUserEmail() == true &&
      validateUserPassword() == true
    ) {
      document.getElementById(
        "invalidSignUpMsg"
      ).innerHTML = `<p class="text-danger text-center mb-4">Please enter a valid name (only letters and spaces, at least 2 characters).</p>`;
    } else if (
      validateUserName() == true &&
      validateUserEmail() != true &&
      validateUserPassword() == true
    ) {
      document.getElementById(
        "invalidSignUpMsg"
      ).innerHTML = `<p class="text-danger text-center mb-4">Please enter a valid email address (e.g., example@domain.com).</p>`;
    } else if (
      validateUserName() == true &&
      validateUserEmail() == true &&
      validateUserPassword() != true
    ) {
      document.getElementById(
        "invalidSignUpMsg"
      ).innerHTML = `<p class="text-danger text-center mb-4">Please enter a valid password (at least 8 characters).</p>`;
    } else if (
      validateUserName() == true &&
      validateUserEmail() != true &&
      validateUserPassword() != true
    ) {
      document.getElementById("invalidSignUpMsg").innerHTML = `
      <p class="text-danger text-center mb-4">Email must be in a correct format (e.g., example@domain.com)</p>
      <p class="text-danger text-center mb-4">Password must be at least 8 characters long</p>
      `;
    } else if (
      validateUserName() != true &&
      validateUserEmail() == true &&
      validateUserPassword() != true
    ) {
      document.getElementById("invalidSignUpMsg").innerHTML = `
      <p class="text-danger text-center mb-4">Name must contain only letters and spaces, and be at least 2 characters</p>
      <p class="text-danger text-center mb-4">Password must be at least 8 characters long</p>
      `;
    } else if (
      validateUserName() != true &&
      validateUserEmail() != true &&
      validateUserPassword() == true
    ) {
      document.getElementById("invalidSignUpMsg").innerHTML = `
      <p class="text-danger text-center mb-4">Name must contain only letters and spaces, and be at least 2 characters</p>
      <p class="text-danger text-center mb-4">Email must be in a correct format (e.g., example@domain.com)</p>
      `;
    } else if (
      validateUserName() != true &&
      validateUserEmail() != true &&
      validateUserPassword() != true
    ) {
      document.getElementById("invalidSignUpMsg").innerHTML = `
      <p class="text-danger text-center mb-4">Name must contain only letters and spaces, and be at least 2 characters</p>
      <p class="text-danger text-center mb-4">Email must be in a correct format (e.g., example@domain.com)</p>
      <p class="text-danger text-center mb-4">Password must be at least 8 characters long</p>
      `;
    }
  } else if (user.email == "" && user.password != "" && user.name != "") {
    document.getElementById(
      "invalidSignUpMsg"
    ).innerHTML = `<p class="text-danger text-center mb-4">Email is required!</p>`;
  } else if (user.email != "" && user.password == "" && user.name != "") {
    document.getElementById(
      "invalidSignUpMsg"
    ).innerHTML = `<p class="text-danger text-center mb-4">Password is required!</p>`;
  } else if (user.email != "" && user.password != "" && user.name == "") {
    document.getElementById(
      "invalidSignUpMsg"
    ).innerHTML = `<p class="text-danger text-center mb-4">Name is required!</p>`;
  } else if (user.email == "" && user.password == "" && user.name == "") {
    document.getElementById(
      "invalidSignUpMsg"
    ).innerHTML = `<p class="text-danger text-center mb-4">Name, Email, and Password are required!</p>`;
  } else if (user.email == "" && user.password == "" && user.name != "") {
    document.getElementById(
      "invalidSignUpMsg"
    ).innerHTML = `<p class="text-danger text-center mb-4">Email and Password are required!</p>`;
  } else if (user.email != "" && user.password == "" && user.name == "") {
    document.getElementById(
      "invalidSignUpMsg"
    ).innerHTML = `<p class="text-danger text-center mb-4">Name and Password are required!</p>`;
  } else if (user.email == "" && user.password != "" && user.name == "") {
    document.getElementById(
      "invalidSignUpMsg"
    ).innerHTML = `<p class="text-danger text-center mb-4">Name and Email are required!</p>`;
  }
}

function signOut() {
  localStorage.removeItem("currentSessionUser");
  window.open("./index.html", "_self");
}

function validateUserName() {
  var userNameRegex = /^[a-zA-Z ]{2,}$/;
  return userNameRegex.test(signUpNameInput.value);
}

function validateUserEmail() {
  var userEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net|org)$/;
  return userEmailRegex.test(signUpEmailInput.value.trim());
}

function validateUserPassword() {
  var userPassRegex = /^.{8,}$/;
  return userPassRegex.test(signUpPassInput.value);
}

document.addEventListener("DOMContentLoaded", function () {
  // var storedUserName = localStorage.getItem("storedUserName");

  // if (storedUserName != null && welcomeMsg != null) {
  //   welcomeMsg.innerHTML = `<h1 class="fw-bolder text-uppercase text-white">Welcome ${storedUserName}</h1>`;
  // }

  var currentSessionUser = JSON.parse(
    localStorage.getItem("currentSessionUser")
  );

  if (currentSessionUser != null) {
    welcomeMsg.innerHTML = `<h1 class="fw-bolder text-uppercase text-white text-center">Welcome ${currentSessionUser.name}</h1>`;
  }
});
