const baseURL = "http://linkvaultapi.runasp.net";

function signOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("currentSessionUser");
  // window.open("./index.html", "_self");
  // window.location.href = "./index.html";
  window.location.replace("./index.html");
}

async function apiRequest(endpoint, method, body = null, auth = false) {
  try {
    const requestInit = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (auth) {
      requestInit.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }

    if (body) {
      requestInit.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseURL}${endpoint}`, requestInit);

    console.log("Response from api.js", response);

    let data = null;

    if (response.status !== 204) {
      data = await response.json();
    }

    if (!response.ok) {
      if (response.status === 401) {
        signOut();
        return;
      }

      let msg = data?.errors
        ? Object.values(data.errors)?.[0]?.[0]
        : data?.message || "err";

      showErrMsg(msg);
      throw data;
    }

    return data;
  } catch (error) {
    console.error("Error from api.js:", error);

    showErrMsg("Network error. Try again.");

    throw error;
  }
}
