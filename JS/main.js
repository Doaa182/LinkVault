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

  if (loggedInUser.email === "" || loggedInUser.password === "") {
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
    user.firstName === "" ||
    user.lastName === "" ||
    user.email === "" ||
    user.password === ""
  ) {
    document.getElementById("invalidSignUpMsg").innerHTML =
      `<p class="text-danger text-center mb-4">All fields are required</p>`;
    return;
  }

  if (
    validateUserName(user.firstName) === false ||
    validateUserName(user.lastName) === false
  ) {
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

function validateUserName(signUpNameInpVal) {
  const userNameRegex = /^[a-zA-Z ]{1,20}$/;
  return userNameRegex.test(signUpNameInpVal);
}

document.addEventListener("DOMContentLoaded", function () {
  const currentSessionUser = JSON.parse(
    localStorage.getItem("currentSessionUser"),
  );

  if (welcomeMsg && currentSessionUser) {
    welcomeMsg.innerHTML = `<h1 class="fw-bolder text-uppercase text-white text-center">Welcome ${currentSessionUser.firstName} ${currentSessionUser.lastName}</h1>`;
  }
});

// **************************************************************************************************************** //

const categoryNameInput = document.getElementById("CategoryName");
const categoryDescInput = document.getElementById("CategoryDescription");
const addBtn = document.querySelector(".add-btn");
let categoryId = undefined;
const tableSearchWrapper = document.querySelector(".table-search-wrap");

if (localStorage.getItem("Display Category Data") != null) {
  displayAllCategories();
}

// CRUDs
async function addCategory() {
  const category = {
    categoryName: categoryNameInput.value.trim(),
    description: categoryDescInput.value.trim(),
  };

  if (category.categoryName === "" || category.description === "") {
    showModal();
    document.querySelector(".modal-body ul").innerHTML = `<li>
      <i class="fa-regular fa-circle-right p-2"></i>Both fields are required
    </li>`;

    return;
  }

  try {
    const response = await fetch(`${baseURL}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },

      body: JSON.stringify(category),
    });

    console.log("Create/Add Category Response", response);

    const data = await response.json();

    console.log("Create/Add Category Data", data);

    if (response.ok) {
      localStorage.setItem("Create/Add Category Data", JSON.stringify(data));
    } else {
      let msg = Object.values(data.errors)[0][0] || data.message || "";

      showModal();
      document.querySelector(".modal-body ul").innerHTML = `<li>
      <i class="fa-regular fa-circle-right p-2"></i>${msg}
    </li>`;
    }
  } catch (error) {
    console.error("Create/Add Category Error:", error);
    showModal();
    document.querySelector(".modal-body ul").innerHTML = `<li>
      <i class="fa-regular fa-circle-right p-2"></i>Network error. Try again.
    </li>`;
  }
}

function editForm(idx, id) {
  const allCategories = JSON.parse(
    localStorage.getItem("Display Category Data"),
  );

  categoryNameInput.value = allCategories[idx].categoryName;
  categoryDescInput.value = allCategories[idx].description;

  addBtn.innerHTML = `Edit <i class="fa-solid fa-pen-to-square"></i>`;
  addBtn.classList.add("btn-warning");
  addBtn.classList.remove("btn-success");

  categoryId = id;
}

async function editCategory() {
  const category = {
    categoryName: categoryNameInput.value.trim(),
    description: categoryDescInput.value.trim(),
  };

  try {
    const response = await fetch(`${baseURL}/api/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(category),
    });

    console.log("Edit/Update Category Response", response);

    let data;
    if (response.status === 204) {
      console.log("Success, no content returned");
      return;
    } else {
      data = await response.json();
    }

    console.log("Edit/Update Category Data", data);

    if (response.ok) {
      localStorage.setItem("Edit/Update Category Data", JSON.stringify(data));
    } else {
      let msg = Object.values(data.errors)[0][0] || data.message || "";

      showModal();
      document.querySelector(".modal-body ul").innerHTML = `<li>
      <i class="fa-regular fa-circle-right p-2"></i>${msg}
    </li>`;
    }
  } catch (error) {
    console.error("Edit/Update Category Error:", error);
    showModal();
    document.querySelector(".modal-body ul").innerHTML = `<li>
      <i class="fa-regular fa-circle-right p-2"></i>Network error. Try again.
    </li>`;
  }
  addBtn.innerHTML = `Add <i class="fa-solid fa-plus"></i>`;
  addBtn.classList.remove("btn-warning");
  addBtn.classList.add("btn-success");
}

