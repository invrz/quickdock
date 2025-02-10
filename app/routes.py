import http
import json

def MakeHandlerClassWithBakedInDirectory(directory):

  class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
      super().__init__(*args, **kwargs, directory=directory)

    def do_POST(self):
        if self.path == '/test':  # Define an endpoint to launch apps
            self.handle_test()
        if self.path == '/launch_app':  # Define an endpoint to launch apps
            self.handle_launch_app()
        else:
            # Handle other POST requests
            self.send_response(404)
            self.end_headers()

    def handle_test(self):
       print("test")

    def handle_launch_app(self):
        # Handle launching an app based on the data in the request body
        length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(length)
        received_data = json.loads(post_data.decode('utf-8'))
        print(received_data)
        app_name = received_data.get('app_name')
        print(app_name)

  return Handler
