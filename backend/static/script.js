document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatOutput = document.getElementById("chatOutput");
    const saveButton = document.getElementById("saveButton");

    let lastRecipe = null;

    chatForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        // Display loading message
        chatOutput.innerHTML = "<p>Loading...</p>";

        try {
            const response = await fetch("/chat/interact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            if (response.ok) {
                const data = await response.json();
                const { title, ingredients, instructions } = data;

                lastRecipe = { title, ingredients, instructions };

                chatOutput.innerHTML = `
                    <h2>${title}</h2>
                    <h3>Ingredients:</h3>
                    <p>${ingredients.replace(/\n/g, "<br>")}</p>
                    <h3>Instructions:</h3>
                    <p>${instructions.replace(/\n/g, "<br>")}</p>
                `;
            } else {
                chatOutput.innerHTML = "<p>Error fetching recipe. Please try again.</p>";
            }
        } catch (error) {
            console.error("Error:", error);
            chatOutput.innerHTML = "<p>An error occurred. Please try again later.</p>";
        }
    });

    saveButton.addEventListener("click", async () => {
        if (!lastRecipe) {
            alert("No recipe to save!");
            return;
        }

        const category = prompt("Enter a category for this recipe (e.g., Breakfast, Dinner):", "Uncategorized") || "Uncategorized";

        try {
            const response = await fetch("/chat/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...lastRecipe, category }),
            });

            if (response.ok) {
                alert("Recipe saved successfully!");
            } else {
                alert("Failed to save recipe.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while saving the recipe.");
        }
    });
});
