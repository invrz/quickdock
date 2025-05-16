import webview
from jsapi import API

SINGLE_INSTANCE_PORT = 23897

# Global WebView instances
webview_instances = {}

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
    )

    # Helper UI
    webview_instances['helper'] = webview.create_window(
        "GhostDeck Helper",
        "http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/#helper",
        width=600,
        height=400,
        resizable=True,
        js_api=api,
        hidden=True,
    )

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