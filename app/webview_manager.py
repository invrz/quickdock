import webview
from jsapi import API

# Global WebView instances
webview_instances = {}

def initialize_webviews():
    """
    Initialize both the launcher and helper WebView windows.
    """
    api = API()

    # Launcher UI
    webview_instances['launcher'] = webview.create_window(
        "QuickDock Launcher",
        "http://localhost:8000/#launcher",
        width=800,
        height=450,
        frameless=True,
        on_top=True,
        js_api=api,
        hidden=True,
    )

    # Helper UI
    webview_instances['helper'] = webview.create_window(
        "QuickDock Helper",
        "http://localhost:8000/#helper",
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
    webview.start(icon="./assets/icon.png")

def get_webview_instance(name):
    """
    Retrieve a WebView instance by name.
    """
    return webview_instances.get(name)