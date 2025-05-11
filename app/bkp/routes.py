# from http.server import SimpleHTTPRequestHandler 
import http
import json
import base64

from appList import get_uninstallable_apps
from icon_extractor import extract_icon_as_blob

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
