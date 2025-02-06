# counter.py

import keyboard
import screeninfo

import menu_options

class Listener:
    def __init__(self, currWebUiObj):
        self.key_pressed_list = []
        self.webUiObj = currWebUiObj
        self.isWebUiObjVisible = False
        

    def start_listening(self):
        try:
            # Start listening to keystrokes
            self.counter_hook_id = keyboard.on_press(self.process_key_press)

        except Exception as e:
            print(f"Error starting listening: {e}")

    def stop_listening(self):
        keyboard.unhook(self.counter_hook_id)

    def clear_key_pressed_list(self):
        self.key_pressed_list = []
                
    def process_key_press(self, key_event):
        try:
            global current_word
            key = key_event.name

            self.key_pressed_list.append(key)
            print(self.key_pressed_list)
            
            if(len(self.key_pressed_list)>3 and self.key_pressed_list[-1] == "space" and self.key_pressed_list[-2] == "alt" and self.key_pressed_list[-3] == "shift" and self.key_pressed_list[-4] == "ctrl"):
                self.clear_key_pressed_list()
                self.stop_listening()
                self.webUiObj.destroy()
                menu_options.exit_app()

            if(len(self.key_pressed_list)>1 and self.key_pressed_list[-2] == "ctrl" and key=="space"):

                if(self.isWebUiObjVisible == True):
                    self.clear_key_pressed_list()
                    self.hide_main_ui()
                else:
                    self.clear_key_pressed_list()
                    self.show_main_ui()


        except Exception as e:
            print(f"Error processing key press: {e}")


    def show_main_ui(self):
        # Load the React UI
        self.webUiObj.load_url("http://localhost:8000/")

        # Resize the window to the desired dimensions
        window_width = 800
        window_height = 450
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

        # Flag that the WebView is visible
        self.isWebUiObjVisible = True

    def hide_main_ui(self):
        # Run the Electron-React UI
        # subprocess.Popen(["./ui/bin/kbrd-trkr-ui.exe"]) 
        self.webUiObj.resize(0, 0)
        self.webUiObj.hide()   
        self.webUiObj.load_html("<h1>hi</h1>")
        self.isWebUiObjVisible = False