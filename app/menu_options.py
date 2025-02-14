import json
import sys
import screeninfo
import winshell
import os
import subprocess

import webview

from jsapi import API

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

def toggle_run_at_startup():
    # Change run at startup behavior boolean value to reverse
    filename = './data/preferences.json'
    preferences = read_current_preferences_from_json(filename)
    toggleTo = not preferences['runAtStartup']
    preferences['runAtStartup'] = toggleTo
    write_new_preferences_to_json(preferences, filename)
    
    # remove lock file on application exit
    os.remove('./trigger.lock')
    os.execv(sys.executable, [sys.executable] + sys.argv)

def toggle_historical_data():
    # Change save historical behavior boolean value to reverse
    filename = './data/preferences.json'
    preferences = read_current_preferences_from_json(filename)
    toggleTo = not preferences['saveHistoricalData']
    preferences['saveHistoricalData'] = toggleTo
    write_new_preferences_to_json(preferences, filename)
    
    # remove lock file on application exit
    os.remove('./trigger.lock')
    os.execv(sys.executable, [sys.executable] + sys.argv)

def openHelperUi():
    # Run the Electron-React UI

    # Get screen dimensions (first monitor)
    screen = screeninfo.get_monitors()[0]
    screen_width = screen.width
    screen_height = screen.height

    window_width = int(screen_width * 0.8)
    window_height = int(screen_height * 0.8)

    # Calculate the position to center the window
    window_x = (screen_width - window_width) // 2
    window_y = (screen_height - window_height) // 2

    api = API()
    
    helperWebUI = webview.create_window("QuickDock Control Center", "http://localhost:8000/#apps", width=window_width, height=window_height, frameless=False, on_top=False, js_api=api)
    
    # Move the window to the calculated position after webview starts
    def move_window():
        helperWebUI.move(window_x, window_y)
    
    return helperWebUI, move_window

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
    # remove lock file on application exit
    try:
        os.remove('./trigger.lock')
    except Exception as e:
        print(f"Error removing lock file: {e}")
    # Placeholder function to exit the application
    os._exit(0)
