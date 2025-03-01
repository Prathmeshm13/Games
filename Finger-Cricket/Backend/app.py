from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask import Flask, Response, jsonify, render_template, request, redirect, url_for, session
from flask_cors import CORS
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)
app.secret_key = 'your_secret_key'  # Change this to a secure key

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  # Change to your MySQL username
app.config['MYSQL_PASSWORD'] = 'PrathmeshM@13'  # Change to your MySQL password
app.config['MYSQL_DB'] = 'games'
mysql = MySQL(app)


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    existing_user = cursor.fetchone()

    if existing_user:
        return jsonify({"message": "Email already registered"}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, hashed_password))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Signup successful"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    print(email)
    print(password)
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    print(user)
    if user and check_password_hash(user[2], password):
        session['loggedin'] = True
        session['id'] = user[0]
        session['username'] = user[1]
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401

@app.route('/')
def index():
    if 'loggedin' in session:
        return render_template('landing.html', username=session['username'])
    return render_template('login.html')

@app.route('/finger-cricket/play-computer')
def landing():
    return render_template('computer-gameplay.html')

@app.route('/logout')
def logout():
    session.pop('loggedin', None)
    session.pop('id', None)
    session.pop('username', None)
    return redirect(url_for('index'))  # Redirecting to index or login page after logout


@socketio.on('send_message')
def handle_send_message(data):
    print(f"Received from client: {data}")
    response = f"Server Response: {data['message']}"
    emit('receive_message', {'message': response}, broadcast=True)  # Sends to all clients

if __name__ == '__main__':
    socketio.run(app, debug=True)
