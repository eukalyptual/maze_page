from flask import Flask, request, jsonify, render_template
from time import sleep
from random import sample
from graph_aritra import Node, Graph

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.get_json(force=True)
    score = 0

    # print(data)
    rounds = 1000
    DSFpoints = []
    for i in range(rounds):
        maze = Graph(data)
        if not i:
            nodes = len(maze.nodes)
        if maze.DFS():
            # print(maze.steps)
            DSFpoints.append(maze.steps)
        # else:
        #     return jsonify({"score": "No path found"})
        del maze
    if not len(DSFpoints): return jsonify({"score": "No path found"})
    score += sum(DSFpoints)/(len(DSFpoints)*nodes)


    # sleep(2)
    # return jsonify({"score": int(sum(points)*3/len(points)) if len(points) else "no valid path"})
    return jsonify({"score": int(score*100)})

app.run(host='localhost', port=5500, debug=True)