async function deleteCategory(id) {
  try {
    const response = await fetch(`${baseURL}/api/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log("Delete Category Response", response);
    console.log("Delete Category Response Status", response.status);

    if (response.status === 204) {
      await displayAllCategories();
      return;
    } else {
      const data = await response.json();
      let msg = Object.values(data.errors)[0][0] || data.message || "";

      showModal();
      document.querySelector(".modal-body ul").innerHTML = `<li>
      <i class="fa-regular fa-circle-right p-2"></i>${msg}
    </li>`;
    }
  } catch (error) {
    console.error("Delete Category Error:", error);
    showModal();
    document.querySelector(".modal-body ul").innerHTML = `<li>
      <i class="fa-regular fa-circle-right p-2"></i>Network error. Try again.
    </li>`;
  }
}

async function addOrEdit() {
  if (validateCategoryName() === true && validateCategoryDesc() === true) {
    if (addBtn.innerHTML.includes("Add")) {
      await addCategory();
    } else if (addBtn.innerHTML.includes("Edit")) {
      await editCategory();
    }
    await displayAllCategories();
    clearForm();
  } else {
    showModal();
  }
}

function clearForm() {
  categoryNameInput.value = "";
  categoryDescInput.value = "";
  categoryId = undefined;
}

async function displayAllCategories() {
  try {
    const response = await fetch(`${baseURL}/api/categories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log("Display Category Response", response);

    const data = await response.json();

    console.log("Display Category Data", data);

    if (response.ok) {
      localStorage.setItem("Display Category Data", JSON.stringify(data));
      renderCategories(data);

      if (data.length === 0) {
        tableSearchWrapper.classList.add("d-none");
      } else {
        tableSearchWrapper.classList.remove("d-none");
      }
    } else {
      let msg = Object.values(data.errors)[0][0] || data.message || "";

      showModal();
      document.querySelector(".modal-body ul").innerHTML = `<li>
      <i class="fa-regular fa-circle-right p-2"></i>${msg}
    </li>`;
    }
  } catch (error) {
    console.error("Display Category Error:", error);
    showModal();
    document.querySelector(".modal-body ul").innerHTML = `<li>
      <i class="fa-regular fa-circle-right p-2"></i>Network error. Try again.
    </li>`;
  }
}

function renderCategories(arr) {
  let concatCategories = "";

  for (let i = 0; i < arr.length; i++) {
    concatCategories += `
      <tr>
        <td>${i + 1}</td>
        <td>${arr[i].categoryName}</td>

        <td>${arr[i].description}</td>
        <td>
      <button
        class="btn btn-warning"
        onclick="editForm(${i},${arr[i].id})">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>

      <button
        class="btn btn-danger"
        onclick="deleteCategory(${arr[i].id})">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </td>
      </tr>
    `;
  }

  document.querySelector("tbody").innerHTML = concatCategories;
}

// Modal
var modal = document.getElementById("exampleModal");

// Show modal
function showModal() {
  modal.classList.add("show", "d-block");
  modal.classList.remove("d-none", "fade");
  modal.style.backgroundColor = "rgba(0,0,0,0.5)";
}

// Hide modal
function hideModal() {
  modal.classList.remove("show", "d-block");
  modal.classList.add("d-none", "fade");
}

var closeBtn = document.querySelector(".btn-close");

// Modal Close Btn
closeBtn.addEventListener("click", hideModal);

modal.addEventListener("click", function (e) {
  if (e.target === modal) hideModal();
});

// Validation
function validateCategoryName() {
  const regex = /^[a-zA-Z0-9_]{3,}(\s+[a-zA-Z0-9_]+)*$/;
  return regex.test(categoryNameInput.value.trim());
}

function validateCategoryDesc() {
  return categoryDescInput.value.trim().length <= 300;
}

function changeInputStyle(inputElement) {
  var validateCategoryNameOrDesc =
    inputElement.id === "CategoryName"
      ? validateCategoryName()
      : validateCategoryDesc();

  if (validateCategoryNameOrDesc === true) {
    inputElement.classList.add("is-valid");
    inputElement.classList.remove("is-invalid");
  } else {
    inputElement.classList.add("is-invalid");
    inputElement.classList.remove("is-valid");
  }
}
