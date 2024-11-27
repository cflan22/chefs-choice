from flask import Blueprint, jsonify, request
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

chat_bp = Blueprint("chat", __name__)

# Configure OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

@chat_bp.route("/interact", methods=["POST"])
def interact():
    """
    Handles user interaction with the chatbot.
    Sends a prompt to OpenAI and returns a structured recipe.
    """
    data = request.json
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "Message is required."}), 400

    try:
        # Generate a response from OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional chef bot. Provide recipes in this format:\n\nTitle\n\nIngredients:\n- Ingredient 1\n- Ingredient 2\n\nInstructions:\n1. Step 1\n2. Step 2"},
                {"role": "user", "content": user_message}
            ],
        )

        bot_reply = response["choices"][0]["message"]["content"]
        title, ingredients, instructions = parse_recipe(bot_reply)

        return jsonify({
            "title": title,
            "ingredients": ingredients,
            "instructions": instructions
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def parse_recipe(reply):
    """
    Parses the bot's response to extract the recipe title, ingredients, and instructions.
    """
    try:
        lines = reply.strip().split("\n")
        title = lines[0].strip()
        ingredients_index = lines.index("Ingredients:")
        instructions_index = lines.index("Instructions:")

        ingredients = "\n".join(lines[ingredients_index + 1:instructions_index]).strip()
        instructions = "\n".join(lines[instructions_index + 1:]).strip()

        return title, ingredients, instructions
    except Exception as e:
        print(f"Parsing Error: {e}")
        return "Untitled Recipe", "No ingredients listed.", "No instructions provided."
