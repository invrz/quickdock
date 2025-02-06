import winshell
import os

def create_shortcut(target_path, shortcut_path):

    cmdStr = '@echo off \n' + 'cd /d ' + os.getcwd() + '\n' + 'if exist "trigger.lock" del "trigger.lock"' + '\n' + 'start "" "' + target_path + '"'
    cmdPath = ''
    
    #write dynamic command to run program at startup in directory where exe file exists
    try:
        file = open(r'startupSettings.bat', 'w')
        file.write(cmdStr)
        file.close()
    except Exception as e:
        print(f"Error writing word dictionary to file: {e}")
    # Create a shortcut pointing to the target executable
    winshell.CreateShortcut(
        Path=os.path.join(shortcut_path, 'QuickDock.lnk'),
        Target='./startupSettings.bat',
        Icon=(target_path, 0),  # You can specify an icon if needed
    )

def run_at_startup(preffered):
    startup_folder = winshell.startup()
    exe_path = 'QuickDock.exe'
    shortcut_name = 'QuickDock.lnk'
    shortcut_path = os.path.join(startup_folder, shortcut_name)

    if preffered:
        # If exe exists and shortcut doesn't exist in startup folder, create a shortcut in startup folder
        try:
            if os.path.exists(exe_path):
                # Add shortcut if it doesn't exists
                if not os.path.exists(shortcut_path):
                    create_shortcut(exe_path, startup_folder)
                elif os.path.exists(shortcut_path): 
                    # Check if the existing shortcut points to the correct executable
                    existing_target = winshell.shortcut(shortcut_path).path
                    if existing_target != exe_path:
                        create_shortcut(exe_path, startup_folder)
                    else:
                        print("Startup shortcut already exists")
                else:
                    raise Exception("Could not add QuickDock to startup")
            else:
                raise Exception("QuickDock.exe doesn't exists, is the app installed properly?")
        except Exception as e:
            print(f"Error: {str(e)}")
    else:        
        # Remove the executable or its shortcut from the startup folder
        if os.path.exists(shortcut_path):
            os.remove(shortcut_path)

