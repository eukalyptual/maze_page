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
        
    def send(ver):
        if ver.up and ver.down and ver.right and ver.left==None:
            back()
        c=shuffle()
        if c=="up":
            Up(ver)
        if c=="down":
            Down(ver)
        if c=="right":
            Right(ver)
        if c=="left":
            Left(ver)      
    
    def Up(ver):
        if ver==end:
            return true
        if ver.up!=None:
            if ver.isvisited and ver.up.isvisited==false:
                ver.isvisited==true
                ver.up.isvisited=true
                Up(ver.up)
            if ver.isvisited==true and ver.up.isvisited==false:
                ver.up.isvisited=true
                Up(ver.up)
            if ver.isvisted==false and ver.up.isvisited==true:
                ver.isvisited==true
                send(ver)
            if ver.isviisted==true and ver.up.isvisited==true:
                if  ver.down and ver.right and ver.left==None:
                    send(ver.up)
                else:
                    send(ver)
        
        if ver.up==None:
            if ver.isvisited==true:
                send(ver)
            if ver.isvisited==false:
                ver.isvisited==true
                send(ver)     
        
    def Down(ver):
        if ver=end:
            return true
        if ver.down!=None:
            if ver.isvisited and ver.down.isvisited==false:
                ver.isvisited==true
                ver.down.isvisited=true
                Down(ver.down)
            if ver.isvisited==true and ver.down.isvisited==false:
                ver.down.isvisited=true
                Down(ver.down)
            if ver.isvisted==false and ver.down.isvisited==true:
                send(ver)
            if ver.isviisted==true and ver.down.isvisited==true:
                if ver.up and ver.left and ver.right:
                    send(ver.down)
                else:
                    send(ver)
        
        if ver.down==None:
            if ver.isvisited==true:
                send(ver)
            if ver.isvisited==false:
                ver.isvisited==true
                send(ver)
                
    def Right(ver):
        if ver=end:
            return end
        if ver.right!=None:
            if ver.isvisited and ver.right.isvisited==false:
                ver.isvisited==true
                ver.right.isvisited=true
                Right(ver.right)
            if ver.isvisited==true and ver.right.isvisited==false:
                ver.right.isvisited=true
                Right(ver.right)
            if ver.isvisted==false and ver.right.isvisited==true:
                send(ver)
            if ver.isviisted==true and ver.right.isvisited==true:
                if ver.left and ver.up and ver.down:
                    send(ver.right)
                else:
                    send(ver)
        
        if ver.right==None:
            if ver.isvisited==true:
                send(ver)
            if ver.isvisited==false:
                ver.isvisited==true
                send(ver)
                
    def Left(ver):
        if ver=end:
            return true
        if ver.left!=None:
            if ver.isvisited and ver.left.isvisited==false:
                ver.isvisited==true
                ver.left.isvisited=true
                Left(ver.left)
            if ver.isvisited==true and ver.left.isvisited==false:
                ver.left.isvisited=true
                Left(ver.left)
            if ver.isvisted==false and ver.left.isvisited==true:
                send(ver)
            if ver.isviisted==true and ver.left.isvisited==true:
                if ver.right and ver.up and ver.down:
                    send(ver.left)
                else:
                    send(ver)
        
        if ver.left==None:
            if ver.isvisited==true:
                send(ver)
            if ver.isvisited==false:
                ver.isvisited==true
                send(ver)
    
    # def put
