use rdev::{listen, Event, EventType, Key};
use std::collections::HashSet;
use std::sync::Mutex;
use once_cell::sync::Lazy;
use std::thread;
use tauri::{SystemTray, SystemTrayMenu, SystemTrayMenuItem, Manager};

static PRESSED_KEYS: Lazy<Mutex<HashSet<Key>>> = Lazy::new(|| Mutex::new(HashSet::new()));

fn main() {
    // Create the system tray menu
    let tray_menu = SystemTrayMenu::new()
        .add_item(SystemTrayMenuItem::new("Show Window").on_click(|_, _, _| {
            // When the tray item is clicked, show the window
            // You can create a window using the Manager
            // Access the window manager via `manager.create_window()`
            if let Some(window) = tauri::window::Window::new(&_manager) {
                window.show().expect("Failed to show window");
            }
        }));

    // Create the system tray icon
    let tray = SystemTray::new()
        .with_menu(tray_menu)
        .on_click(|_, _, _| {
            // Handle tray icon clicks (optional)
            println!("Tray icon clicked!");
        });

    // Start the Tauri app in the tray
    thread::spawn(move || {
        tauri::Builder::default()
            .system_tray(tray)
            .run(tauri::generate_context!())
            .expect("error while running tauri application");
    });

    // Start listening for keyboard events
    if let Err(error) = listen(callback) {
        eprintln!("Error: {:?}", error);
    }
}

fn callback(event: Event) {
    match event.event_type {
        EventType::KeyPress(key) => {
            // Lock the PRESSED_KEYS set before modifying it
            let mut pressed_keys = PRESSED_KEYS.lock().unwrap();
            pressed_keys.insert(key);

            // Check if both Ctrl and Space are held down
            if pressed_keys.contains(&Key::ControlLeft) && pressed_keys.contains(&Key::Space) {
                // Show the window when Ctrl+Space is pressed
                let manager = <dyn tauri::Manager<R>>::default();  // Create Manager
                if let Some(window) = manager.create_window("main_window", "Window", Some("some_url")) {
                    window.show().expect("Failed to show window");
                }
            }
        },
        EventType::KeyRelease(key) => {
            // Lock the PRESSED_KEYS set before modifying it
            let mut pressed_keys = PRESSED_KEYS.lock().unwrap();
            pressed_keys.remove(&key);
        },
        _ => (),
    }
}
