import os
import shutil
import time
from pynput.keyboard import Key, Controller
import webview
import sys
import subprocess

class API:
    # def __init__(self, window):
    #     self.window = window

    def open_imagepicker_dialog(self):
        # Open a file dialog to select an image file then copy the file to cwd/ui/dist/public/images
        if sys.platform.startswith('win'):
            file_types = ('Image Files (*.bmp;*.jpg;*.gif)', 'All files (*.*)')
        elif sys.platform.startswith('darwin'):
            file_types = (('Applications', '*.app'), ('All Files', '*.*'))
        else:
            file_types = (('All Files', '*.*'))

        # Create ./ui/dist/public/images directory if it doesn't exist
        if not os.path.exists('./ui/dist/public/images'):
            os.makedirs('./ui/dist/public/images')

        # Create a hidden webview window to open the file picker dialog        
        filePickerUI = webview.create_window("File Picker", "http://localhost:8000/launcher", width=0, height=0, hidden=True)
        selected_file = filePickerUI.create_file_dialog(webview.OPEN_DIALOG, allow_multiple=False, file_types=file_types)
        if selected_file:
            # copy selected image to cwd/ui/dist/public/images and return the file path from the cwd/ui/dist/public/images
            shutil.copy(selected_file[0], f'./ui/dist/public/images/{os.path.basename(selected_file[0])}')
            return f'/public/images/{os.path.basename(selected_file[0])}'
        else:
            return None


    def open_file_dialog(self):
        if sys.platform.startswith('win'):
            file_types = ('Image Files (*.bmp;*.jpg;*.gif)', 'All files (*.*)')
        elif sys.platform.startswith('darwin'):
            file_types = (('Applications', '*.app'), ('All Files', '*.*'))
        else:
            file_types = (('All Files', '*.*'))

        
        filePickerUI = webview.create_window("File Picker", "http://localhost:8000/launcher", width=0, height=0, hidden=True)
        selected_file = filePickerUI.create_file_dialog(webview.OPEN_DIALOG, allow_multiple=False, file_types=file_types)
        if selected_file:
            return selected_file[0]  # Return the full file path
        else:
            return None

    def launch_application(self, file_path, source):
        try:
            if sys.platform.startswith('win'):
                subprocess.Popen([file_path], shell=True)
            elif sys.platform.startswith('darwin'):
                subprocess.Popen(['open', file_path])
            else:
                subprocess.Popen(['xdg-open', file_path])
            
            if(source == "launcher"):
                keyboard = Controller()
                keyboard.press(Key.ctrl)
                keyboard.press(Key.space)
                keyboard.release(Key.space)
                keyboard.release(Key.ctrl)

                # webUiObj = webview.windows[0]
                # webUiObj.resize(0, 0)
                # webUiObj.hide()
                # webUiObj.load_url("http://localhost:8000/#loading")

            return True
        except Exception as e:
            print('Failed to launch application:', e)
            return False
