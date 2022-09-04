import  pygame
import numpy as np


def uncertainty_add(distance, angle, sigma):
    mean = np.array([distance, angle])
    cov = np.diag(sigma**2)
    distance, angle = np.random.multivariate_normal(mean, cov)
    distance = max(distance, 0)
    angle = max(angle, 0)
    return [distance, angle]


class LaserSensor:
    def __init__(self,
                 range,
                 map,
                 uncertainty,
                 resolution = 1  # 1 degree
                 ):
        self.range = range
        self.speed = 4
        self.map = map
        self.resolution = resolution
        self.sigma = np.array([uncertainty[0], uncertainty[1]])
        self.position = (0, 0)
        self.W, self.H = pygame.display.get_surface().get_size()
        self.sensedObstacles = []
    
    def distance(self, obstacle):
        return ((self.position[0] - obstacle[0])**2 + (self.position[1] - obstacle[1])**2)**0.5

    def sense_obstacle(self):
        data = []
        x1, y1 = self.position[0], self.position[1]
        for angle in np.linspace(0, 2*np.pi, int(360/self.resolution), False):
            x2, y2 = x1 + self.range * np.cos(angle), y1 + self.range * np.sin(angle)
            for i in range(100):
                u = i/100
                x = int(x1 + u * (x2 - x1))
                y = int(y1 + u * (y2 - y1))
                if 0 < x < self.W and 0 < y <self.H:
                    color = self.map.get_at((x, y))
                    if color[:3] == (0, 0, 0):
                        distance = self.distance((x, y))
                        distance, angle = uncertainty_add(distance, angle, self.sigma)
                        data.append([distance, angle, self.position])
                        break
        if len(data) > 0:
            return data
        else:
            return False