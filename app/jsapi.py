import json
import os
import shutil
import webbrowser
from pynput.keyboard import Key, Controller
import webview
import sys
import subprocess

import pythoncom
import win32com.client
import webview_manager

SINGLE_INSTANCE_PORT = 23897

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
        filePickerUI = webview.create_window("File Picker", "http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/launcher", width=0, height=0, hidden=True)
        selected_file = filePickerUI.create_file_dialog(webview.OPEN_DIALOG, allow_multiple=False, file_types=file_types) # pyright: ignore[reportArgumentType]
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

        
        filePickerUI = webview.create_window("File Picker", "http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/launcher", width=0, height=0, hidden=True)
        selected_file = filePickerUI.create_file_dialog(webview.OPEN_DIALOG, allow_multiple=False, file_types=file_types) # pyright: ignore[reportArgumentType]
        if selected_file:
            return selected_file[0]  # Return the full file path
        else:
            return None

    def launch_application(self, file_path, source):
        try:
            if(source == "website cc2"):
                #in case launch from control center fails launch from here
                webbrowser.open(file_path)
                return True
            if(source == "website cc"):
                #this is handled from control center do nothing, just return
                return True
            if(source == "website2"):
                #in case launch from launcher fails launch from here
                keyboard = Controller()
                keyboard.press(Key.ctrl)
                keyboard.press(Key.space)
                keyboard.release(Key.space)
                keyboard.release(Key.ctrl)
                webbrowser.open(file_path)
                return True
            if(source == "website"):
                #this is handled from launcher, just simulate ctrl+space and return
                keyboard = Controller()
                keyboard.press(Key.ctrl)
                keyboard.press(Key.space)
                keyboard.release(Key.space)
                keyboard.release(Key.ctrl)
                return True

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

    def close_window(self):
        helperUiObj = webview_manager.get_webview_instance('helper')
        if helperUiObj is not None:
            helperUiObj.resize(0, 0)
            helperUiObj.hide()
            helperUiObj.load_url("http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/#loading")
            return False
    
    def search_files_and_folders(self, search_query):
        """
        Uses Windows Search API to find files and folders matching the search_query.
        Returns a list of dictionaries with 'name' and 'path' keys.
        """
        try:
            max_results=50
            pythoncom.CoInitialize()  # Required for COM in Python threads

            connection = win32com.client.Dispatch("ADODB.Connection")
            recordset = win32com.client.Dispatch("ADODB.Recordset")

            connection.Open("Provider=Search.CollatorDSO;Extended Properties='Application=Windows';")

            # Include both name and path in the SELECT statement
            query = f"""
            SELECT System.ItemPathDisplay, System.FileName 
            FROM SYSTEMINDEX 
            WHERE System.FileName LIKE '%{search_query}%'
            """

            recordset.Open(query, connection)

            results = []
            count = 0
            while not recordset.EOF and count < max_results:
                path = recordset.Fields.Item("System.ItemPathDisplay").Value
                name = recordset.Fields.Item("System.FileName").Value
                results.append({'fileName': name, 'filePath': path})
                recordset.MoveNext()
                count += 1

            recordset.Close()
            connection.Close()
            return json.loads(json.dumps(results))
        except Exception as e:
            print(f"Error during file search: {e}")
            return []