from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route('/evaluate', methods=['POST'])
def evaluate():
    dataGot = request.get_json(force=True)
    # print(dataGot)
    return jsonify({"score": 56})

app.run(host='192.168.0.100', port=5500, debug=True)