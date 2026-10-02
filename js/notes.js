document.addEventListener("DOMContentLoaded", () => {
  const note = document.getElementById("recent-note");
  const content = document.getElementById("recent-note-content");
  const button = document.getElementById("leave-note");

  if (!note || !content || !button) return;

  // --------------------------------
  // SUPABASE
  // --------------------------------

  const SUPABASE_URL = "https://vflirflslugeodvfybow.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_75JqS5DEU_vz0PTOG9AOSw_m7MKEtfK";

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
  );

  // --------------------------------
  // LOAD LATEST NOTE
  // --------------------------------

  async function loadLatestNote() {
    const { data, error } = await supabaseClient
      .from("book_notes")
      .select("name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Could not load note:", error);
      return;
    }

    if (!data || data.length === 0) return;

    displayNote(data[0]);
  }

  // --------------------------------
  // DISPLAY NOTE
  // --------------------------------

  function displayNote(data) {
    content.innerHTML = `
            <blockquote class="recent-note-text">
                “${escapeHTML(data.message)}”
            </blockquote>

            <div class="recent-note-author">
                — ${escapeHTML(data.name)}
            </div>
        `;

    button.textContent = "LEAVE A NOTE ✦";
  }

  // --------------------------------
  // NOTE FORM
  // --------------------------------

  button.addEventListener("click", () => {
    content.innerHTML = `
            <form class="recent-note-form" id="recent-note-form">

                <textarea
                    id="note-message"
                    maxlength="500"
                    placeholder="Write a little note..."
                    required
                ></textarea>

                <input
                    type="text"
                    id="note-name"
                    maxlength="40"
                    placeholder="Your name"
                    required
                >

                <button type="submit">
                    POST ✦
                </button>

            </form>
        `;

    button.style.display = "none";

    document.getElementById("note-message").focus();

    const form = document.getElementById("recent-note-form");

    form.addEventListener("submit", submitNote);
  });

  // --------------------------------
  // SUBMIT NOTE
  // --------------------------------

  async function submitNote(event) {
    event.preventDefault();

    const message = document.getElementById("note-message").value.trim();

    const name = document.getElementById("note-name").value.trim();

    if (!message || !name) return;

    const submitButton = event.target.querySelector("button");

    submitButton.disabled = true;
    submitButton.textContent = "POSTING ✦";

    const { data, error } = await supabaseClient
      .from("book_notes")
      .insert({
        name: name,
        message: message,
      })
      .select("name, message, created_at")
      .single();

    if (error) {
      console.error("Could not submit note:", error);

      submitButton.disabled = false;
      submitButton.textContent = "TRY AGAIN ✦";

      return;
    }

    // Immediately show the new note
    displayNote(data);

    button.style.display = "inline-block";
  }

  // --------------------------------
  // SECURITY
  // --------------------------------

  function escapeHTML(value) {
    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
  }

  // --------------------------------
  // INITIAL LOAD
  // --------------------------------

  loadLatestNote();
});
