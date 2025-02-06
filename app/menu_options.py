import json
import sys
import winshell
import os
import subprocess

import webview

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
    filename = './ui/data/preferences.json'
    preferences = read_current_preferences_from_json(filename)
    toggleTo = not preferences['runAtStartup']
    preferences['runAtStartup'] = toggleTo
    write_new_preferences_to_json(preferences, filename)
    
    # remove lock file on application exit
    os.remove('./trigger.lock')
    os.execv(sys.executable, [sys.executable] + sys.argv)

def toggle_historical_data():
    # Change save historical behavior boolean value to reverse
    filename = './ui/data/preferences.json'
    preferences = read_current_preferences_from_json(filename)
    toggleTo = not preferences['saveHistoricalData']
    preferences['saveHistoricalData'] = toggleTo
    write_new_preferences_to_json(preferences, filename)
    
    # remove lock file on application exit
    os.remove('./trigger.lock')
    os.execv(sys.executable, [sys.executable] + sys.argv)

def open_react_ui():
    # Run the Electron-React UI
    # subprocess.Popen(["./ui/bin/kbrd-trkr-ui.exe"])    
    webview.create_window("QuickDock", "https://shivendrasaurav.vercel.app/")


def open_data_folder():
    # Open the data folder
    folder_path = "./ui/data/"
    try:
        winshell.open_folder(folder_path)
    except Exception as e:
        print("Error:", e)
        # Alternative method using subprocess (may not open exact folder)
        subprocess.Popen(f'explorer "{folder_path}"')

def exit_app():
    # remove lock file on application exit
    os.remove('./trigger.lock')
    # Placeholder function to exit the application
    os._exit(0)
