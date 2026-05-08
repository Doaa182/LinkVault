document.addEventListener("DOMContentLoaded", function () {
  redirectToSignIn();

  if (localStorage.getItem("token")) {
    getUserEmailFromJWT(localStorage.getItem("token"));
    console.log(
      "User Email:",
      getUserEmailFromJWT(localStorage.getItem("token")),
    );
  }
});

const categoryNameInput = document.getElementById("CategoryName");
const categoryDescInput = document.getElementById("CategoryDescription");

const addBtn = document.querySelector(".add-btn");
let categoryId = null;
const tableSearchWrapper = document.querySelector(".table-search-wrap");
let isEditMode = false;
let categories = [];

// CRUDs
async function addCategory() {
  const category = {
    categoryName: categoryNameInput.value.trim(),
    description: categoryDescInput.value.trim(),
  };

  // if (!category.categoryName || !category.description) {
  //   showErrMsg("Both fields are required");
  //   return false;
  // }

  try {
    await apiRequest("/api/categories", "POST", category, true);
    // await displayAllCategories();
    // clearForm();
    return true;
  } catch (error) {
    console.error("Create/Add Category Error:", error);
    return false;
  }
}

function editForm(idx) {
  // const allCategories = JSON.parse(
  //   localStorage.getItem("Display Category Data"),
  // );

  categoryNameInput.value = categories[idx].categoryName;
  categoryDescInput.value = categories[idx].description;

  addBtn.innerHTML = `Edit <i class="fa-solid fa-pen-to-square"></i>`;
  isEditMode = true;
  addBtn.classList.add("btn-warning");
  addBtn.classList.remove("btn-success");

  // categoryId = id;
  categoryId = categories[idx].id;
}

async function editCategory() {
  const category = {
    categoryName: categoryNameInput.value.trim(),
    description: categoryDescInput.value.trim(),
  };

  try {
    await apiRequest(`/api/categories/${categoryId}`, "PUT", category, true);

    // await displayAllCategories();
    // clearForm();
    resetEditUI();

    return true;
  } catch (error) {
    console.error("Edit/Update Category Error:", error);
    return false;
  }
}

function resetEditUI() {
  addBtn.innerHTML = `Add <i class="fa-solid fa-plus"></i>`;
  isEditMode = false;
  addBtn.classList.remove("btn-warning");
  addBtn.classList.add("btn-success");
  categoryId = null;
}

async function deleteCategory(id) {
  try {
    await apiRequest(`/api/categories/${id}`, "DELETE", null, true);
    await displayAllCategories();
  } catch (error) {
    console.error("Delete Category Error:", error);
  }
}

async function addOrEdit() {
  if (validateCategoryName() === true && validateCategoryDesc() === true) {
    // if (addBtn.innerHTML.includes("Add")) {
    //   await addCategory();
    // } else if (addBtn.innerHTML.includes("Edit")) {
    //   await editCategory();
    // }

    let success = false;

    if (isEditMode) {
      success = await editCategory();
    } else {
      success = await addCategory();
    }

    if (!success) {
      showErrMsg("Add/Edit failed. Please try again.");
      return;
    } else {
      await displayAllCategories();
      clearForm();
    }
  } else {
    showModal();
  }
}

function clearForm() {
  categoryNameInput.value = "";
  categoryDescInput.value = "";
}

async function displayAllCategories() {
  try {
    const data = await apiRequest("/api/categories", "GET", null, true);

    if (!Array.isArray(data)) {
      throw new Error("Invalid format");
    }
    // localStorage.setItem("Display Category Data", JSON.stringify(data));
    categories = data;
    renderCategories(data);

    if (data.length === 0) {
      tableSearchWrapper.classList.add("d-none");
    } else {
      tableSearchWrapper.classList.remove("d-none");
    }
  } catch (error) {
    console.error("Display Category Error:", error);
    showErrMsg("Could not load categories. Please try again.");
    if (tableSearchWrapper) {
      tableSearchWrapper.classList.add("d-none");
    }
  }
}

function renderCategories(arr) {
  const tbody = document.querySelector("tbody");
  if (!tbody) return;
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
        onclick="editForm(${i})">
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

  tbody.innerHTML = concatCategories;
}

// Validation
function validateCategoryName() {
  const value = categoryNameInput.value.trim();
  const regex = /^[a-zA-Z0-9_]{3,}(\s+[a-zA-Z0-9_]+)*$/;
  return regex.test(value) && value.length >= 1 && value.length <= 100;
}

function validateCategoryDesc() {
  return (
    categoryDescInput.value.trim().length <= 300 &&
    categoryDescInput.value.trim().length >= 1
  );
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
