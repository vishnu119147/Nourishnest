from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os
import mysql.connector

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your_secret_key')

# Flask-Mail configuration (if needed)
mail = Mail(app)
s = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# Database configuration
db_config = {
    'user': 'root',
    'password': 'root',
    'host': 'localhost',
    'database': 'nourish'
}

# Function to create database connection
def create_database_connection():
    return mysql.connector.connect(**db_config)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create_account', methods=['GET', 'POST'])
def create_account():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        hashed_password = generate_password_hash(password)  # Hash the password

        connection = create_database_connection()
        cursor = connection.cursor()

        # Check if username or email already exists
        cursor.execute("SELECT * FROM users WHERE username = %s OR email = %s", (username, email))
        existing_user = cursor.fetchone()

        if existing_user:
            flash('Username or email already taken. Please choose a different one.', 'error')
            return redirect(url_for('create_account'))

        # Insert user data with hashed password
        cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, hashed_password))
        connection.commit()

        cursor.close()
        connection.close()

        flash('Account created successfully! Please log in.', 'success')
        return redirect(url_for('login'))
    else:
        return render_template('createuser.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        connection = create_database_connection()
        cursor = connection.cursor()

        # Fetch user by username
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        connection.close()

        if user:
            stored_password = user[3]  # Assuming password is in the 4th column (index 3)
            # Validate the hashed password
            if check_password_hash(stored_password, password):
                session['username'] = username
                return redirect(url_for('home'))
            else:
                flash('Invalid password', 'error')
        else:
            flash('User not found', 'error')

    return render_template('login.html')

@app.route('/home')
def home():
    if 'username' in session:
        return render_template('home.html', username=session['username'])
    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

@app.route('/Home')
def Home():
    return render_template('home.html')

@app.route('/BMI')
def BMI():
    return render_template('BMI.html')

@app.route('/calo')
def Calo():
    return render_template('caltrac.html')

@app.route('/suggestion')
def survey():
    return render_template('survey.html')

# Survey submission route
@app.route('/submit-survey', methods=['POST'])
def submit_survey():
    data = request.json  # Get the survey data from the request
    conn = create_database_connection()
    cursor = conn.cursor()

    # Assuming you have a table 'survey_responses' with 'question_id' and 'answer'
    for question_id, answer in data.items():
        query = "INSERT INTO survey_responses (question_id, answer) VALUES (%s, %s)"
        cursor.execute(query, (question_id, answer))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Survey submitted successfully!"})

if __name__ == '__main__':
    app.run(debug=True)
