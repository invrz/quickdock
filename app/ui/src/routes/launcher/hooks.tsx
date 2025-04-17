import {useState, useCallback} from 'react';

interface AppListItemInterface {
    appName: string;
    filePath: string;
    iconPath: string;
}

interface AppListInterface {
    appName: AppListItemInterface;
}

export const useLauncherHooks = () => {
    const [searchParam, setSearchParam] = useState("");
    const [selectedApp, setSelectedApp] = useState("");
    const [appList, setAppList] = useState<AppListInterface[]>([]);
    const [appListToRender, setAppListToRender] = useState<AppListInterface[]>([]);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [lightMode, setLightMode] = useState("false");
    const [searchEngineUrl, setSearchEngineUrl] = useState("");

    const tips = [
        "Tip: You can change the default search engine from settings.",
        "Tip: You can press Escape to clear the search bar.",
        "Tip: Use Arrow keys to navigate through the app list.",
        "Tip: Press Enter to launch the selected app."
    ];

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
        setIsLoaded(true);
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

    return {
        searchParam,
        setSearchParam,
        selectedApp,
        setSelectedApp,
        appList,
        setAppList,
        appListToRender,
        setAppListToRender,
        currentTipIndex,
        setCurrentTipIndex,
        progress,
        setProgress,
        tips,
        alphanumericKeys,
        getAppList,
        launchApp,
        filterAppList,
        handleMouseOverIcon,
        handleMouseOutIcon,
        isLoaded,
        setIsLoaded,
        lightMode,
        setLightMode,
        searchEngineUrl,
        setSearchEngineUrl,
    };
}