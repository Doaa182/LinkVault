// Categories UI
// Modal
const modal = document.getElementById("exampleModal");
const modalBody = document.querySelector(".modal-body ul");
const closeBtn = document.querySelector(".btn-close");

// Show modal
function showModal() {
  if (modal) {
    modal.classList.add("show", "d-block");
    modal.classList.remove("d-none", "fade");
    modal.style.backgroundColor = "rgba(0,0,0,0.5)";
  }
}

// Hide modal
function hideModal() {
  if (modal) {
    modal.classList.remove("show", "d-block");
    modal.classList.add("d-none", "fade");
  }
}

// Modal close btn
if (closeBtn) {
  closeBtn.addEventListener("click", hideModal);
}
if (modal) {
  modal.addEventListener("click", function (e) {
    if (e.target === modal) hideModal();
  });
}

// Error message
function showErrMsg(msg) {
  showModal();
  if (modalBody) {
    modalBody.innerHTML = `
    <li>
      <i class="fa-regular fa-circle-right p-2"></i>${msg}
    </li>
  `;
  }
}

/***************************************************************************************************** */
// Auth UI

function showAuthMsg(eleId, msg, color) {
  const ele = document.getElementById(eleId);
  if (!ele) return;
  ele.innerHTML = `<p class="text-${color} text-center mb-4">${msg}</p>`;
}
