document.addEventListener("DOMContentLoaded", () => {
  const imageContainer = document.querySelector(".image-container");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!imageContainer) return;

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      if (link.dataset.image === "contact") {
        imageContainer.classList.add("show-contact");
      }

      if (link.dataset.image === "travel") {
        imageContainer.classList.remove("show-contact");
      }
    });
  });
});
