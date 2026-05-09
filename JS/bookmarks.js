const titleInput = document.getElementById("bookmarkTitle");
const urlInput = document.getElementById("bookmarkUrl");
const categorySelect = document.getElementById("bookmarkCategory");

const tbody = document.getElementById("bookmarksTableBody");
const tableWrapper = document.querySelector(".table-search-wrap");
const emptyBookmarksState = document.querySelector(".emptyBookmarksState");

const addBtn = document.querySelector(".add-btn");
const filterCategory = document.getElementById("filterCategory");
const filterSearch = document.getElementById("filterSearch");
const filterFavorite = document.getElementById("filterFavorite");
const filterArchived = document.getElementById("filterArchived");

let bookmarks = [];
let categories = [];

let isEditMode = false;
let bookmarkId = null;

async function loadCategories() {
  try {
    const data = await apiRequest("/api/categories", "GET", null, true);

    categories = data;

    categorySelect.innerHTML = data
      .map((c) => `<option value="${c.id}">${c.categoryName}</option>`)
      .join("");

    filterCategory.innerHTML = `
      <option value="">All Categories</option>
      ${data.map((c) => `<option value="${c.id}">${c.categoryName}</option>`).join("")}
    `;
  } catch (err) {
    console.error("Categories error:", err);
  }
}

// CRUDs
async function addBookmark() {
  const bookmark = {
    title: titleInput.value.trim(),
    url: urlInput.value.trim(),
    categoryId: Number(categorySelect.value),
  };

  if (
    !validateBookmarkTitle() ||
    !validateBookmarkUrl() ||
    !validateBookmarkCategory()
  ) {
    showErrMsg("Please fill all fields correctly");
    return;
  }

  try {
    await apiRequest("/api/bookmarks", "POST", bookmark, true);
    clearForm();
    return true;
  } catch (err) {
    console.error("Add bookmark error:", err);
    return false;
  }
}

function clearForm() {
  titleInput.value = "";
  urlInput.value = "";
  categorySelect.selectedIndex = 0;
}

async function displayAllBookmarks() {
  try {
    const data = await apiRequest("/api/bookmarks", "GET", null, true);

    bookmarks = data;

    renderBookmarks(data);
    // renderBookmarks([...data].reverse());

    if (data.length === 0) {
      tableWrapper.classList.add("d-none");
      emptyBookmarksState.classList.remove("d-none");
    } else {
      tableWrapper.classList.remove("d-none");
      emptyBookmarksState.classList.add("d-none");
    }
  } catch (err) {
    console.error("Bookmarks error:", err);
  }
}

async function toggleFavorite(id) {
  const bookmark = bookmarks.find((b) => b.id === id);
  if (!bookmark) return;

  bookmark.isFavorite = !bookmark.isFavorite;

  renderBookmarks(bookmarks);

  const updatedBookmark = {
    url: bookmark.url,
    title: bookmark.title,
    categoryId: bookmark.categoryId,
    isFavorite: bookmark.isFavorite,
    isArchived: bookmark.isArchived,
  };

  try {
    await apiRequest(`/api/bookmarks/${id}`, "PUT", updatedBookmark, true);
  } catch (err) {
    bookmark.isFavorite = !bookmark.isFavorite;
    renderBookmarks(bookmarks);
    console.error(err);
  }
}

async function toggleArchived(id) {
  const bookmark = bookmarks.find((b) => b.id === id);
  if (!bookmark) return;

  bookmark.isArchived = !bookmark.isArchived;

  renderBookmarks(bookmarks);

  const updatedBookmark = {
    url: bookmark.url,
    title: bookmark.title,
    categoryId: bookmark.categoryId,
    isFavorite: bookmark.isFavorite,
    isArchived: bookmark.isArchived,
  };

  try {
    await apiRequest(`/api/bookmarks/${id}`, "PUT", updatedBookmark, true);
  } catch (err) {
    bookmark.isArchived = !bookmark.isArchived;
    renderBookmarks(bookmarks);
    console.error(err);
  }
}

window.openBookmark = function (id) {
  window.location.href = `bookmark_details.html?id=${id}`;
};

