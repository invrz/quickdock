import datetime
import os
import threading
import requests
from main import start_application
from routes import MakeHandlerClassWithBakedInDirectory
from socketserver import TCPServer

SINGLE_INSTANCE_PORT = 23897

def notify_main_instance():
    try:
        requests.post("http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/show_helper_ui", timeout=1)
    except Exception as e:
        print("Could not notify main instance:", e)

def start_http_server():
    webdir = os.path.join(os.getcwd(), "ui", "dist")
    handler = MakeHandlerClassWithBakedInDirectory(webdir)
    httpd = TCPServer(('', SINGLE_INSTANCE_PORT), handler)
    print("Starting HTTP server at http://localhost:8000")
    httpd.serve_forever()

def is_main_instance_running():
    try:
        resp = requests.post("http://localhost:"+str(SINGLE_INSTANCE_PORT)+"/test", timeout=1)
        return resp.status_code == 200
    except Exception:
        return False

def main():
    logFileName = "./logs/log_" + datetime.datetime.now().strftime("%Y-%m-%d") + ".log"
    os.makedirs("./logs", exist_ok=True)
    log = open(logFileName, 'a')
    try:
        log.write("========================= INSTANCE START =========================\n")
        if is_main_instance_running():
            log.write("Another instance detected. Notifying main instance to launch helper UI.\n")
            notify_main_instance()
            return
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

if __name__ == "__main__":
    main()

