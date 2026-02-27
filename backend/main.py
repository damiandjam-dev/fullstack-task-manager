from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    id: int
    title: str
    completed: bool = False

class TaskCreate(BaseModel):
    title: str

tasks: List[Task] = [
    Task(id=1, title="Learn FastAPI", completed=False),
    Task(id=2, title="Connect React", completed=True),
]
next_id = 3

@app.get("/")
def root():
    return {"status": "ok"}

@app.get("/tasks")
def get_tasks():
    return tasks

@app.post("/tasks")
def create_task(payload: TaskCreate):
    global next_id
    task = Task(id=next_id, title=payload.title, completed=False)
    next_id += 1
    tasks.append(task)
    return task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    global tasks
    tasks = [t for t in tasks if t.id != task_id]
    return {"deleted": task_id}
@app.put("/tasks/{task_id}")
def toggle_task(task_id: int):
    for task in tasks:
        if task.id == task_id:
            task.completed = not task.completed
            return task
    return {"error": "Task not found"}