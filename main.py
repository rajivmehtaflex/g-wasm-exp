import math
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn


class CalcRequest(BaseModel):
    op: str
    a: float
    b: float = 0


app = FastAPI()


@app.post("/calculate")
async def calculate(request: CalcRequest) -> dict:
    """Perform calculation based on operation and operands."""
    try:
        if request.op == "add":
            result = request.a + request.b
        elif request.op == "subtract":
            result = request.a - request.b
        elif request.op == "multiply":
            result = request.a * request.b
        elif request.op == "divide":
            if request.b == 0:
                return {"error": "Division by zero"}
            result = request.a / request.b
        elif request.op == "sqrt_a":
            if request.a < 0:
                return {"error": "Cannot take square root of a negative number"}
            result = math.sqrt(request.a)
        elif request.op == "power":
            result = request.a ** request.b
        elif request.op == "percentage":
            result = request.a * request.b / 100
        elif request.op == "modulo":
            if request.b == 0:
                return {"error": "Modulo by zero"}
            result = request.a % request.b
        else:
            return {"error": f"Unknown operation: {request.op}"}

        return {"result": result}
    except Exception as e:
        return {"error": str(e)}


# Mount static files from www directory
www_dir = Path(__file__).parent / "www"
app.mount("/", StaticFiles(directory=www_dir, html=True), name="static")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
