from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager

app = Flask(__name__)

# Fix for CORS with credentials
CORS(app, supports_credentials=True, origins="http://localhost:5173")

# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb+srv://prathmesh:MlxY3dmcmFwLsvGd@games.veegl.mongodb.net/games?retryWrites=true&w=majority"

mongo = PyMongo()
mongo.init_app(app)  # Fix for MongoDB connection

# JWT Configuration
app.config["JWT_SECRET_KEY"] = "supersecretkey"  # Change this in production
jwt = JWTManager(app)

# User Signup
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400

    print(mongo.db.list_collection_names())  # Debugging MongoDB collections

    if mongo.db["users"].find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 409

    if mongo.db["users"].find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 409

    hashed_password = generate_password_hash(password)
    mongo.db["users"].insert_one({"username": username, "email": email, "password": hashed_password})

    return jsonify({"message": "User registered successfully"}), 201

# User Login
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = mongo.db["users"].find_one({"email": email})
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user["email"])  # Use email as a string
    return jsonify({"message": "Login successful", "token": access_token}), 200

# Protected Route (Example)
@app.route("/api/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user_email = get_jwt_identity()
    user = mongo.db.users.find_one({"email": current_user_email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": f"Welcome {user['username']}!", "email": user["email"]})


if __name__ == "__main__":
    app.run(debug=True)
