
import threading
import webview
from jsapi import API
import startup_options
from listener import Listener
from intializer import read_preferences_from_json, create_tray_icon

def listenerLogic(webUIObj):
    webUIObj.hide()
    listener = Listener(webUIObj)
    listener.start_listening()

def start_webview():
    api = API()
    webUI = webview.create_window("QuickDock", "http://localhost:8000/#launcher", width=0, height=0, frameless=True, on_top=True, js_api=api)
    webview.start(listenerLogic, webUI)


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

