import os
import keyboard
import screeninfo

SINGLE_INSTANCE_PORT = 23897

import webview_manager

class Listener:
    def __init__(self):
        self.key_pressed_list = []
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
            os._exit(0)
        except Exception as e:
            print(f"Error quitting app: {e}")

    def manage_main_ui(self):
        try:
            if self.isWebUiObjVisible:
                self.clear_key_pressed_list()
                self.hide_main_ui()
            else:
                self.clear_key_pressed_list()
                self.show_launcher_ui()
        except Exception as e:
            print(f"Error processing key press: {e}")

    def show_launcher_ui(self):        
        # Get screen dimensions (first monitor)
        screen = screeninfo.get_monitors()[0]
        screen_width = screen.width
        screen_height = screen.height

        window_width = int(screen_width * 0.5)
        window_height = int(screen_height * 0.5)

        # Calculate the position to center the window
        window_x = (screen_width - window_width) // 2
        window_y = (screen_height - window_height) // 2
        
        launcherUiObj = webview_manager.get_webview_instance('launcher')
        launcherUiObj.load_url("http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/#launcher")
        launcherUiObj.resize(window_width, window_height)
        launcherUiObj.move(window_x, window_y)
        launcherUiObj.show()
        self.isWebUiObjVisible = True

    def hide_main_ui(self):
        launcherUiObj = webview_manager.get_webview_instance('launcher')
        if launcherUiObj is not None:
            launcherUiObj.resize(0, 0)
            launcherUiObj.hide()
            launcherUiObj.load_url("http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/#loading")
            self.isWebUiObjVisible = False