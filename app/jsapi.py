import webview
import sys
import subprocess

class API:
    # def __init__(self, window):
    #     self.window = window

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

    def launch_application(self, file_path):
        try:
            if sys.platform.startswith('win'):
                subprocess.Popen([file_path], shell=True)
            elif sys.platform.startswith('darwin'):
                subprocess.Popen(['open', file_path])
            else:
                subprocess.Popen(['xdg-open', file_path])
            return True
        except Exception as e:
            print('Failed to launch application:', e)
            return False
