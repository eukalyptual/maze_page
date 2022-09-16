from random import sample

class Node:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.up = None
        self.down = None
        self.left = None
        self.right = None

    def __repr__(self):
        x = self.x
        y = self.y
        up = self.up != None
        down = self.down != None
        left = self.left != None
        right = self.right != None
        return f"({x}, {y}), {up}, {down}, {left}, {right}"

class Graph:
    def __init__(self, data):
        self.edges = data["edges"]
        self.end = data["end"][2:]
        self.make_nodes()
        # print(len(self.nodes))
        self.remove_straight_nodes()
        # print(len(self.nodes))
        self.visited = []
        self.path = []
        self.steps = 0

    def wall_up(self, node):
        return self.edges[f"E[V_{node.x}_{node.y}][V_{node.x+1}_{node.y}]"]
    def wall_down(self, node):
        return self.edges[f"E[V_{node.x}_{node.y+1}][V_{node.x+1}_{node.y+1}]"]
    def wall_right(self, node):
        return self.edges[f"E[V_{node.x+1}_{node.y}][V_{node.x+1}_{node.y+1}]"]
    def wall_left(self, node):
        return self.edges[f"E[V_{node.x}_{node.y}][V_{node.x}_{node.y+1}]"]
    
    def make_nodes(self):
        n = ((1 + 2*len(self.edges))**0.5 - 1)/2  # because 2n^2 + 2n = len(edges) (using Sridhar Acharya's formula)
        if n.is_integer():
            n = int(n)
        else:
            raise("Invalid number of edges")

        nodes = {}
        for i in range(n):
            for j in range(n):
                nodes[f"{i}_{j}"] = Node(i, j)

        for node_name in nodes.keys():
            if not self.wall_up(nodes[node_name]):
                nodes[node_name].up = nodes[f"{nodes[node_name].x}_{nodes[node_name].y-1}"]
            if not self.wall_down(nodes[node_name]):
                nodes[node_name].down = nodes[f"{nodes[node_name].x}_{nodes[node_name].y+1}"]
            if not self.wall_right(nodes[node_name]):
                nodes[node_name].right = nodes[f"{nodes[node_name].x+1}_{nodes[node_name].y}"]
            if not self.wall_left(nodes[node_name]):
                nodes[node_name].left = nodes[f"{nodes[node_name].x-1}_{nodes[node_name].y}"]

        self.nodes = nodes
    
    def remove_straight_nodes(self):
        names = list(self.nodes.keys())
        for node_name in names:
            node = self.nodes[node_name]
            # if up and down but not left and right
            if node.up and node.down and not node.left and not node.right:
                # print("deleting", node)
                node.up.down = node.down
                node.down.up = node.up
                del self.nodes[node_name]
                del node
            elif node.left and node.right and not node.up and not node.down:
                # print("deleting", node)
                node.left.right = node.right
                node.right.left = node.left
                del self.nodes[node_name]
                del node
        
    def DFS(self, start = "0_0"):
        self.steps += 1
        self.visited.append(self.nodes[start])
        self.path.append(self.nodes[start])
        if start == self.end:
            return True
        else:
            node = self.nodes[start]
            order = sample(["up", "down", "left", "right"], 4)
            for o in order:
                if o == "up" and node.up and node.up not in self.visited:
                    return self.DFS(f"{node.up.x}_{node.up.y}")
                elif o == "down" and node.down and node.down not in self.visited:
                    return self.DFS(f"{node.down.x}_{node.down.y}")
                elif o == "left" and node.left and node.left not in self.visited:
                    return self.DFS(f"{node.left.x}_{node.left.y}")
                elif o == "right" and node.right and node.right not in self.visited:
                    return self.DFS(f"{node.right.x}_{node.right.y}")
            self.path.pop()
            return False





# *To-Do:*
#  [ ] make a list of all the (n×n) nodes  with two for loops
#      one looping through x axis and one through y axis
#      (maybe use a list comprehension). While making the
#      instances, just add the coordinate positions, not the
#      connections. Then loop through all the  nodes, and
#      connect them with their 4 surrounding nodes if no wall
#      is there.
#  [ ] Delete the unnecessary nodes connecting straight paths 
#  [ ] DFS (with randomised decisions): start from the "start" 
#      (0,0) and run DFS, whenever you move into an edge which
#      will take you to a  node already visited, just skip that
#      edge and and go to the next edge available.

if __name__ == "__main__":
    from json import load
    # from pprint import pprint

    with open("maze.json") as f: data = load(f)


    # points = []

    # for i in range(2000):
    #     maze = Graph(data)
    #     maze.DFS()
    #     # print(maze.steps)
    #     points.append(maze.steps)
    #     del maze
    #     if i == 5 and len(list(set(points))) < 2:
    #         print("All the same")
    #         break

    # for i in maze.visited:
    #     print(f"({i.x}, {i.y})", end=", ")
    # print(sum(points)/len(points))
    
    
    g = Graph(data)
    
    g.DFS()
    
    print(g.path)