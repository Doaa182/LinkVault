var allUsers = [];

if (localStorage.getItem("allUsers") != null) {
  allUsers = JSON.parse(localStorage.getItem("allUsers"));
}

var signInEmailInput = document.getElementById("signInEmail");
var signInPassInput = document.getElementById("signInPass");

//name for first only
//validateUserName for first only
var signUpFirstNameInput = document.getElementById("signUpFirstName");
var signUpLastNameInput = document.getElementById("signUpLastName");
var signUpEmailInput = document.getElementById("signUpEmail");
var signUpPassInput = document.getElementById("signUpPass");

var welcomeMsg = document.getElementById("welcomeMsg");
const baseURL = "http://linkvaultapi.runasp.net";

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
      document.getElementById("invalidSignInMsg").innerHTML =
        `<p class="text-success text-center mb-4">Successfully logged in.</p>`;

      // localStorage.setItem("storedUserName", allUsers[idx].name);
      localStorage.setItem("currentSessionUser", JSON.stringify(allUsers[idx]));

      window.open("./home_page.html", "_self");
    } else if (isFound == false && isPassCorrect == undefined) {
      document.getElementById("invalidSignInMsg").innerHTML =
        `<p class="text-danger text-center mb-4">No account found with this email. Please sign up first.</p>`;
    } else if (isFound == undefined && isPassCorrect == false) {
      document.getElementById("invalidSignInMsg").innerHTML =
        `<p class="text-danger text-center mb-4">Incorrect password. Please try again</p>`;
    } else if (isFound == undefined && isPassCorrect == undefined) {
      document.getElementById("invalidSignInMsg").innerHTML =
        `<p class="text-danger text-center mb-4">No account found with this email. Please sign up first.</p>`;
    }
  } else if (signInEmailInput.value == "" && signInPassInput.value != "") {
    document.getElementById("invalidSignInMsg").innerHTML =
      `<p class="text-danger text-center mb-4">Email is required!</p>`;
  } else if (signInEmailInput.value != "" && signInPassInput.value == "") {
    document.getElementById("invalidSignInMsg").innerHTML =
      `<p class="text-danger text-center mb-4">Password is required!</p>`;
  } else if (signInEmailInput.value == "" && signInPassInput.value == "") {
    document.getElementById("invalidSignInMsg").innerHTML =
      `<p class="text-danger text-center mb-4">Email and Password are required!</p>`;
  }
}

async function signUp() {
  var user = {
    firstName: signUpFirstNameInput.value.trim(),
    lastName: signUpLastNameInput.value.trim(),
    email: signUpEmailInput.value.trim(),
    password: signUpPassInput.value,
  };

  if (
    user.firstName == "" ||
    user.lastName == "" ||
    user.email == "" ||
    user.password == ""
  ) {
    document.getElementById("invalidSignUpMsg").innerHTML =
      `<p class="text-danger text-center mb-4">All fields are required</p>`;
    return;
  }

  if (!validateUserName(user.firstName) || !validateUserName(user.lastName)) {
    document.getElementById("invalidSignUpMsg").innerHTML =
      `<p class="text-danger text-center mb-4">Please enter a valid name (only letters and spaces, 1-20 characters).</p>`;
    return;
  }

  try {
    let response = await fetch(`${baseURL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    console.log("Sign Up Response", response);

    let data = await response.json();

    console.log("Sign Up Data", data);

    if (response.ok) {
      localStorage.setItem("token", data.token);

      document.getElementById("invalidSignUpMsg").innerHTML =
        `<p class="text-success text-center mb-4">Account created! You can now log in.</p>`;

      window.open("./index.html", "_self");
    } else {
      let msg = "";

      if (data.message) {
        msg = data.message;
      } else if (data.errors) {
        msg = Object.values(data.errors)[0][0];
      }

      document.getElementById("invalidSignUpMsg").innerHTML =
        `<p class="text-danger text-center mb-4">${msg}</p>`;
    }
  } catch (error) {
    console.error("Sign Up Error:", error);
    document.getElementById("invalidSignUpMsg").innerHTML =
      `<p class="text-danger text-center mb-4">Network error. Try again.</p>`;
  }
}

function signOut() {
  localStorage.removeItem("currentSessionUser");
  window.open("./index.html", "_self");
}

function validateUserName(signUpNameInput) {
  var userNameRegex = /^[a-zA-Z ]{1,20}$/;
  return userNameRegex.test(signUpNameInput.value);
}

document.addEventListener("DOMContentLoaded", function () {
  // var storedUserName = localStorage.getItem("storedUserName");

  // if (storedUserName != null && welcomeMsg != null) {
  //   welcomeMsg.innerHTML = `<h1 class="fw-bolder text-uppercase text-white">Welcome ${storedUserName}</h1>`;
  // }

  var currentSessionUser = JSON.parse(
    localStorage.getItem("currentSessionUser"),
  );

  if (currentSessionUser != null) {
    welcomeMsg.innerHTML = `<h1 class="fw-bolder text-uppercase text-white text-center">Welcome ${currentSessionUser.firstName} ${currentSessionUser.lastName}</h1>`;
  }
});

// /api/auth/register

// {
//     "statusCode": 400,
//     "message": "Passwords must have at least one non alphanumeric character., Passwords must have at least one uppercase ('A'-'Z')."
// }

// {
//     "token": "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjM3MmI3NDM3LTFkN2MtNDdmMy1hNTAwLTgxNTZiOWU2YjA3YiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImRkZGRAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVXNlciIsImV4cCI6MTc3Njk3MTY3MSwiaXNzIjoiTGluayBWYXVsdCBBcGkiLCJhdWQiOiJMaW5rIFZhbHV0IENsaWVudCJ9.NBFvZNJdF1qP60OSMq-kfYX8yzjFwBrlUz7OTFCB33ufZKBhNiFbU3dyjTCxpJfxJk6qSNhoCnWlvdo2PBQGEg"
// }

// {
//     "statusCode": 409,
//     "message": "Email already exists."
// }

// {
//     "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
//     "title": "One or more validation errors occurred.",
//     "status": 400,
//     "errors": {
//         "Email": [
//             "The Email field is required.",
//             "The Email field is not a valid e-mail address."
//         ]
//     },
//     "traceId": "00-4115a24f1fe5a5131c86743be430df7b-2e0c1c3c4bb7034d-00"
// }
