from random import randint, uniform
from queue import Queue
from datetime import datetime
import json
import requests


class Task:
    """
    Task class.
    """

    def __init__(self,
                 task_id: int,
                 path_id: int,
                 warehouse_id: int
                 ):
        self.id = task_id
        self.path_id = path_id
        self.warehouse_id = warehouse_id
        self.execution_time = uniform(1, 3)  # time in seconds required to load/unload goods onto/from the rack
        self.status = "queued"
        self.start_time = None
        self.finish_time = None
        self.__form_json()
        pass

    def start(self):
        self.status = "started"
        t = datetime.now()
        self.start_time = t.strftime('%d.%m.%Y %H:%M:%S')
        self.__form_json()

    def finish(self):
        self.status = "finished"
        t = datetime.now()
        self.finish_time = t.strftime('%d.%m.%Y %H:%M:%S')
        self.__form_json()

    def __form_json(self):
        data = {
            "id": self.id,
            "warehouse_id": self.warehouse_id,
            "path_id": self.path_id,
            "status": self.status,
            "start_time": self.start_time,
            "finish_time": self.finish_time
        }

        if (self.start_time == None):
            data["start_time"] = "Null"

        if (self.finish_time == None):
            data["finish_time"] = "Null"

        url = 'http://192.168.239.64:8080/task'

        requests.post(url, json=data)

        with open("task_file.json", "w") as write_file:
            json.dump(data, write_file)

class TaskQueue:
    """
    Task queue class.
    """
    def __init__(self, warehouse_id: int):
        self.id = warehouse_id
        self.queue = Queue()  # FIFO queue
        self.max_task_id = 0
        pass

    def put(self, path_id: int):
        self.queue.put(Task(task_id=self.max_task_id + 1, path_id=path_id, warehouse_id = self.id))
        self.max_task_id += 1

    def get_task(self):
        # method to return next task from queue
        if not self.queue.empty():
            return self.queue.get()

    def create_new_task(self):
        self.put(path_id=randint(1, 6))
