window.addEventListener("load", () => {
  navigator.serviceWorker.register("../sw.js?v=6-17-2024", {
    scope: "/uv/",
  });
});

const form = document.getElementById("fs");
const input = document.getElementById("is");

if (form && input) {
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (window.top.location.pathname === "/ta") {
      processUrl(input.value, "");
    } else {
      processUrl(input.value, "/ta");
    }
  });
}
function processUrl(value, path) {
  let url = value.trim();
  const engine = localStorage.getItem("engine");
  const searchUrl = engine ? engine : "https://www.google.com/search?q=";

  if (!isUrl(url)) {
    url = searchUrl + url;
  } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
    url = `https://${url}`;
  }

  if (localStorage.getItem("proxy") === "scramjet") {
    openWithScramjet(url, path);
    return;
  }

  sessionStorage.setItem("GoUrl", __uv$config.encodeUrl(url));
  const dy = localStorage.getItem("dy");

  if (dy === "true") {
    window.location.href = `/uv/q/${__uv$config.encodeUrl(url)}`;
  } else if (path) {
    location.href = path;
  } else {
    window.location.href = `/uv/${__uv$config.encodeUrl(url)}`;
  }
}

async function openWithScramjet(url, path) {
  try {
    const target = await getScramjetUrl(url);
    sessionStorage.setItem("GoUrl", target);
    window.location.href = path || target;
  } catch (error) {
    console.error("Unable to start Scramjet:", error);
  }
}

function go(value) {
  processUrl(value, "/ta");
}

function blank(value) {
  processUrl(value);
}

function dy(value) {
  processUrl(value, `/uv/q/${__uv$config.encodeUrl(value)}`);
}

function isUrl(val = "") {
  if (
    /^http(s?):\/\//.test(val) ||
    (val.includes(".") && val.substr(0, 1) !== " ")
  ) {
    return true;
  }
  return false;
}
