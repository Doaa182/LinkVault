const params = new URLSearchParams(window.location.search);
const bookmarkId = params.get("id");

if (!bookmarkId) {
  window.location.href = "bookmarks.html";
}

function goBack() {
  window.location.href = "bookmarks.html";
}

async function loadBookmark() {
  try {
    const data = await apiRequest(
      `/api/bookmarks/${bookmarkId}`,
      "GET",
      null,
      true,
    );

    document.getElementById("bookmarkTitle").innerText = data.title;

    const urlEl = document.getElementById("bookmarkUrl");
    urlEl.innerText = data.url;
    urlEl.href = data.url;

    document.getElementById("bookmarkCategory").innerText =
      "Category: " + (data.categoryName || "-");

    document.getElementById("bookmarkFavorite").innerText = data.isFavorite
      ? "Favorite"
      : "";

    document.getElementById("bookmarkArchived").innerText = data.isArchived
      ? "Archived"
      : "";
  } catch (err) {
    console.error(err);
    document.getElementById("bookmarkTitle").innerText =
      "Failed to load bookmark";
  }
}

async function loadNotes() {
  try {
    const data = await apiRequest(
      `/api/bookmarks/${bookmarkId}/notes`,
      "GET",
      null,
      true,
    );

    renderNotes(data);
  } catch (err) {
    console.error(err);
    document.getElementById("notesContainer").innerHTML =
      `<p class="text-danger">Failed to load notes</p>`;
  }
}

function renderNotes(notes) {
  const container = document.getElementById("notesContainer");

  if (!notes || notes.length === 0) {
    container.innerHTML = `<p class="text-muted">No notes yet.</p>`;
    return;
  }

  container.innerHTML = notes
    .map(
      (n) => `
      <div class="card mb-2">
        <div class="card-body d-flex justify-content-between align-items-center">
          <p class="mb-0">${n.content}</p>
          <button class="btn btn-danger btn-sm" onclick="deleteNote(${n.id})">
            Delete
          </button>
        </div>
      </div>
    `,
    )
    .join("");
}

async function addNote() {
  const content = document.getElementById("noteContent").value;

  if (!content.trim()) return;

  try {
    await apiRequest(
      `/api/bookmarks/${bookmarkId}/notes`,
      "POST",
      { content },
      true,
    );

    document.getElementById("noteContent").value = "";
    await loadNotes();
  } catch (err) {
    console.error(err);
  }
}

async function deleteNote(noteId) {
  try {
    await apiRequest(
      `/api/bookmarks/${bookmarkId}/notes/${noteId}`,
      "DELETE",
      null,
      true,
    );

    await loadNotes();
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadBookmark();
  await loadNotes();
});
