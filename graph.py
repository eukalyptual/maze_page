def digest_data(data):
    # digest data
    pass

 










class Node:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.up = None
        self.down = None
        self.left = None
        self.right = None

class Graph:
    def __init__(self, info):
        self.start = None
        self.info = info
        self.nodes = []
    
    # def put
