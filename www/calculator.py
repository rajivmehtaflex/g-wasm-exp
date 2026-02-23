import math

def add(a, b):        return a + b
def subtract(a, b):   return a - b
def multiply(a, b):   return a * b

def divide(a, b):
    return float('nan') if b == 0 else a / b

def sqrt_a(a):
    return float('nan') if a < 0 else math.sqrt(a)

def power(a, b):      return a ** b
def percentage(a, b): return a * b / 100

def modulo(a, b):
    return float('nan') if b == 0 else a % b
