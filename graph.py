class Node:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.up = None
        self.down = None
        self.left = None
        self.right = None
        self.isvisited = False

    def __repr__(self):
        rep = [self.x,self.y]
        if self.up != None:
            rep.append("up")
        if self.down != None:
            rep.append("down")
        if self.left != None:
            rep.append("left")
        if self.right != None:
            rep.append("right")
        return str(rep)

    def remextra(self):
        if self.up!= None and self.up.up!= None:
            if self.up.right==None and self.up.left==None:
                self.up = self.up.up
        if self.down!= None and self.down.down!= None:
            if self.down.right==None and self.down.left==None:
                self.down = self.down.down
        if self.left!= None and self.left.left!= None:
            if self.left.up==None and self.left.down==None:
                self.left = self.left.left
        if self.right!= None and self.right.right!= None:
            if self.right.up==None and self.right.down==None:
                self.right = self.right.right

    def rec_print(self,dir):
        #dir is the direction in which one travels to get to next node
        if self.isvisited == False:
            print(self)
            self.isvisited=True
            if self.up!= None and dir!='down':
                self.up.rec_print('up')
            if self.down!= None and dir!='up':
                self.down.rec_print('down')
            if self.left!= None and dir!='right':
                self.left.rec_print('left')
            if self.right!= None and dir!='left':
                self.right.rec_print('right')

class Graph:
    def __init__(self, info):
        self.start = None
        self.info = info
        self.nodes = []

# nlist = [node,...]
def nodelist(n):
    nlist = [Node(i,j) for i in range(n) for j in range(n)]
    return nlist

# jsondata = dict{"edges":dict{"positionPosition": 1/0}, 'end':"position"}
def connect_node(n,nlist,jsondata):
    for node in nlist:
        x,y = node.x,node.y
        if jsondata["edges"]["E[V_"+str(x)+'_'+str(y)+"][V_"+str(x+1)+'_'+str(y)+']'] == 0:
            node.up = nlist[n*x+y-1]
        if jsondata["edges"]["E[V_"+str(x)+'_'+str(y)+"][V_"+str(x)+'_'+str(y+1)+']'] == 0:
            node.left = nlist[n*(x-1)+y]
        if jsondata["edges"]["E[V_"+str(x)+'_'+str(y+1)+"][V_"+str(x+1)+'_'+str(y+1)+']'] == 0:
            node.down = nlist[n*x+y+1]
        if jsondata["edges"]["E[V_"+str(x+1)+'_'+str(y)+"][V_"+str(x+1)+'_'+str(y+1)+']'] == 0:
            node.right = nlist[n*(x+1)+y]

def rem_extra_node(nlist):
    for node in nlist:
        node.remextra()
        
def resetvisit(nlist):
    for node in nlist:
        node.isvisited = False

def digestdata(n,jsondata):
    nlist = nodelist(n)
    connect_node(n,nlist,jsondata)
    for i in range(5):
        rem_extra_node(nlist)
    return nlist[0]