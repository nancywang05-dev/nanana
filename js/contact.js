document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("postcard-form");
  const postcard = document.querySelector(".postcard");
  const button = document.getElementById("send-postcard");
  const status = document.getElementById("postcard-status");

  if (!form || !postcard || !button) return;

  /*
   * IMPORTANT:
   * Replace this with your actual Formspree endpoint.
   *
   * Example:
   * https://formspree.io/f/abcdwxyz
   */

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkjgeyvz";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    /* Prevent multiple submissions */

    if (button.disabled) return;

    button.disabled = true;

    /* Start stamp animation */

    postcard.classList.add("sending");

    /* Wait for the stamp press */

    await new Promise((resolve) => {
      setTimeout(resolve, 450);
    });

    try {
      const formData = new FormData(form);

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",

        body: formData,

        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed.");
      }

      /* Success */

      postcard.classList.remove("sending");

      postcard.classList.add("sent");

      status.textContent = "Your postcard has been mailed. ✦";

      /* Keep the form visible,
               but prevent another submission */

      button.disabled = true;
    } catch (error) {
      console.error(error);

      postcard.classList.remove("sending");

      status.textContent = "Something went wrong. Please try again. ✦";

      button.disabled = false;
    }
  });
});
