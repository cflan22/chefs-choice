document.addEventListener("DOMContentLoaded", async () => {
    const vaultContainer = document.getElementById("vaultContainer");

    try {
        const response = await fetch("/chat/vault");
        if (response.ok) {
            const data = await response.json();
            const vault = data.vault;

            for (const category in vault) {
                const categoryDiv = document.createElement("div");
                categoryDiv.className = "category";

                const categoryTitle = document.createElement("h3");
                categoryTitle.textContent = category;
                categoryDiv.appendChild(categoryTitle);

                const recipeList = document.createElement("ul");
                for (const recipeTitle of vault[category]) {
                    const recipeItem = document.createElement("li");
                    recipeItem.textContent = recipeTitle;

                    recipeItem.addEventListener("click", () => {
                        window.location.href = `/recipe_detail?title=${encodeURIComponent(recipeTitle)}`;
                    });

                    recipeList.appendChild(recipeItem);
                }

                categoryDiv.appendChild(recipeList);
                vaultContainer.appendChild(categoryDiv);
            }
        } else {
            alert("Failed to load recipes.");
        }
    } catch (err) {
        console.error("Error fetching vault data:", err);
        alert("Could not fetch recipes. Please try again later.");
    }
});
