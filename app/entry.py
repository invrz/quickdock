import datetime
import os
import threading
from main import start_application
from menu_options import open_react_ui
from routes import MakeHandlerClassWithBakedInDirectory
from socketserver import TCPServer

def start_http_server():
    webdir = os.getcwd() + "\\ui\\dist"
    
    # Start the HTTP server on port 8000 with a Custom Handler to initialize server at webdir
    handler = MakeHandlerClassWithBakedInDirectory(webdir)
    httpd = TCPServer(('', 8000), handler)
    
    # Log the server starting
    print("Starting HTTP server at http://localhost:8000")
    
    # Serve forever
    httpd.serve_forever()

def main():
    logFileName = "./logs/log_" + datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S") + ".txt"
    log = open(logFileName, 'a')
    try:
        # open log file in append mode
        log.write("try block\n")
        # If trigger file exists, check if the file has same pid as current process. If not the user is trying to run a new instance and hence should run the UI application
        if os.path.exists('./trigger.lock'):
            log.write("file exists\n")
            file = open(r'trigger.lock', 'r')
            instancePID = file.read()
            if instancePID != str(os.getpid()):    
                open_react_ui()
            file.close()
        else:
            log.write("file doesnt exists\n")
            # Make a trigger file and write pid in the trigger file
            file = open(r'trigger.lock', 'w')
            file.write(str(os.getpid()))
            file.close()
            
            # Start application and the HTTP server in a separate thread
            # Start HTTP server in a background thread
            server_thread = threading.Thread(target=start_http_server)
            server_thread.daemon = True  # This ensures it stops when the main program exits
            server_thread.start()
            
            # Start application
            start_application()

            # remove lock file on application exit
            os.remove('./trigger.lock')

    except Exception as e:
        log.write(str(e) + "\n")
    finally:
        log.write("finally block\n")
        if os.path.exists('./trigger.lock'):
            file = open(r'trigger.lock', 'r')
            instancePID = file.read()
            file.close()
            if instancePID == str(os.getpid()):
                # remove lock file on application exit
                os.remove('./trigger.lock')
        log.close()

if __name__ == "__main__":
    main()

