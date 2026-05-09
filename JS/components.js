function renderNavbar() {
  const path = window.location.pathname;
  let activePage = "";
  if (path.includes("categories")) {
    activePage = "categories";
  }
  if (path.includes("home")) {
    activePage = "home";
  }
  if (path.includes("bookmark")) {
    activePage = "bookmark";
  }

  if (path.includes("notes")) {
    activePage = "notes";
  }

  const token = localStorage.getItem("token");
  if (!token) return;

  const email = getUserEmailFromJWT(token);

  const navbar = document.querySelector("nav");
  if (!navbar) return;

  navbar.innerHTML = `
   
 <nav class="navbar navbar-expand-lg bg-black">
      <div class="container-fluid">
        <div class="d-flex justify-content-center align-items-center">
          <img
            src="./Assets/profile-pic.jpg"
            alt="Personal Photo"
            class="rounded-circle me-2"
            width="30px"
          />
          <span class="text-white fw-medium ">${email || ""}</span>
        </div>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse bg-black" id="navbarSupportedContent">
          <ul class="navbar-nav m-auto mb-2 mb-lg-0 gap-2">


           <li class="nav-item">
              <a
                class="nav-link fw-medium  ${activePage === "home" ? "active" : ""}"
                aria-current="page"
                href="./home_page.html"
                >Home</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link fw-medium  ${activePage === "categories" ? "active" : ""}"
                aria-current="page"
                href="./categories.html"
                >Categories</a
              >
            </li>

            <li class="nav-item">
              <a
                class="nav-link fw-medium  ${activePage === "bookmark" ? "active" : ""}"
                aria-current="page"
                href="./bookmarks.html"
                >Bookmarks</a
              >
            </li>

             <li class="nav-item">
              <a
                class="nav-link fw-medium  ${activePage === "notes" ? "active" : ""}"
                aria-current="page"
                href="./notes.html"
                >Notes</a
              >
            </li>
            
          </ul>
          <div  onclick="signOut()">
            <i
              class="fas fa-sign-out-alt fs-4 fw-semibold">
             </i>
            <span class="fs-5 fw-semibold ps-2">Sign Out</span>
          </div>
        </div>
      </div>
    </nav>

  `;
}
