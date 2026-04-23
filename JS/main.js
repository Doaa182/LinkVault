const signInEmailInput = document.getElementById("signInEmail");
const signInPassInput = document.getElementById("signInPass");

const signUpFirstNameInput = document.getElementById("signUpFirstName");
const signUpLastNameInput = document.getElementById("signUpLastName");
const signUpEmailInput = document.getElementById("signUpEmail");
const signUpPassInput = document.getElementById("signUpPass");

const welcomeMsg = document.getElementById("welcomeMsg");
const baseURL = "http://linkvaultapi.runasp.net";

async function signIn() {
  const loggedInUser = {
    email: signInEmailInput.value.trim(),
    password: signInPassInput.value,
  };

  if (loggedInUser.email == "" || loggedInUser.password == "") {
    document.getElementById("invalidSignInMsg").innerHTML =
      `<p class="text-danger text-center mb-4">All fields are required</p>`;
    return;
  }

  try {
    const response = await fetch(`${baseURL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loggedInUser),
    });

    console.log("Sign In Response", response);

    const data = await response.json();

    console.log("Sign In Data", data);

    if (response.ok) {
      localStorage.setItem("token", data.token);

      document.getElementById("invalidSignInMsg").innerHTML =
        `<p class="text-success text-center mb-4">Successfully logged in.</p>`;

      window.open("./home_page.html", "_self");
    } else {
      const msg = data.message || "";

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
  const user = {
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
    const response = await fetch(`${baseURL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    console.log("Sign Up Response", response);

    const data = await response.json();

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
  const userNameRegex = /^[a-zA-Z ]{1,20}$/;
  return userNameRegex.test(signUpNameInput.value);
}

document.addEventListener("DOMContentLoaded", function () {
  const currentSessionUser = JSON.parse(
    localStorage.getItem("currentSessionUser"),
  );

  if (currentSessionUser != null) {
    welcomeMsg.innerHTML = `<h1 class="fw-bolder text-uppercase text-white text-center">Welcome ${currentSessionUser.firstName} ${currentSessionUser.lastName}</h1>`;
  }
});
