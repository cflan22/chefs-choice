document.addEventListener("DOMContentLoaded", async () => {
    const recipeTitleElement = document.getElementById("recipeTitle");
    const recipeIngredientsElement = document.getElementById("recipeIngredients");
    const recipeInstructionsElement = document.getElementById("recipeInstructions");
    const notesContainer = document.getElementById("notesContainer");
    const noteInput = document.getElementById("noteInput");
    const addNoteButton = document.getElementById("addNoteButton");

    const urlParams = new URLSearchParams(window.location.search);
    const recipeTitle = urlParams.get("title");

    // Fetch recipe details
    try {
        const response = await fetch("/chat/get_recipe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: recipeTitle }),
        });

        if (response.ok) {
            const data = await response.json();
            const { title, details, notes } = data;

            // Populate the recipe details
            recipeTitleElement.textContent = title;
            recipeIngredientsElement.innerHTML = details.ingredients.replace(/\n/g, "<br>");
            recipeInstructionsElement.innerHTML = details.instructions.replace(/\n/g, "<br>");

            // Display notes
            notes.forEach(note => {
                const noteDiv = document.createElement("div");
                noteDiv.className = "note";
                noteDiv.textContent = note;
                notesContainer.appendChild(noteDiv);
            });
        } else {
            alert("Failed to load recipe details.");
        }
    } catch (err) {
        console.error("Error fetching recipe details:", err);
        alert("Could not fetch recipe details. Please try again later.");
    }

    // Add a note
    addNoteButton.addEventListener("click", async () => {
        const noteText = noteInput.value.trim();
        if (!noteText) {
            alert("Please enter a note.");
            return;
        }

        try {
            const response = await fetch("/chat/add_note", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: recipeTitle, note: noteText }),
            });

            if (response.ok) {
                // Add new note to the UI
                const newNote = document.createElement("div");
                newNote.className = "note";
                newNote.textContent = noteText;
                notesContainer.appendChild(newNote);

                noteInput.value = ""; // Clear input
            } else {
                alert("Failed to add note.");
            }
        } catch (err) {
            console.error("Error adding note:", err);
            alert("Could not add note. Please try again later.");
        }
    });
});
