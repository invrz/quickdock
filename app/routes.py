# from http.server import SimpleHTTPRequestHandler 
import http
import json
import base64
import os
import shutil
import sys

import screeninfo
import webview

from appList import get_uninstallable_apps
from icon_extractor import extract_icon_as_blob
from webview_manager import get_webview_instance

SINGLE_INSTANCE_PORT = 23897

def MakeHandlerClassWithBakedInDirectory(directory):

  class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
      super().__init__(*args, **kwargs, directory=directory)

    ##########################################################################
    #                                                                        #
    #                          GET REQUESTS ABOVE                            #
    #                         POST REQUESTS BELOW                            #
    #                                                                        #
    ##########################################################################

    def do_POST(self):
        if self.path == '/test':  # Define an endpoint to launch apps
            self.handle_test()
        elif self.path == '/launch_app':  # Define an endpoint to launch apps
            self.handle_launch_app()
        if self.path == '/show_helper_ui':  # Define an endpoint to launch apps
            self.getShowHelperUi()
        elif self.path == '/getFilesList':  # Define an endpoint to get apps list
            self.getFileList()
        elif self.path == '/setFilesList':  # Define an endpoint to get apps list
            self.setFileList()
        elif self.path == '/getPreferences':  # Define an endpoint to get apps list
            self.getPreferences()
        elif self.path == '/setPreferences':  # Define an endpoint to get apps list
            self.setPreferences()
        elif self.path == '/getInstalledApps':  # Define an endpoint to get apps list
            self.getInstalledApps()    
        elif self.path == '/getInstalledAppIcon':  # Define an endpoint to get apps list
            self.getInstalledAppIcon()    
        elif self.path == '/pickUpFile':  # Define an endpoint to get apps list
            self.pickUpFile()    
        elif self.path == '/pickUpImage':  # Define an endpoint to get apps list
            self.pickUpImage()    
        else:
            # Handle other POST requests
            self.send_response(404)
            self.end_headers()

    def handle_test(self):
       post_data = "test"
       response_obj = {
         "status": "success",
         "message": "POST request received successfully",
         "data": post_data  # Echo the received data
       }
       response_json = json.dumps(response_obj)
       self.send_response(200)
       self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
       self.send_header('Content-Length', str(len(response_json)))  # Set content length
       self.end_headers()
       self.wfile.write(response_json.encode('utf-8'))

    def pickUpImage(self):
      try:
        if sys.platform.startswith('win'):
            file_types = ('Image Files (*.bmp;*.jpg;*.gif)', 'All files (*.*)')
        elif sys.platform.startswith('darwin'):
            file_types = (('Applications', '*.app'), ('All Files', '*.*'))
        else:
            file_types = (('All Files', '*.*'),)

        # Create ./ui/dist/public/images directory if it doesn't exist
        if not os.path.exists('./ui/dist/public/images'):
            os.makedirs('./ui/dist/public/images')

        # Create a hidden webview window to open the file picker dialog        
        filePickerUI = webview.create_window("File Picker", "http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/launcher", width=0, height=0, hidden=True)
        selected_file = filePickerUI.create_file_dialog(webview.OPEN_DIALOG, allow_multiple=False, file_types=file_types)
        if selected_file:
            print("Selected file on base:", selected_file[0])
            # copy selected image to cwd/ui/dist/public/images and return the file path from the cwd/ui/dist/public/images
            shutil.copy(selected_file[0], f'./ui/dist/public/images/{os.path.basename(selected_file[0])}')
            filename = f'/public/images/{os.path.basename(selected_file[0])}'
            print("Selected file on local:", filename)

            response_obj = {
              "statusCode": 200,
              "status": "success",
              "message": "GET request received successfully",
              "data": filename  # Echo the received data
            }
            
            response_json = json.dumps(response_obj)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
            self.send_header('Content-Length', str(len(response_json)))  # Set content length
            self.end_headers()
            self.wfile.write(response_json.encode('utf-8'))
      except Exception as e:
        response_obj = {
          "statusCode": 404,
          "status": "failed",
          "message": "GET request failed",
          "data": {"value": "unable to get file"}  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(404)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))

    def pickUpFile(self):
      try:
        if sys.platform.startswith('win'):
            file_types = ('Image Files (*.bmp;*.jpg;*.gif)', 'All files (*.*)')
        elif sys.platform.startswith('darwin'):
            file_types = (('Applications', '*.app'), ('All Files', '*.*'))
        else:
            file_types = (('All Files', '*.*'),)

        filePickerUI = webview.create_window("File Picker", "http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/launcher", width=0, height=0, hidden=True)
        selected_file = filePickerUI.create_file_dialog(
            webview.OPEN_DIALOG, allow_multiple=False, file_types=file_types
        )
        if selected_file:
            filename = selected_file[0]
            print("Selected file:", filename)

            response_obj = {
              "statusCode": 200,
              "status": "success",
              "message": "GET request received successfully",
              "data": filename  # Echo the received data
            }
            
            response_json = json.dumps(response_obj)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
            self.send_header('Content-Length', str(len(response_json)))  # Set content length
            self.end_headers()
            self.wfile.write(response_json.encode('utf-8'))
      except Exception as e:
        response_obj = {
          "statusCode": 404,
          "status": "failed",
          "message": "GET request failed",
          "data": {"value": "unable to get file"}  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(404)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))
       

    def getShowHelperUi(self):
      try:
        screen = screeninfo.get_monitors()[0]
        screen_width = screen.width
        screen_height = screen.height

        window_width = int(screen_width * 0.8)
        window_height = int(screen_height * 0.8)

        # Calculate the position to center the window
        window_x = (screen_width - window_width) // 2
        window_y = (screen_height - window_height) // 2
          
        helperUiObj = get_webview_instance('helper')
        helperUiObj.load_url("http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/#apps")
        helperUiObj.resize(window_width, window_height)
        helperUiObj.move(window_x, window_y)
        helperUiObj.show()
        
        post_data = "opening helper ui"
        response_obj = {
          "status": "success",
          "message": "POST request received successfully",
          "data": post_data  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))
      except:
        response_obj = {
          "statusCode": 404,
          "status": "failed",
          "message": "Launch Helper UI request failed",
          "data": {"value": "unable to launch helper ui"}  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(404)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))
      

    def handle_launch_app(self):
        # Handle launching an app based on the data in the request body
        length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(length)
        received_data = json.loads(post_data.decode('utf-8'))
        # print(received_data)
        app_name = received_data.get('app_name')
        # print(app_name)

    def getFileList(self):
      try:
        fileList = open('./data/applist.json', 'r')
        fileListData = fileList.read()
        fileList.close()

        response_obj = {
          "statusCode": 200,
          "status": "success",
          "message": "GET request received successfully",
          "data": fileListData  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))
      except:
        response_obj = {
          "statusCode": 404,
          "status": "failed",
          "message": "GET request failed",
          "data": {"value": "unable to get file"}  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(404)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))

    def getInstalledApps(self):
      try:
        fileList = get_uninstallable_apps()
        # print(fileList)

        response_obj = {
          "statusCode": 200,
          "status": "success",
          "message": "GET request received successfully",
          "data": fileList  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))
      except:
        response_obj = {
          "statusCode": 404,
          "status": "failed",
          "message": "GET request failed",
          "data": {"value": "unable to get file"}  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(404)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))

    def getInstalledAppIcon(self):
      try:
        length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(length)
        received_data = json.loads(post_data.decode('utf-8'))
        # print(received_data) # this ideally should be exe path received_data.exePath
        # get icon for this exe path and send it as response
        # always store icons in ./assets/ folder with appName as the iconFileName
        # for example icon for "7Zip" will be store as "./assets/7Zip.png"
        # if icon for an app already exists, just return the path  IconBlob
        # if icon doesn't exist, extract icon and save it in assets and return the path as IconBlob

        iconBlob = extract_icon_as_blob(received_data.get('exePath'))

        icon_base64 = base64.b64encode(iconBlob).decode('utf-8')

        response_obj = {
          "statusCode": 200,
          "status": "success",
          "message": "GET request received successfully",
          "data": icon_base64  # Echo the received data 
        }
        response_json = json.dumps(response_obj)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))
      except:
        response_obj = {
          "statusCode": 404,
          "status": "failed",
          "message": "GET request failed",
          "data": {"value": "unable to get file"}  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(404)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))

    def setFileList(self):
      try:
        # Handle launching an app based on the data in the request body
        length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(length)
        received_data = json.loads(post_data.decode('utf-8'))
        # print(received_data)
        # Save the data to a file or database
        with open('./data/applist.json', 'w') as file:
            json.dump(received_data, file)        

        response_obj = {
          "statusCode": 200,
          "status": "success",
          "message": "SET request received successfully",
          "data": received_data  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))
      except:
        response_obj = {
          "statusCode": 404,
          "status": "failed",
          "message": "GET request failed",
          "data": {"value": "unable to get file"}  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(404)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))
        
    def getPreferences(self):
      try:
        fileList = open('./data/preferences.json', 'r')
        fileListData = fileList.read()
        fileList.close()

        response_obj = {
          "statusCode": 200,
          "status": "success",
          "message": "GET request received successfully",
          "data": fileListData  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))
      except:
        response_obj = {
          "statusCode": 404,
          "status": "failed",
          "message": "GET request failed",
          "data": {"value": "unable to get file"}  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(404)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))

    def setPreferences(self):
      try:
        # Handle launching an app based on the data in the request body
        length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(length)
        received_data = json.loads(post_data.decode('utf-8'))
        # print(received_data)
        # Save the data to a file or database
        with open('./data/preferences.json', 'w') as file:
            json.dump(received_data, file)        

        response_obj = {
          "statusCode": 200,
          "status": "success",
          "message": "SET request received successfully",
          "data": received_data  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))
      except:
        response_obj = {
          "statusCode": 404,
          "status": "failed",
          "message": "GET request failed",
          "data": {"value": "unable to get file"}  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(404)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))
         

  return Handler
