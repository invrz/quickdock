import keyboard
import screeninfo

SINGLE_INSTANCE_PORT = 23897

from webview_manager import get_webview_instance
import menu_options

class Listener:
    def __init__(self):
        self.key_pressed_list = []
        self.webUiObj = get_webview_instance('launcher')
        self.isWebUiObjVisible = False

    def start_listening(self):
        try:
            self.counter_hook_id_1 = keyboard.add_hotkey("ctrl+space", self.manage_main_ui)
            self.counter_hook_id_2 = keyboard.add_hotkey("ctrl+shift+alt+space", self.quit_app)
        except Exception as e:
            print(f"Error starting listening: {e}")

    def stop_listening(self):
        keyboard.remove_hotkey(self.counter_hook_id_1)
        keyboard.remove_hotkey(self.counter_hook_id_2)

    def clear_key_pressed_list(self):
        self.key_pressed_list = []

    def quit_app(self):
        try:
            self.clear_key_pressed_list()
            self.stop_listening()
            self.webUiObj.destroy()
            menu_options.exit_app()
        except Exception as e:
            print(f"Error quitting app: {e}")

    def manage_main_ui(self):
        try:
            if self.isWebUiObjVisible:
                self.clear_key_pressed_list()
                self.hide_main_ui()
            else:
                self.clear_key_pressed_list()
                self.show_main_ui()
        except Exception as e:
            print(f"Error processing key press: {e}")

    def show_main_ui(self):
        # Load the React UI
        self.webUiObj.load_url("http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/#launcher")

        # Resize the window to the desired dimensions
        window_width = 900
        window_height = 600
        self.webUiObj.resize(window_width, window_height)

        # Get screen dimensions (first monitor)
        screen = screeninfo.get_monitors()[0]
        screen_width = screen.width
        screen_height = screen.height

        # Calculate the position to center the window
        window_x = (screen_width - window_width) // 2
        window_y = (screen_height - window_height) // 2

        # Move the window to the calculated position
        self.webUiObj.move(window_x, window_y)

        # Show the WebView window
        self.webUiObj.show()

        # Don't use on_top as method, it is an attribute, it makes the webview come in focus when it is shown.
        self.webUiObj.on_top = True

        # Flag that the WebView is visible
        self.isWebUiObjVisible = True

    def hide_main_ui(self):
        # Run the Electron-React UI
        self.webUiObj.resize(0, 0)
        self.webUiObj.hide()
        self.webUiObj.load_url("http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/#loading")
        self.isWebUiObjVisible = False