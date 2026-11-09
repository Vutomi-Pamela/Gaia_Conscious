from flask import Flask, jsonify
from settings import get_config


app = Flask(__name__)

# Load the selected environment configuration
config_class = get_config()

# Validate production settings before starting
if hasattr(config_class, "validate"):
    config_class.validate()

app.config.from_object(config_class)


@app.route("/")
def home():
    return jsonify({
        "message": "Gaia Conscious backend is running!",
        "environment": app.config.get("ENVIRONMENT", "development")
    })


if __name__ == "__main__":
    app.run(
        debug=app.config.get("DEBUG", False)
    )
