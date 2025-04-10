# from http.server import SimpleHTTPRequestHandler 
import http
import json

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
        print(received_data)
        app_name = received_data.get('app_name')
        print(app_name)

    def getFileList(self):
      try:
        fileList = open('./data/applist.json', 'r')
        fileListData = fileList.read()
        fileList.close()

        response_obj = {
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
          "status": "failed",
          "message": "GET request failed",
          "data": {"value": "unable to get file"}  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(200)
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
        print(received_data)
        # Save the data to a file or database
        with open('./data/applist.json', 'w') as file:
            json.dump(received_data, file)        

        response_obj = {
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
          "status": "failed",
          "message": "GET request failed",
          "data": {"value": "unable to get file"}  # Echo the received data
        }
        response_json = json.dumps(response_obj)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')  # Ensure GET response is also JSON
        self.send_header('Content-Length', str(len(response_json)))  # Set content length
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))
        
         

  return Handler
