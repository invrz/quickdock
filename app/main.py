import json
import os
import threading
from pystray import Icon, MenuItem, Menu
from PIL import Image
import webview
from jsapi import API
import startup_options
import menu_options
from listener import Listener

def read_template_from_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)
    
def read_preferences_from_json(filename):
    if not os.path.exists(filename):
        return create_default_preferences_file()
    else:
        with open(filename, 'r') as file:
            return json.load(file)

def listenerLogic(webUIObj):
    webUIObj.hide()
    listener = Listener(webUIObj)
    listener.start_listening()

def start_webview():
    api = API()
    webUI = webview.create_window("QuickDock", "http://localhost:8000/#launcher", width=0, height=0, frameless=True, on_top=True, js_api=api)
    webview.start(listenerLogic, webUI)

def create_default_preferences_file():
    
    default_preferences = [
        {
            "settingName": "lightmode",
            "settingValue": "false",
            "settingDisplayName": "Light Mode"
        },
        {
            "settingName": "runAtStartup",
            "settingValue": "false",
            "settingDisplayName": "Run at Startup"
        },
        {
            "settingName": "showNotifications",
            "settingValue": "true",
            "settingDisplayName": "Show Notifications"
        },
        {
            "settingName": "autoUpdate",
            "settingValue": "true",
            "settingDisplayName": "Auto Update"
        },
        {
            "settingName": "defaultSearchEngine",
            "settingValue": "https://google.com/search?q=",
            "settingDisplayName": "Default Search Engine"
        }
    ]
    with open('./data/preferences.json', 'w') as file:
        json.dump(default_preferences, file)
    
    return default_preferences


def create_tray_icon():
    currentPreferences = read_preferences_from_json('./data/preferences.json')

    # Define icon image and menu options
    icon_image = Image.open("./assets/icon.png")  # Replace "icon.png" with your icon file

    checkUnicode = '\u2713'
    run_at_startup = next((item for item in currentPreferences if item["settingName"] == "runAtStartup"), {}).get("settingValue", "false") == "true"
    startupOptionText = 'Run at startup' if run_at_startup else 'Run at startup'
    startupOptionState = run_at_startup

    autoUpdate = next((item for item in currentPreferences if item["settingName"] == "autoUpdate"), {}).get("settingValue", "false") == "true"
    autoUpdateText = 'Auto Update' if autoUpdate else 'Auto Update'
    autoUpdateState = autoUpdate

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
            MenuItem('Open', menu_options.openHelperUi), 
            MenuItem('Exit', menu_options.exit_app), 
            Menu.SEPARATOR, 
            MenuItem(startupOptionText, startupToggle, checked=lambda MenuItem: startupOptionState), 
            MenuItem(autoUpdateText, historyToggle, checked=lambda MenuItem: autoUpdateState)
        )
    )

    icon.run()

def start_application():
    # Assuming preferences file exists and is named 'preferences.json' in the same directory
    preferences = read_preferences_from_json('./data/preferences.json')

    # Run preferences check
    run_at_startup = next((item for item in preferences if item["settingName"] == "runAtStartup"), {}).get("settingValue", "false") == "true"
    startup_options.run_at_startup(run_at_startup)

    # Start the tray icon in a separate thread
    tray_thread = threading.Thread(target=create_tray_icon)
    tray_thread.start()

    # Start the webview on the main thread
    start_webview()

if __name__ == "__main__":
    start_application()

