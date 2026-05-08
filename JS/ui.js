// Modal
const modal = document.getElementById("exampleModal");
const modalBody = document.querySelector(".modal-body ul");
const closeBtn = document.querySelector(".btn-close");

// Show modal
function showModal() {
  // new code
  if (modal) {
    modal.classList.add("show", "d-block");
    modal.classList.remove("d-none", "fade");
    modal.style.backgroundColor = "rgba(0,0,0,0.5)";
  }
}

// Hide modal
function hideModal() {
  // new code
  if (modal) {
    modal.classList.remove("show", "d-block");
    modal.classList.add("d-none", "fade");
  }
}

// Modal close btn
// new code
if (closeBtn) {
  closeBtn.addEventListener("click", hideModal);
}
// new code
if (modal) {
  modal.addEventListener("click", function (e) {
    if (e.target === modal) hideModal();
  });
}

// Error message
function showErrMsg(msg) {
  showModal();
  // new code
  if (modalBody) {
    modalBody.innerHTML = `
    <li>
      <i class="fa-regular fa-circle-right p-2"></i>${msg}
    </li>
  `;
  }
}
