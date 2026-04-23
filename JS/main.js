var signInEmailInput = document.getElementById("signInEmail");
var signInPassInput = document.getElementById("signInPass");

var signUpFirstNameInput = document.getElementById("signUpFirstName");
var signUpLastNameInput = document.getElementById("signUpLastName");
var signUpEmailInput = document.getElementById("signUpEmail");
var signUpPassInput = document.getElementById("signUpPass");

var welcomeMsg = document.getElementById("welcomeMsg");
const baseURL = "http://linkvaultapi.runasp.net";

async function signIn() {
  var loggedInUser = {
    email: signInEmailInput.value.trim(),
    password: signInPassInput.value,
  };

  if (loggedInUser.email == "" || loggedInUser.password == "") {
    document.getElementById("invalidSignInMsg").innerHTML =
      `<p class="text-danger text-center mb-4">All fields are required</p>`;
    return;
  }

  try {
    let response = await fetch(`${baseURL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loggedInUser),
    });

    console.log("Sign In Response", response);

    let data = await response.json();

    console.log("Sign In Data", data);

    if (response.ok) {
      localStorage.setItem("token", data.token);

      document.getElementById("invalidSignInMsg").innerHTML =
        `<p class="text-success text-center mb-4">Successfully logged in.</p>`;

      window.open("./home_page.html", "_self");
    } else {
      let msg = data.message || "";

      document.getElementById("invalidSignInMsg").innerHTML =
        `<p class="text-danger text-center mb-4">${msg}</p>`;
    }
  } catch (error) {
    console.error("Sign In Error:", error);
    document.getElementById("invalidSignInMsg").innerHTML =
      `<p class="text-danger text-center mb-4">Network error. Try again.</p>`;
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
      localStorage.setItem(
        "currentSessionUser",
        JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }),
      );

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
  localStorage.removeItem("token");
  localStorage.removeItem("currentSessionUser");
  window.open("./index.html", "_self");
}

function validateUserName(signUpNameInput) {
  var userNameRegex = /^[a-zA-Z ]{1,20}$/;
  return userNameRegex.test(signUpNameInput.value);
}

document.addEventListener("DOMContentLoaded", function () {
  var currentSessionUser = JSON.parse(
    localStorage.getItem("currentSessionUser"),
  );

  if (currentSessionUser != null) {
    welcomeMsg.innerHTML = `<h1 class="fw-bolder text-uppercase text-white text-center">Welcome ${currentSessionUser.firstName} ${currentSessionUser.lastName}</h1>`;
  }
});

// /api/auth/login

// {
//     "token": "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjlhZTJjYWMxLTkyOTYtNGE4Ni05NmU2LTFjOTBlN2VjOTU5ZiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImRkZGQzQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NzY5ODY5NDQsImlzcyI6IkxpbmsgVmF1bHQgQXBpIiwiYXVkIjoiTGluayBWYWx1dCBDbGllbnQifQ.4Kuu1BITnBXs1Q0QeOIFzOf01sAteoYv1RVcBW3zhxkpde2hcd5-TIpj2_IFslfom3NAeu_37wlL0MYDyYBf0w"
// }

// {
//     "statusCode": 400,
//     "message": "Invalid email or password."
// }
