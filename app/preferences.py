import json

def update_preferences(newPreferences, filename):
    try:
        print(newPreferences)
        with open(filename, 'w') as file:
            json.dump(newPreferences, file)
            print(filename)
    except Exception as e:
        print(f"Error writing counter to file: {e}")
    
def load_preferences(filename):
    with open(filename, 'r') as file:
        return json.load(file)