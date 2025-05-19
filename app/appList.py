# import winreg
# print("hello")
# def get_installed_apps():
#     apps = []
#     reg_paths = [
#         r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
#         r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall"
#     ]

#     for reg_path in reg_paths:
#         try:
#             key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, reg_path)
#             for i in range(0, winreg.QueryInfoKey(key)[0]):
#                 subkey_name = winreg.EnumKey(key, i)
#                 subkey = winreg.OpenKey(key, subkey_name)
#                 try:
#                     app_name = winreg.QueryValueEx(subkey, "DisplayName")[0]
#                     apps.append(app_name)
#                 except FileNotFoundError:
#                     continue
#         except FileNotFoundError:
#             continue
#     return apps


# import os
# import subprocess
# from pathlib import Path
# import win32com.client
# import time

# # Get Start Menu paths (for current user and all users)
# start_menu_paths = [
#     r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
#         r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall"
# ]

# # Function to collect .lnk files (app shortcuts)
# def find_shortcuts(paths, limit=100):
#     shortcuts = []
#     for base_path in paths:
#         for root, dirs, files in os.walk(base_path):
#             for file in files:
#                 if file.endswith(".lnk"):
#                     full_path = os.path.join(root, file)
#                     shortcuts.append(full_path)
#                     if len(shortcuts) >= limit:
#                         return shortcuts
#     return shortcuts

# # Function to resolve .lnk to target .exe
# def resolve_shortcut(path):
#     shell = win32com.client.Dispatch("WScript.Shell")
#     shortcut = shell.CreateShortcut(path)
#     return shortcut.TargetPath

# # Main logic
# shortcuts = find_shortcuts(start_menu_paths)
# print("Select an app to launch:\n")

# apps = {}
# for i, shortcut in enumerate(shortcuts, start=1):
#     name = Path(shortcut).stem
#     target = resolve_shortcut(shortcut)
#     apps[i] = target
#     print(f"{i}. {name}")

# choice = int(input("\nEnter your choice: "))
# # Launch the app
# while(choice!=101):
#     # Let user select
#     time.sleep(3)
#     selected_path = apps.get(choice)
#     if selected_path and os.path.exists(selected_path):
#         subprocess.Popen([selected_path])
#     else:
#         print("Invalid or unavailable selection.")
#     print("next choice???")
#     choice = int(input("\nEnter your choice: "))
# print(get_installed_apps())










import os
import subprocess
import winreg

# Registry locations where uninstallable apps are registered
UNINSTALL_REGISTRY_PATHS = [
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"),
    (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall"),
    (winreg.HKEY_CURRENT_USER,  r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"),
]

def get_uninstallable_apps():
    seen = set()
    apps = []

    for hive, key_path in UNINSTALL_REGISTRY_PATHS:
        try:
            key = winreg.OpenKey(hive, key_path)
        except FileNotFoundError:
            continue

        for i in range(winreg.QueryInfoKey(key)[0]):
            try:
                subkey_name = winreg.EnumKey(key, i)
                subkey = winreg.OpenKey(key, subkey_name)
                display_name, _ = winreg.QueryValueEx(subkey, "DisplayName")
                display_icon, _ = winreg.QueryValueEx(subkey, "DisplayIcon")
            except (FileNotFoundError, OSError):
                continue

            # Clean up target path (strip any ",0" or quotes)
            exe_path = display_icon.split(",")[0].strip().strip('"')
            if exe_path.lower().endswith(".exe") and os.path.exists(exe_path):
                if exe_path not in seen:
                    apps.append({"appName": display_name, "filePath": exe_path, "iconPath": display_icon})
                    seen.add(exe_path)

    return apps

def main():
    apps = get_uninstallable_apps()
    if not apps:
        print("No installed apps found via Uninstall registry keys.")
        return

    # Show the list
    # print("Installed Applications:")
    # for idx, app in enumerate(apps, start=1):
    #     print(f"{idx}. {app['name']}")

    # User selects
    try:
        choice = int(input("\nEnter the number of the app to launch (0 to quit): "))
    except ValueError:
        print("Invalid input.")
        return

    if choice <= 0 or choice > len(apps):
        print("No app launched.")
        return

    selected = apps[choice - 1]
    print(f"Launching {selected['name']}...")
    print(selected)
    subprocess.Popen([selected["path"]])

if __name__ == "__main__":
    main()
