import re

def is_valid_recipe(response):
    """
    Check if a response contains a recipe with a title, ingredients, and instructions.
    """
    # Basic checks for title, ingredients, and instructions
    has_title = re.search(r"(recipe|dish|title):", response, re.IGNORECASE)
    has_ingredients = re.search(r"ingredients:", response, re.IGNORECASE)
    has_instructions = re.search(r"(steps|instructions):", response, re.IGNORECASE)

    return bool(has_title and has_ingredients and has_instructions)
