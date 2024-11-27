from flask import Blueprint, jsonify, request, render_template

recipes_bp = Blueprint("recipes", __name__, template_folder="templates")

# In-memory storage for demonstration purposes
vault = {}

@recipes_bp.route("/vault")
def recipe_vault():
    return render_template("vault.html")

@recipes_bp.route("/chat/vault", methods=["GET"])
def get_vault():
    return jsonify({"vault": vault})

@recipes_bp.route("/chat/save", methods=["POST"])
def save_recipe():
    data = request.json
    category = data.get("category", "Uncategorized")
    title = data["title"]
    recipe_data = {
        "ingredients": data["ingredients"],
        "instructions": data["instructions"],
        "notes": []
    }

    if category not in vault:
        vault[category] = {}

    vault[category][title] = recipe_data
    return jsonify({"message": "Recipe saved successfully!"})

@recipes_bp.route("/recipe_detail")
def recipe_detail():
    return render_template("recipe_detail.html")

@recipes_bp.route("/chat/get_recipe", methods=["POST"])
def get_recipe():
    data = request.json
    title = data["title"]

    for category, recipes in vault.items():
        if title in recipes:
            return jsonify({"title": title, "details": recipes[title], "notes": recipes[title].get("notes", [])})

    return jsonify({"error": "Recipe not found"}), 404

@recipes_bp.route("/chat/add_note", methods=["POST"])
def add_note():
    data = request.json
    title = data["title"]
    note = data["note"]

    for category, recipes in vault.items():
        if title in recipes:
            recipes[title]["notes"].append(note)
            return jsonify({"notes": recipes[title]["notes"]})

    return jsonify({"error": "Recipe not found"}), 404
