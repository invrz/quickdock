# GhostDeck
GhostDeck is a productivity app which can help you quicklaunch your favorite apps or files right from a docking window which can be toggled using keyboard shortcut "Ctrl+Space" for windows. Think of it like Elgato Streamdeck but no hardware involved, you press the hotkey combo and you get your deck.

Target audience would be people who do you know like to use some specific apps or files almost all the time they open their pc but also want their desktops to look clean and minimalist. Since GhostDeck is hidden till the hotkey combination is pressed, untill the users actively choses to open GhostDeck, they can enjoy their desktop completely unobstructed.

<br>

## Libraries
GhostDeck uses various libraries to make different parts of the app work, which includes:

- **Python**:
  - `keyboard` to listen to hotkeys.
  - `pywebview` for creating the WebView-based user interface.
  - `screeninfo` for screen resolution and positioning.
  - `pystray` for system tray integration.
  - `winshell` for startup config
- **React**:
  - React for building the frontend user interface.
  - React Router for managing routes.
  - Context API for state management.
  - Patterns UI for UI/UX

<br>

## Generate Redistributable
Follow these steps to build a standalone executable on your local system. This is useful if you want to contribute to development or prefer to build the app yourself instead of downloading a pre-built release.

1. **Build the Python Executable**
   - Open a terminal in the `/app` folder.
   - Run:
     ```bash
     pip install -r requirements.txt
     python -m PyInstaller main.spec
     ```
   - This will generate the compiled executable and supporting files in the `/dist` folder.
2. **Copy Required Folders**
   - Copy the following folders into the `/dist` folder so the executable can access all necessary files using relative paths:
     - `/logs`
     - `/data`
     - `/assets`
3. **Build the React UI**
   - Open a terminal in the `/ui` folder.
   - Run:
     ```bash
     npm install
     npm run build
     ```
   - This will generate the React build in `/ui/dist`.
4. **Copy the React Build**
   - Copy the `/ui/dist` folder into `/dist/ui/dist` so the executable can serve the UI using relative file paths.

<br>

## EOD
git add .
git commit -m "message"
git push origin dev-fs