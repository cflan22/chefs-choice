from flask import Flask, render_template
from chat.routes import chat_bp

app = Flask(__name__)

# Register the chat blueprint
app.register_blueprint(chat_bp, url_prefix="/chat")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/vault")
def vault():
    return render_template("vault.html")

if __name__ == "__main__":
    app.run(debug=True, port=5001)
