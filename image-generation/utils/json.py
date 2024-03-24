import json
from .constants import DATA_PATH

def write_json_file(obj, filename):
    with open(f'{DATA_PATH}/{filename}.json', 'w') as wf:
        json.dump(obj, wf, indent=2)

def read_json_file(filename):
    with open(f"{DATA_PATH}/{filename}.json", "r") as rf:
        obj = json.load(rf)
    return obj

