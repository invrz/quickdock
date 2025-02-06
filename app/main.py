import json
import threading
from pystray import Icon, MenuItem, Menu
from PIL import Image
import webview
import startup_options
import menu_options
from listener import Listener
import os

def read_template_from_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)
    
def read_preferences_from_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)

def listenerLogic(webUIObj):
    webUIObj.hide()
    listener = Listener(webUIObj)
    listener.start_listening()

def start_application():
        # Assuming preferences file exists and is named 'preferences.json' in the same directory
    preferences = read_preferences_from_json('./data/preferences.json')
    #preferences = read_preferences_from_json('./data/preferences.json')

    # Run preferences check
    startup_options.run_at_startup(preferences.get("runAtStartup"))
    
    webUI = webview.create_window("QuickDock", "http://localhost:8000/", width=0, height=0, frameless=True, on_top=True)
    webview.start(listenerLogic, webUI)

    # Start the listener
    # listener_thread = threading.Thread(target=listener.start_listening)
    # listener_thread.start()
    
    # Create a system tray icon
    create_tray_icon()

def create_tray_icon():
    currentPreferences = read_preferences_from_json('./data/preferences.json')

    # Define icon image and menu options
    icon_image = Image.open("./assets/icon.png")  # Replace "icon.png" with your icon file

    checkUnicode = '\u2713'
    startupOptionText = 'Run at startup' if currentPreferences.get("runAtStartup") else 'Run at startup'
    startupOptionState = currentPreferences.get("runAtStartup")

    historyOptionText = 'Save historical data' if currentPreferences.get("saveHistoricalData") else 'Save historical data'
    historyOptionState = currentPreferences.get("saveHistoricalData")

    def startupToggle(icon, item):
        menu_options.toggle_run_at_startup()
        global startupOptionState
        startupOptionState = not item.checked
        icon.update_menu()

    def historyToggle(icon, item):
        menu_options.toggle_historical_data()
        global startupOptionState
        startupOptionState = not item.checked
        icon.update_menu()

    # Create the tray icon
    icon = Icon("Keyboard Heatmap Generator", icon_image, "Invrz Keyboard Server", menu = Menu(
            MenuItem('Open', menu_options.open_react_ui), 
            MenuItem('Open data folder', menu_options.open_data_folder), 
            MenuItem('Exit', menu_options.exit_app), 
            Menu.SEPARATOR, 
            MenuItem(startupOptionText, startupToggle, checked=lambda MenuItem: startupOptionState), 
            MenuItem(historyOptionText, historyToggle, checked=lambda MenuItem: historyOptionState)
        )
    )

    icon.run()

    

if __name__ == "__main__":

    # Start app after tray icon creation
    start_application()