function renderBookmarks(arr) {
  if (!tbody) return;

  let concatBookmarks = "";

  for (let i = 0; i < arr.length; i++) {
    concatBookmarks += `
      <tr>
        <td>${arr.length - i}</td>

        <td>
          

         

           <a href="${arr[i].url}" target="_blank">
            ${arr[i].title}
          </a>

           <button type="button" onclick="toggleFavorite(${arr[i].id})" class="btn btn-link p-0 ps-3">${
             arr[i].isFavorite
               ? `<i class="fa-solid fa-heart text-danger "></i>`
               : `<i class="fa-regular fa-heart text-danger "></i>`
           }</button>
         <button type="button" onclick="toggleArchived(${arr[i].id})" class="btn btn-link p-0 ps-2 ">
          ${
            arr[i].isArchived
              ? `<i class="fa-solid fa-bookmark text-warning "></i>`
              : `<i class="fa-regular fa-bookmark text-warning "></i>`
          }
        </button>
        </td>

        <td>${arr[i].categoryName || "-"}</td>

        <td>
        <button onclick="editBookmarkForm(${i})" class="btn btn-warning">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
          <button onclick="deleteBookmark(${arr[i].id})" class="btn btn-danger ">
            <i class="fa-solid fa-trash-can"></i>
          </button>

        <button type="button" class="btn btn-secondary"  onclick="openBookmark(${arr[i].id})">
                <i class="fa-solid fa-eye"></i>
                </button>
        </td>

        
      </tr>
    `;
  }

  tbody.innerHTML = concatBookmarks;
}

async function deleteBookmark(id) {
  //   const confirmDelete = confirm(
  //     "Are you sure you want to delete this bookmark?",
  //   );

  //   if (!confirmDelete) return;

  try {
    await apiRequest(`/api/bookmarks/${id}`, "DELETE", null, true);

    displayAllBookmarks();
  } catch (err) {
    console.error("Delete bookmark error:", err);
  }
}

function editBookmarkForm(idx) {
  titleInput.value = bookmarks[idx].title;
  urlInput.value = bookmarks[idx].url;
  categorySelect.value = bookmarks[idx].categoryId;

  isEditMode = true;
  bookmarkId = bookmarks[idx].id;

  addBtn.innerHTML = `Edit Bookmark <i class="fa-solid fa-pen-to-square"></i>`;
  addBtn.classList.add("btn-warning");
  addBtn.classList.remove("btn-success");
}

async function editBookmark() {
  const bookmark = {
    title: titleInput.value.trim(),
    url: urlInput.value.trim(),
    categoryId: Number(categorySelect.value),
  };

  try {
    await apiRequest(`/api/bookmarks/${bookmarkId}`, "PUT", bookmark, true);

    resetEditUI();
    clearForm();
    displayAllBookmarks();

    return true;
  } catch (err) {
    console.error("Edit Bookmark Error:", err);
    return false;
  }
}

function resetEditUI() {
  isEditMode = false;
  bookmarkId = null;

  addBtn.innerHTML = `Add Bookmark <i class="fa-solid fa-plus"></i>`;
  addBtn.classList.remove("btn-warning");
  addBtn.classList.add("btn-success");
}

async function addOrEditBookmark() {
  if (
    !validateBookmarkTitle() ||
    !validateBookmarkUrl() ||
    !validateBookmarkCategory()
  ) {
    showErrMsg("Please fill all fields correctly");
    return;
  }

  let success = false;

  if (isEditMode) {
    success = await editBookmark();
  } else {
    success = await addBookmark();
  }

  if (success) {
    resetEditUI();
    clearForm();
    displayAllBookmarks();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  redirectToSignIn();
  renderNavbar();
  loadCategories();
  displayAllBookmarks();
});

// Validation

function validateBookmarkTitle() {
  const value = titleInput.value.trim();
  return value.length >= 1 && value.length <= 200;
}

function validateBookmarkUrl() {
  const value = urlInput.value.trim();

  const urlRegex = /^(https?:\/\/)[\w.-]+(\.[\w\.-]+)+[/#?]?.*$/i;

  return urlRegex.test(value);
}

function validateBookmarkCategory() {
  return Number(categorySelect.value) > 0;
}

function changeBookmarkInputStyle(input) {
  let isValid = false;

  if (input.id === "bookmarkTitle") {
    isValid = validateBookmarkTitle();
  }

  if (input.id === "bookmarkUrl") {
    isValid = validateBookmarkUrl();
  }

  if (input.id === "bookmarkCategory") {
    isValid = validateBookmarkCategory();
  }

  if (isValid) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
  } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
  }
}

//Filters
function clearFilters() {
  filterCategory.value = "";
  filterSearch.value = "";
  filterFavorite.checked = false;
  filterArchived.checked = false;

  renderBookmarks(bookmarks);
}

function applyFilters() {
  let filtered = [...bookmarks];

  // Category filter
  if (filterCategory.value) {
    filtered = filtered.filter((b) => b.categoryId == filterCategory.value);
  }

  // Search filter
  const searchValue = filterSearch.value.trim().toLowerCase();
  if (searchValue) {
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(searchValue) ||
        b.url.toLowerCase().includes(searchValue),
    );
  }

  // Favorites filter
  if (filterFavorite.checked) {
    filtered = filtered.filter((b) => b.isFavorite);
  }

  // Archived filter
  if (filterArchived.checked) {
    filtered = filtered.filter((b) => b.isArchived);
  }

  renderBookmarks(filtered);
}
