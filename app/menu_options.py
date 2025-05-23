import json
import screeninfo
import winshell
import webview_manager
import os
import subprocess

from intializer import update_system_tray_state

SINGLE_INSTANCE_PORT = 23897

def write_new_preferences_to_json(newPreferences, filename):
    try:
        print(newPreferences)
        with open(filename, 'w') as file:
            json.dump(newPreferences, file)
            print(filename)
    except Exception as e:
        print(f"Error writing counter to file: {e}")
    
def read_current_preferences_from_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)

def toggle_run_at_startup(icon):
    # Change run at startup behavior boolean value to reverse
    filename = './data/preferences.json'
    preferences = read_current_preferences_from_json(filename)
    run_at_startup = next((item for item in preferences if item["settingName"] == "runAtStartup"), {}).get("settingValue", "false") == "true"
    toggleTo = "true" if not run_at_startup else "false"
    for item in preferences:
        if item["settingName"] == "runAtStartup":
            item["settingValue"] = toggleTo
            break    
    write_new_preferences_to_json(preferences, filename)

    update_system_tray_state(icon)
    

def toggle_auto_update(icon):
    # Change save historical behavior boolean value to reverse
    filename = './data/preferences.json'
    preferences = read_current_preferences_from_json(filename)
    auto_update = next((item for item in preferences if item["settingName"] == "autoUpdate"), {}).get("settingValue", "false") == "true"
    toggleTo = "true" if not auto_update else "false"
    for item in preferences:
        if item["settingName"] == "autoUpdate":
            item["settingValue"] = toggleTo
            break    

    write_new_preferences_to_json(preferences, filename)

    update_system_tray_state(icon)


def openHelperUi():
    # Get screen dimensions (first monitor)
    screen = screeninfo.get_monitors()[0]
    screen_width = screen.width
    screen_height = screen.height

    window_width = int(screen_width * 0.8)
    window_height = int(screen_height * 0.8)

    # Calculate the position to center the window
    window_x = (screen_width - window_width) // 2
    window_y = (screen_height - window_height) // 2
    
    helperUiObj = webview_manager.get_webview_instance('helper')
    helperUiObj.load_url("http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/#apps")
    helperUiObj.resize(window_width, window_height)
    helperUiObj.move(window_x, window_y)
    helperUiObj.show()

def open_data_folder():
    # Open the data folder
    folder_path = "./data/"
    try:
        winshell.open_folder(folder_path)
    except Exception as e:
        print("Error:", e)
        # Alternative method using subprocess (may not open exact folder)
        subprocess.Popen(f'explorer "{folder_path}"')

def exit_app():
    os._exit(0)
