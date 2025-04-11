import { useEffect, useState, useCallback } from "react";

interface AppListItemInterface {
    appName: string;
    filePath: string;
    iconPath: string;
}

interface AppListInterface {
    appName: AppListItemInterface;
}

const Launcher = () => {
    const [searchParam, setSearchParam] = useState("");
    const [selectedApp, setSelectedApp] = useState("");
    const [appList, setAppList] = useState<AppListInterface[]>([]);
    const [appListToRender, setAppListToRender] = useState<AppListInterface[]>([]);

    const alphanumericKeys = {
        'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e', 'f': 'f', 'g': 'g',
        'h': 'h', 'i': 'i', 'j': 'j', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n',
        'o': 'o', 'p': 'p', 'q': 'q', 'r': 'r', 's': 's', 't': 't', 'u': 'u',
        'v': 'v', 'w': 'w', 'x': 'x', 'y': 'y', 'z': 'z', '0': '0', '1': '1',
        '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8',
        '9': '9', ' ': ' ', '!': '!', '@': '@', '#': '#', '$': '$', '%': '%',
        '^': '^', '&': '&', '*': '*', '(': '(', ')': ')', '-': '-', '_': '_',
        '=': '=', '+': '+', '{': '{', '}': '}', '[': '[', ']': ']', ':': ':',
        ';': ';', '"': '"', '\'': '\'', '<': '<', '>': '>', ',': ',', '.': '.',
        '/': '/', '?': '?', '\\': '\\', '|': '|', '`': '`', '~': '~'
    };

    const getAppList = async () => {
        const dummyBody = { "body": "nothing here" };
        const req = await fetch("http://localhost:8000/getFilesList", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dummyBody)
        });
        const res = await req.json();
        const parsedData = JSON.parse(res.data);
        setAppList(parsedData);
        setAppListToRender(parsedData);
    };

    const launchApp = async (filePath: string) => {
        if (!filePath) {
            alert('Please select an application first.');
            return;
        }
        try {
            const result = await window.pywebview.api.launch_application(filePath);
            if (result) {
                console.log('Application launched successfully');
            } else {
                alert('Failed to launch the application.');
            }
        } catch (error) {
            console.error('Error launching application:', error);
        }
    };

    // Debounced search logic
    const filterAppList = useCallback(() => {
        const filteredAppList = appList.filter((app) =>
            app.appName.appName.toLowerCase().includes(searchParam.toLowerCase())
        );
        setAppListToRender(filteredAppList);
    }, [searchParam, appList]);

    useEffect(() => {
        filterAppList();
    }, [filterAppList]);

    // Add event listener for keyup
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (alphanumericKeys[event.key as keyof typeof alphanumericKeys]) {
                setSearchParam((prev) => prev + alphanumericKeys[event.key as keyof typeof alphanumericKeys]);
                if(searchParam.length > 0) {
                    const searchBar = document.getElementById("search-bar");
                    if (searchBar) {
                        searchBar.style.color = "#ffebb4";
                    }
                }
                else {
                    const searchBar = document.getElementById("search-bar");
                    if (searchBar) {
                        searchBar.style.color = "#000000";
                    }
                }
            } else if (event.key === 'Enter') {
                if (appListToRender.length > 0) {
                    if (selectedApp !== "Start Typing To Search"){
                        // get path of selected app                
                        const currentIndex = appListToRender.findIndex((app) => app.appName.appName === selectedApp);
                        const selectedAppPath = appListToRender[currentIndex].appName.filePath;
                        if (selectedAppPath) {
                            launchApp(selectedAppPath);
                        }
                    }
                } else {
                    window.open(`https://www.google.com/search?q=${searchParam}`, '_blank');
                }
            } else if (event.key === 'Backspace' || event.key === 'Delete') {
                setSearchParam((prev) => prev.slice(0, -1));
                if(searchParam.length > 0) {
                    const searchBar = document.getElementById("search-bar");
                    if (searchBar) {
                        searchBar.style.color = "#ffebb4";
                    }
                }
                else {
                    const searchBar = document.getElementById("search-bar");
                    if (searchBar) {
                        searchBar.style.color = "#000000";
                    }
                }
            }
            else if (event.key === 'ArrowLeft') {
                const currentIndex = appListToRender.findIndex((app) => app.appName.appName === selectedApp);
                if (currentIndex > 0) {
                    const hoveredAppPrev = document.querySelector("#app-id-" + (currentIndex)) as HTMLElement;
                    if (hoveredAppPrev) {
                        hoveredAppPrev.classList.remove("app-icon-hovered");
                    }
                    setSelectedApp(appListToRender[currentIndex - 1].appName.appName);
                    const hoveredApp = document.querySelector("#app-id-" + (currentIndex - 1)) as HTMLElement;
                    if (hoveredApp) {
                        hoveredApp.classList.add("app-icon-hovered");
                    }
                }
                else {
                    const hoveredAppPrev = document.querySelector("#app-id-" + (0)) as HTMLElement;
                    if (hoveredAppPrev) {
                        hoveredAppPrev.classList.remove("app-icon-hovered");
                    }
                    setSelectedApp(appListToRender[appListToRender.length - 1].appName.appName);
                    const hoveredApp = document.querySelector("#app-id-" + (appListToRender.length - 1)) as HTMLElement;
                    if (hoveredApp) {
                        hoveredApp.classList.add("app-icon-hovered");
                    }
                }
            }
            else if (event.key === 'ArrowRight') {
                const currentIndex = appListToRender.findIndex((app) => app.appName.appName === selectedApp);
                if (currentIndex < appListToRender.length - 1) {
                    const hoveredAppPrev = document.querySelector("#app-id-" + (currentIndex)) as HTMLElement;
                    if (hoveredAppPrev) {
                        hoveredAppPrev.classList.remove("app-icon-hovered");
                    }
                    setSelectedApp(appListToRender[currentIndex + 1].appName.appName);
                    const hoveredApp = document.querySelector("#app-id-" + (currentIndex + 1)) as HTMLElement;
                    if (hoveredApp) {
                        hoveredApp.classList.add("app-icon-hovered");
                    }
                }
                else {
                    const hoveredAppPrev = document.querySelector("#app-id-" + (appListToRender.length - 1)) as HTMLElement;
                    if (hoveredAppPrev) {
                        hoveredAppPrev.classList.remove("app-icon-hovered");
                    }
                    setSelectedApp(appListToRender[0].appName.appName);
                    const hoveredApp = document.querySelector("#app-id-" + (0)) as HTMLElement;
                    if (hoveredApp) {
                        hoveredApp.classList.add("app-icon-hovered");
                    }
                }
            }
            else if(event.key === 'ArrowDown') {
                let currentIndex = appListToRender.findIndex((app) => app.appName.appName === selectedApp);
                const hoveredAppPrev = document.querySelector("#app-id-" + (currentIndex)) as HTMLElement;
                if (hoveredAppPrev) {
                    hoveredAppPrev.classList.remove("app-icon-hovered");
                }
                currentIndex = currentIndex - 7;
                if (currentIndex < 0) {
                    currentIndex = ((currentIndex % appListToRender.length) + appListToRender.length) % appListToRender.length;
                }
                if (currentIndex >= 0) {
                    setSelectedApp(appListToRender[currentIndex].appName.appName);
                    const hoveredApp = document.querySelector("#app-id-" + (currentIndex)) as HTMLElement;
                    if (hoveredApp) {
                        hoveredApp.classList.add("app-icon-hovered");
                    }
                }
                else {
                    setSelectedApp(appListToRender[appListToRender.length - 1].appName.appName);
                    const hoveredApp = document.querySelector("#app-id-" + (appListToRender.length - 1)) as HTMLElement;
                    if (hoveredApp) {
                        hoveredApp.classList.add("app-icon-hovered");
                    }
                }
            }
            else if(event.key === 'ArrowUp') {
                let currentIndex = appListToRender.findIndex((app) => app.appName.appName === selectedApp);
                const hoveredAppPrev = document.querySelector("#app-id-" + (currentIndex)) as HTMLElement;
                if (hoveredAppPrev) {
                    hoveredAppPrev.classList.remove("app-icon-hovered");
                }
                currentIndex = currentIndex + 7;
                if (currentIndex >= appListToRender.length) {
                    currentIndex = currentIndex % appListToRender.length;
                }
                if (currentIndex <= appListToRender.length - 1) {
                    setSelectedApp(appListToRender[currentIndex].appName.appName);
                    const hoveredApp = document.querySelector("#app-id-" + (currentIndex)) as HTMLElement;
                    if (hoveredApp) {
                        hoveredApp.classList.add("app-icon-hovered");
                    }
                }
                else {
                    setSelectedApp(appListToRender[0].appName.appName);
                    const hoveredApp = document.querySelector("#app-id-" + (0)) as HTMLElement;
                    if (hoveredApp) {
                        hoveredApp.classList.add("app-icon-hovered");
                    }
                }
            }
            else if (event.key === 'Escape') {
                setSearchParam("");
                setSelectedApp("Start Typing To Search");
                const searchBar = document.getElementById("search-bar");
                if (searchBar) {
                    searchBar.style.color = "#000000";
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [appListToRender, searchParam, selectedApp]);

    useEffect(() => {
        if (appList.length === 0) {
            getAppList();
        }
        setSelectedApp("Start Typing To Search");
    }, []);

    const handleMouseOverIcon = (appName: string) => {
        let currentIndex = appListToRender.findIndex((app) => app.appName.appName === selectedApp);
        const hoveredAppPrev = document.querySelector("#app-id-" + (currentIndex)) as HTMLElement;
        if (hoveredAppPrev) {
            hoveredAppPrev.classList.remove("app-icon-hovered");
        }
        setSelectedApp(appName);
        currentIndex = appListToRender.findIndex((app) => app.appName.appName === appName)
        const hoveredApp = document.querySelector("#app-id-" + currentIndex) as HTMLElement;
        if (hoveredApp) {
            hoveredApp.classList.add("app-icon-hovered");
        }
    }
    const handleMouseOutIcon = (appName: string) => {
        let currentIndex = appListToRender.findIndex((app) => app.appName.appName === appName);
        const hoveredAppPrev = document.querySelector("#app-id-" + (currentIndex)) as HTMLElement;
        if (hoveredAppPrev) {
            hoveredAppPrev.classList.remove("app-icon-hovered");
        }
        setSelectedApp("Start Typing To Search");
    }


    return (
        <div className="page-view bg-body text-body">
            <div className="grid-row--vertical row-top row-center col-height-10">
                <br />
                <div className="grid-row col-width-15">
                    <input
                        type="text"
                        className="col-width-15 search-bar bg-body border-body--dark border--smoother text-align--center"
                        placeholder={selectedApp}
                        value={searchParam}
                        onChange={(e) => setSearchParam(e.target.value)}
                        id="search-bar"
                    />
                </div>
                <div className="grid-row col-width-15 row-middle row-center">
                    {appListToRender.map((app, index) => (
                        <div
                            key={index}
                            className="padding--small"
                            onMouseOver={() => handleMouseOverIcon(app.appName.appName)}
                            onMouseOut={() => handleMouseOutIcon(app.appName.appName)}
                            onClick={() => launchApp(app.appName.filePath)}
                        >
                            <img className="app-icon" id={"app-id-"+index} src={app.appName.iconPath} alt={app.appName.appName} />
                        </div>
                    ))}
                </div>
                <br />
            </div>
        </div>
    );
};

export default Launcher;