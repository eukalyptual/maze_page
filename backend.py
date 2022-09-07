from flask import Flask, request, jsonify, render_template
from time import sleep

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route('/evaluate', methods=['POST'])
def evaluate():
    dataGot = request.get_json(force=True)
    # print(dataGot)
    sleep(5)
    return jsonify({"score": 56})

app.run(host='10.1.33.215', port=5500, debug=True)