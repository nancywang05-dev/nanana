document.addEventListener("DOMContentLoaded", () => {
  const header = document.createElement("header");

  header.className = "site-header";

  header.innerHTML = `
    <a href="/nanana/" class="logo">nana</a>
  `;

  document.body.prepend(header);
});