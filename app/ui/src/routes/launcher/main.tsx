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
                        launchApp(selectedApp)
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
                    setSelectedApp(appListToRender[currentIndex - 1].appName.appName);
                }
                else {
                    setSelectedApp(appListToRender[appListToRender.length - 1].appName.appName);
                }
            }
            else if (event.key === 'ArrowRight') {
                const currentIndex = appListToRender.findIndex((app) => app.appName.appName === selectedApp);
                if (currentIndex < appListToRender.length - 1) {
                    setSelectedApp(appListToRender[currentIndex + 1].appName.appName);
                    const hoveredAppPrev = document.querySelector("#app-id-" + (currentIndex)) as HTMLElement;
                    if (hoveredAppPrev) {
                        hoveredAppPrev.classList.remove("app-icon-hovered");
                    }
                    const hoveredApp = document.querySelector("#app-id-" + (currentIndex + 1)) as HTMLElement;
                    if (hoveredApp) {
                        hoveredApp.classList.add("app-icon-hovered");
                    }
                }
                else {
                    setSelectedApp(appListToRender[0].appName.appName);
                    const hoveredAppPrev = document.querySelector("#app-id-" + (appListToRender.length - 1)) as HTMLElement;
                    if (hoveredAppPrev) {
                        hoveredAppPrev.classList.remove("app-icon-hovered");
                    }
                    const hoveredApp = document.querySelector("#app-id-" + (0)) as HTMLElement;
                    if (hoveredApp) {
                        hoveredApp.classList.add("app-icon-hovered");
                    }
                }
            }
            else if(event.key === 'ArrowUp') {
                const currentIndex = appListToRender.findIndex((app) => app.appName.appName === selectedApp);
                const newIndex = (currentIndex - 8) % appListToRender.length + 1;
                setSelectedApp(appListToRender[newIndex].appName.appName);
            }
            else if(event.key === 'ArrowDown') {
                const currentIndex = appListToRender.findIndex((app) => app.appName.appName === selectedApp);
                const newIndex = (currentIndex + 8) % appListToRender.length - 2;
                setSelectedApp(appListToRender[newIndex].appName.appName);
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
                            onMouseOver={() => setSelectedApp(app.appName.appName)}
                            onMouseOut={() => setSelectedApp("Start Typing To Search")}
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