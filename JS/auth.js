function redirectToSignIn() {
  if (
    !localStorage.getItem("token") &&
    !window.location.pathname.includes("index.html") &&
    window.location.pathname !== "/" &&
    !window.location.pathname.includes("sign_up.html")
  ) {
    // window.location.href = "./index.html";
    window.location.replace("./index.html");
  }
}

function redirectToHome() {
  if (
    localStorage.getItem("token") &&
    (window.location.pathname.includes("index.html") ||
      window.location.pathname === "/" ||
      window.location.pathname.includes("sign_up.html"))
  ) {
    // window.location.href = "./home_page.html";
    window.location.replace("./home_page.html");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  redirectToHome();
});

// ref: https://www.jwt.io/
function getUserEmailFromJWT(token) {
  try {
    const payload = token.split(".")[1];

    const payloadInJson = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );

    return (
      payloadInJson[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ] || null
    );
  } catch (err) {
    console.error("getUserEmailFromJWT() Error", err);
    return null;
  }
}

/*******************************************************************************************************/
const signInEmailInput = document.getElementById("signInEmail");
const signInPassInput = document.getElementById("signInPass");

const signUpFirstNameInput = document.getElementById("signUpFirstName");
const signUpLastNameInput = document.getElementById("signUpLastName");
const signUpEmailInput = document.getElementById("signUpEmail");
const signUpPassInput = document.getElementById("signUpPass");

const welcomeMsg = document.getElementById("welcomeMsg");

async function signIn() {
  const loggedInUser = {
    email: signInEmailInput.value.trim(),
    password: signInPassInput.value,
  };

  if (!loggedInUser.email || !loggedInUser.password) {
    showAuthMsg("invalidSignInMsg", "All fields are required", "danger");

    return;
  }

  try {
    const data = await apiRequest(
      "/api/auth/login",
      "POST",
      loggedInUser,
      false,
    );

    localStorage.setItem("token", data.token);

    showAuthMsg("invalidSignInMsg", "Successfully logged in.", "success");

    // window.open("./home_page.html", "_self");
    // window.location.href = "./home_page.html";
    window.location.replace("./home_page.html");

    // else {
    //       const msg = data.message || "";

    //       document.getElementById("invalidSignInMsg").innerHTML =
    //         `<p class="text-danger text-center mb-4">${msg}</p>`;
    //     }
  } catch (error) {
    console.error("Sign In Error:", error);

    showAuthMsg("invalidSignInMsg", "Login failed", "danger");
  }
}

async function signUp() {
  const user = {
    firstName: signUpFirstNameInput.value.trim(),
    lastName: signUpLastNameInput.value.trim(),
    email: signUpEmailInput.value.trim(),
    password: signUpPassInput.value,
  };

  if (!user.firstName || !user.lastName || !user.email || !user.password) {
    showAuthMsg("invalidSignUpMsg", "All fields are required.", "danger");
    return;
  }

  if (!validateUserName(user.firstName) || !validateUserName(user.lastName)) {
    showAuthMsg(
      "invalidSignUpMsg",
      "Please enter a valid name (only letters and spaces, 1-20 characters).",
      "danger",
    );

    return;
  }

  try {
    const data = await apiRequest("/api/auth/register", "POST", user, false);

    localStorage.setItem("token", data.token);

    // localStorage.setItem(
    //   "currentSessionUser",
    //   JSON.stringify({
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     email: user.email,
    //   }),
    // );

    showAuthMsg(
      "invalidSignUpMsg",
      "Account created! You can now log in.",
      "success",
    );
    // window.open("./index.html", "_self");
    // window.open("./home_page.html", "_self");
    // window.location.href = "./home_page.html";
    window.location.replace("./home_page.html");

    //else{   document.getElementById("invalidSignUpMsg").innerHTML =
    //         `<p class="text-danger text-center mb-4">${msg}</p>`;
    //    }
  } catch (error) {
    console.error("Sign Up Error:", error);

    showAuthMsg("invalidSignUpMsg", "Signup failed", "danger");
  }
}

// function signOut() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("currentSessionUser");
//   // window.open("./index.html", "_self");
//   window.location.href = "./index.html";
// }

function validateUserName(signUpNameInpVal) {
  const userNameRegex = /^[a-zA-Z ]{1,20}$/;
  return userNameRegex.test(signUpNameInpVal);
}

document.addEventListener("DOMContentLoaded", function () {
  // const currentSessionUser = JSON.parse(
  //   localStorage.getItem("currentSessionUser"),
  // );

  // if (welcomeMsg && currentSessionUser) {
  //   welcomeMsg.innerHTML = `<h1 class="fw-bolder text-uppercase text-white text-center">Welcome ${currentSessionUser.firstName} ${currentSessionUser.lastName}</h1>`;
  // } else
  if (welcomeMsg) {
    welcomeMsg.innerHTML = `<h1 class="fw-bolder text-uppercase text-white text-center">Welcome</h1>`;
  }

  const isCategoriesPage = window.location.pathname.includes("categories.html");

  if (isCategoriesPage) {
    displayAllCategories();
  }
});
