import threading
from listener import Listener
from tray_manager import create_tray_icon
from webview_manager import initialize_webviews, start_webviews
from preferences import load_preferences
from configure_startup import run_at_startup

SINGLE_INSTANCE_PORT = 23897

def start_application(logger):
    try:
        # Load user preferences
        preferences = load_preferences('./data/preferences.json')

        # Configure startup options
        startup_config = next((item for item in preferences if item["settingName"] == "runAtStartup"), {}).get("settingValue", "false") == "true"
        run_at_startup(startup_config, logger)

        # Initialize WebView windows
        initialize_webviews()

        # Start the tray icon in a separate thread
        tray_thread = threading.Thread(target=create_tray_icon)
        tray_thread.start()
        
        # Start the hotkey listener in a separate thread
        listener = Listener()
        listener_thread = threading.Thread(target=listener.start_listening, daemon=True)
        listener_thread.start()

        # Start the WebView event loop on the main thread
        start_webviews()
    except Exception as e:
        logger.write(f"Error in start_application: {str(e)}\n")
        raise

if __name__ == "__main__":
    start_application()