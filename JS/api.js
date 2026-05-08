const baseURL = "http://linkvaultapi.runasp.net";

async function apiRequest(endpoint, method, body = null, auth = false) {
  try {
    const requestInit = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // new code
    if (auth) {
      requestInit.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }

    // new code
    if (body) {
      requestInit.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseURL}${endpoint}`, requestInit);

    console.log("Response from api.js", response);

    let data = null; // new code

    // new code
    if (response.status !== 204) {
      data = await response.json();
    }

    if (!response.ok) {
      let msg = Object.values(data.errors)[0][0] || data.message || "";

      //   showModal();
      //   document.querySelector(".modal-body ul").innerHTML = `<li>
      //   <i class="fa-regular fa-circle-right p-2"></i>${msg}
      // </li>`;
      showErrMsg(msg);
      throw data; // new code
    }

    return data; // new code
  } catch (error) {
    console.error("Error from api.js:", error);
    // showModal();
    // document.querySelector(".modal-body ul").innerHTML = `<li>
    //   <i class="fa-regular fa-circle-right p-2"></i>Network error. Try again.
    // </li>`;
    showErrMsg("Network error. Try again.");

    throw error; // new code
  }
}
