from pystray import Icon, Menu, MenuItem
from PIL import Image
import menu_options
from webview_manager import get_webview_instance
from preferences import load_preferences

def open_helper_ui():
    """
    Show the helper UI WebView window.
    """
    helper_ui = get_webview_instance('helper')
    if helper_ui:
        helper_ui.show()

def create_tray_icon():
    currentPreferences = load_preferences('./data/preferences.json')

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