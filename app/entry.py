import datetime
import os
import threading
import requests
from main import start_application
from routes import MakeHandlerClassWithBakedInDirectory
from socketserver import TCPServer
import socket

SINGLE_INSTANCE_PORT = 23897

def notify_main_instance():
    try:
        requests.post("http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/show_helper_ui")
        return
    except Exception as e:
        print("Could not notify main instance:", e)

def start_http_server():
    webdir = os.path.join(os.getcwd(), "ui", "dist")
    handler = MakeHandlerClassWithBakedInDirectory(webdir)
    httpd = TCPServer(('', SINGLE_INSTANCE_PORT), handler)
    print("Starting HTTP server at http://localhost:"+str(SINGLE_INSTANCE_PORT))
    httpd.serve_forever()

def is_main_instance_running(log):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            result = s.connect_ex(('localhost', SINGLE_INSTANCE_PORT))
            return result == 0  # Port is busy if result is 0
    except Exception as e:
        log.write(str(e) + "\n")

def main():
    logFileName = "./logs/log_" + datetime.datetime.now().strftime("%Y-%m-%d") + ".log"
    os.makedirs("./logs", exist_ok=True)
    log = open(logFileName, 'a+')
    try:
        log.write("========================= INSTANCE START =========================\n")
        if is_main_instance_running(log):
            log.write("Another instance detected. Notifying main instance to launch helper UI.\n")
            notify_main_instance()
            os._exit(0)
        else:
            log.write("No other instance detected. Starting main app.\n")
            # Start HTTP server in a background thread
            server_thread = threading.Thread(target=start_http_server)
            server_thread.daemon = True
            server_thread.start()

            # Start application
            start_application(logger=log)

    except Exception as e:
        log.write(str(e) + "\n")
    finally:
        log.write("========================= INSTANCE  EXIT =========================\n")
        log.close()
        os._exit(0)

if __name__ == "__main__":
    main()

