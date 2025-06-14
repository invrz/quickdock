import webview
from jsapi import API

SINGLE_INSTANCE_PORT = 23897

# Global WebView instances
webview_instances = {}

def on_helper_closed():
    helperUiObj = get_webview_instance('helper')
    print("meh")
    if helperUiObj is not None:
        helperUiObj.resize(0, 0)
        helperUiObj.hide()
        helperUiObj.load_url("http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/#loading")
        return False  # Prevents destruction, just hides the window
    return True  # Allows destruction

def initialize_webviews():
    """
    Initialize both the launcher and helper WebView windows.
    """
    api = API()

    # Launcher UI
    webview_instances['launcher'] = webview.create_window(
        "GhostDeck Launcher",
        "http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/#launcher",
        width=800,
        height=450,
        frameless=True,
        on_top=True,
        js_api=api,
        hidden=True,
        resizable=True,
    )

    # Helper UI
    webview_instances['helper'] = webview.create_window(
        "GhostDeck Helper",
        "http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/#apps",
        width=600,
        height=400,
        resizable=True,
        js_api=api,
        hidden=True,
        frameless=True,
    )

    # webview_instances['helper'].events.closed += on_helper_closed

def start_webviews():
    """
    Start the WebView event loop.
    """
    icon_path = './assets/icon.png'
    webview.start(icon=icon_path)

def get_webview_instance(name):
    """
    Retrieve a WebView instance by name.
    """
    return webview_instances.get(name)