import winshell
import os

def create_shortcut(target_path, startup_path):
    shortcut_path = os.path.join(startup_path, 'GhostDeck.lnk')
    icon_path = os.path.join(os.getcwd(), 'assets', 'icon.ico')
    try:
        with winshell.shortcut(shortcut_path) as link:
            link.path = target_path
            link.working_directory = os.path.dirname(target_path)
            link.icon_location = (icon_path, 0)
    except Exception as e:
        print(f"Error creating shortcut: {e}")

def run_at_startup(preffered, logger):
    startup_folder = winshell.startup()
    exe_path = os.path.join(os.getcwd(), 'GhostDeck.exe')
    shortcut_name = 'GhostDeck.lnk'
    shortcut_path = os.path.join(startup_folder, shortcut_name)

    if preffered:
        try:
            if os.path.exists(exe_path):
                if not os.path.exists(shortcut_path):
                    create_shortcut(exe_path, startup_folder)
                else:
                    # Check if the existing shortcut points to the correct executable
                    with winshell.shortcut(shortcut_path) as link:
                        existing_target = link.path
                        if existing_target != exe_path:
                            create_shortcut(exe_path, startup_folder)
                        else:
                            print("Startup shortcut already exists")
            else:
                raise Exception("GhostDeck.exe doesn't exist, is the app installed properly?")
        except Exception as e:
            logger.write(f"Error creating startup shortcut: {str(e)}\n")
            raise
    else:
        if os.path.exists(shortcut_path):
            os.remove(shortcut_path)

