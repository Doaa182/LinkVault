const titleInput = document.getElementById("noteTitle");
const contentInput = document.getElementById("noteContent");
const categorySelect = document.getElementById("noteCategory");

const tbody = document.getElementById("notesTableBody");

const filterCategory = document.getElementById("filterCategory");

const addBtn = document.querySelector(".add-btn");

let notes = [];
let categories = [];

let isEditMode = false;
let noteId = null;

async function loadCategories() {
  try {
    const data = await apiRequest("/api/categories", "GET", null, true);

    categories = data;

    categorySelect.innerHTML = data
      .map(
        (c) => `
        <option value="${c.id}">
          ${c.categoryName}
        </option>
      `,
      )
      .join("");

    filterCategory.innerHTML = `
      <option value="">All Categories</option>

      ${data
        .map(
          (c) => `
          <option value="${c.id}">
            ${c.categoryName}
          </option>
        `,
        )
        .join("")}
    `;
  } catch (err) {
    console.error(err);
  }
}

async function displayAllNotes() {
  try {
    const data = await apiRequest("/api/notes", "GET", null, true);

    notes = data;

    renderNotes(notes);
  } catch (err) {
    console.error(err);
  }
}

function renderNotes(arr) {
  if (arr.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">
          No Notes Found
        </td>
      </tr>
    `;

    return;
  }

  let concat = "";

  for (let i = 0; i < arr.length; i++) {
    concat += `
      <tr>
        <td>${i + 1}</td>

        <td>${arr[i].title}</td>

        <td>
          ${
            arr[i].content.length > 50
              ? arr[i].content.slice(0, 50) + "..."
              : arr[i].content
          }
        </td>

        <td>${arr[i].categoryName || "-"}</td>

        <td>
          <button
            class="btn btn-link"
            onclick="togglePin(${arr[i].id})"
          >
            ${
              arr[i].isPinned
                ? `<i class="fa-solid fa-thumbtack text-danger"></i>`
                : `<i class="fa-solid fa-thumbtack text-secondary"></i>`
            }
          </button>
        </td>

        <td>
          <button
            class="btn btn-warning"
            onclick="editNoteForm(${i})"
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </button>

          <button
            class="btn btn-danger"
            onclick="deleteNote(${arr[i].id})"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }

  tbody.innerHTML = concat;
}

async function addNote() {
  const note = {
    title: titleInput.value.trim(),
    content: contentInput.value.trim(),
    categoryId: Number(categorySelect.value),
  };

  try {
    await apiRequest("/api/notes", "POST", note, true);

    return true;
  } catch (err) {
    console.error(err);

    return false;
  }
}

function editNoteForm(idx) {
  titleInput.value = notes[idx].title;

  contentInput.value = notes[idx].content;

  categorySelect.value = notes[idx].categoryId;

  noteId = notes[idx].id;

  isEditMode = true;

  addBtn.innerHTML = `
    Edit Note
    <i class="fa-solid fa-pen-to-square"></i>
  `;

  addBtn.classList.remove("btn-success");

  addBtn.classList.add("btn-warning");
}

async function editNote() {
  const currentNote = notes.find((n) => n.id === noteId);

  const note = {
    title: titleInput.value.trim(),
    content: contentInput.value.trim(),
    categoryId: Number(categorySelect.value),
    isPinned: currentNote?.isPinned || false,
  };

  try {
    await apiRequest(`/api/notes/${noteId}`, "PUT", note, true);

    return true;
  } catch (err) {
    console.error(err);

    return false;
  }
}

async function deleteNote(id) {
  const confirmDelete = confirm("Are you sure you want to delete this note?");

  if (!confirmDelete) return;

  try {
    await apiRequest(`/api/notes/${id}`, "DELETE", null, true);

    displayAllNotes();
  } catch (err) {
    console.error(err);
  }
}

async function togglePin(id) {
  const note = notes.find((n) => n.id === id);

  if (!note) return;

  note.isPinned = !note.isPinned;

  renderNotes(notes);

  try {
    await apiRequest(`/api/notes/${id}/pin`, "PATCH", null, true);
  } catch (err) {
    note.isPinned = !note.isPinned;

    renderNotes(notes);

    console.error(err);
  }
}

async function addOrEditNote() {
  if (
    !validateNoteTitle() ||
    !validateNoteContent() ||
    !validateNoteCategory()
  ) {
    return;
  }

  let success = false;

  if (isEditMode) {
    success = await editNote();
  } else {
    success = await addNote();
  }

  if (success) {
    resetUI();

    clearForm();

    displayAllNotes();
  }
}

function clearForm() {
  titleInput.value = "";

  contentInput.value = "";

  categorySelect.selectedIndex = 0;
}

function resetUI() {
  isEditMode = false;

  noteId = null;

  addBtn.innerHTML = `
    Add Note
    <i class="fa-solid fa-plus"></i>
  `;

  addBtn.classList.remove("btn-warning");

  addBtn.classList.add("btn-success");
}

function applyFilter() {
  let filtered = [...notes];

  if (filterCategory.value) {
    filtered = filtered.filter((n) => n.categoryId == filterCategory.value);
  }

  renderNotes(filtered);
}

function clearFilter() {
  filterCategory.value = "";

  renderNotes(notes);
}

function validateNoteTitle() {
  return titleInput.value.trim().length > 0;
}

function validateNoteContent() {
  return contentInput.value.trim().length > 0;
}

function validateNoteCategory() {
  return Number(categorySelect.value) > 0;
}

document.addEventListener("DOMContentLoaded", () => {
  redirectToSignIn();

  renderNavbar();

  loadCategories();

  displayAllNotes();
});
