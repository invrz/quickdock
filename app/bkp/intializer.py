import os
from pystray import Icon, MenuItem, Menu
from PIL import Image
import menu_options
import json

def read_template_from_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)

def read_preferences_from_json(filename):
    if not os.path.exists(filename):
        return create_default_preferences_file()
    else:
        with open(filename, 'r') as file:
            return json.load(file)

def create_default_preferences_file():

    default_preferences = [
        {
            "settingName": "lightmode",
            "settingValue": "false",
            "settingDisplayName": "Light Mode"
        },
        {
            "settingName": "runAtStartup",
            "settingValue": "true",
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
    icon_image = Image.open("./assets/icon.ico")  # Replace "icon.png" with your icon file

    checkUnicode = '\u2713'
    run_at_startup = next((item for item in currentPreferences if item["settingName"] == "runAtStartup"), {}).get("settingValue", "false") == "true"
    startupOptionText = 'Run at startup' if run_at_startup else 'Run at startup'
    startupOptionState = run_at_startup

    autoUpdate = next((item for item in currentPreferences if item["settingName"] == "autoUpdate"), {}).get("settingValue", "false") == "true"
    autoUpdateText = 'Auto Update' if autoUpdate else 'Auto Update'
    autoUpdateState = autoUpdate

    def startupToggle(icon, item):
        menu_options.toggle_run_at_startup(icon)
        global startupOptionState
        startupOptionState = not item.checked
        # icon.update_menu()

    def historyToggle(icon, item):
        menu_options.toggle_auto_update(icon)
        global startupOptionState
        startupOptionState = not item.checked
        # icon.update_menu()

    # Create the tray icon
    icon = Icon("Invrz QuickDock", icon_image, "Invrz QuickDock", menu = Menu(
            MenuItem('Open Control Center', menu_options.openHelperUi), 
            Menu.SEPARATOR, 
            MenuItem(startupOptionText, startupToggle, checked=lambda MenuItem: startupOptionState), 
            MenuItem(autoUpdateText, historyToggle, checked=lambda MenuItem: autoUpdateState),
            Menu.SEPARATOR, 
            MenuItem('Exit', menu_options.exit_app), 
        )
    )
    icon.run()

def update_system_tray_state(icon):
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
        menu_options.toggle_run_at_startup(icon)
        global startupOptionState
        startupOptionState = not item.checked
        icon.update_menu()

    def historyToggle(icon, item):
        menu_options.toggle_auto_update(icon)
        global startupOptionState
        startupOptionState = not item.checked
        icon.update_menu()


    # Stop and restart the icon with the updated menu
    icon.menu =  Menu(
            MenuItem('Open Control Center', menu_options.openHelperUi), 
            Menu.SEPARATOR, 
            MenuItem(startupOptionText, startupToggle, checked=lambda MenuItem: startupOptionState), 
            MenuItem(autoUpdateText, historyToggle, checked=lambda MenuItem: autoUpdateState),
            Menu.SEPARATOR, 
            MenuItem('Exit', menu_options.exit_app), 
        )
    icon.update_menu()

