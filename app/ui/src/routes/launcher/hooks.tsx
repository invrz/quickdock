import {useState, useCallback, useRef} from 'react';

interface AppListItemInterface {
    appName: string;
    filePath: string;
    iconPath: string;
}

interface SearchResultsInterface {
    fileName: string;
    filePath: string;
}

interface AppListInterface {
    appName: AppListItemInterface;
    isSelected: boolean;
}

export const useLauncherHooks = () => {
    const [searchResults, setSearchResults] = useState<SearchResultsInterface[]>([]);
    const [searchParam, setSearchParam] = useState("");
    const [selectedApp, setSelectedApp] = useState("");
    const [appList, setAppList] = useState<AppListInterface[]>([]);
    const [appListToRender, setAppListToRender] = useState<AppListInterface[]>([]);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [lightMode, setLightMode] = useState("false");
    const [searchEngineUrl, setSearchEngineUrl] = useState("");
    const [searchBarInFocus, setSearchBarInFocus] = useState(false);
    const searchBarRef = useRef<HTMLInputElement>(null);

    const SINGLE_INSTANCE_PORT = 23897

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
        const req = await fetch(`http://localhost:${SINGLE_INSTANCE_PORT}/getFilesList`, {
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
            if (/^(https?:\/\/|data:image\/)/i.test(filePath)) {
                // open in new browser window
                window.open(filePath, '_blank');            
                const result = await window.pywebview.api.launch_application(filePath, "website");
                if (result) {
                    console.log('Website launched successfully');
                } else {
                    alert('Failed to launch the website.');
                }
                return;
            }
            const result = await window.pywebview.api.launch_application(filePath, "launcher");
            if (result) {
                console.log('Application launched successfully');
            } else {
                alert('Failed to launch the application.');
            }
        } catch (error) {
            console.error('Error launching application:', error);
        }
    };

    const selectApp = (index: number) => {
        setAppListToRender((prevList) =>
            prevList.map((app, i) => ({
            ...app,
            isSelected: i === index,
            }))
        );
        setSelectedApp(appListToRender[index]?.appName.appName || "");
    };


    // Debounced search logic
    const filterAppList = useCallback(() => {
    const filteredAppList = appList.filter((app) =>
        app.appName.appName.toLowerCase().includes(searchParam.toLowerCase())
    );

    const updatedList = filteredAppList.map((app, index) => ({
        ...app,
        isSelected: index === 0,
    }));

    setAppListToRender(updatedList);
    setSelectedApp(updatedList[0]?.appName.appName || "");
    }, [searchParam, appList]);


    const handleMouseOverIcon = (appName: string) => {
        const index = appListToRender.findIndex(
            (app) => app.appName.appName === appName
        );
        if (index !== -1) {
            selectApp(index);
        }
    };

    const handleMouseOutIcon = (appName: string) => {
        return appName;
        // Optional: clear hover when moving out of icon area
        // selectApp(-1); // Or do nothing if keeping current selection
    };


    return {
        searchParam,
        setSearchParam,
        searchResults,
        setSearchResults,
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
        searchBarInFocus,
        setSearchBarInFocus,
        searchBarRef,
        selectApp,
    };
}