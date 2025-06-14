import { useEffect, useState } from "react";
import SideNav from "../../common/sidenav/main";

interface AppListItemInterface {
    appName: string;
    filePath: string;
    iconPath: string;
}

interface AppListInterface {
    appName: AppListItemInterface;
}

interface PreferencesListInterface {
    settingName: string;
    settingValue: string;
    settingDisplayName: string;
}

const Apps = () => {
    const [filePath, setFilePath] = useState('');
    const [iconPath, setIconPath] = useState('');
    const [appName, setAppName] = useState('');
    const [appList, setAppList] = useState<AppListInterface[]>([]);
    const [installedAppsList, setInstalledAppsList] = useState<AppListItemInterface[]>([]);
    const [lightMode, setLightMode] = useState("false");

    const SINGLE_INSTANCE_PORT = 23897

    useEffect(() => {
        // set prefers-color-scheme as light or dark based on settingValue
        lightMode === "true"
            ? document.querySelector("body")?.classList.add("light-theme")
            : document.querySelector("body")?.classList.remove("light-theme")
    }, [lightMode]);

    const getAppList = async () => {
        const dummyBody = {
            "body": "nothing here"
        }
        const req = await fetch(`http://localhost:${SINGLE_INSTANCE_PORT}/getFilesList`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dummyBody)
        });
        const res = await req.json();
        setAppList(JSON.parse(res.data));
        console.log(res.data);
    }

    const getInstalledAppList = async () => {
        const dummyBody = {
            "body": "nothing here"
        }
        const req = await fetch(`http://localhost:${SINGLE_INSTANCE_PORT}/getInstalledApps`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dummyBody)
        });
        const res = await req.json();
        setInstalledAppsList(res.data);
        console.log(installedAppsList);
    }

    const removeAppFromList = async (appFilePath: string) => {
        if (appFilePath) {
            const newFileList = appList.filter((app) => app.appName.filePath !== appFilePath);
            setAppList(newFileList);
            // Send the new app list to the backend
            const req = await fetch(`http://localhost:${SINGLE_INSTANCE_PORT}/setFilesList`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newFileList)
            });
            const res = await req.json();
            console.log(res);
        }
        else {
            console.error("File/App Path is missing.")
        }
    }

    const addAppToList = async () => {
        if (filePath && iconPath) {
            const fileListObj = {
                appName: { appName, filePath, iconPath }
            }
            // Create a new array with the new app added
            const newFileList = [...appList, fileListObj];
            setAppList(newFileList);
            // Send the new app list to the backend
            const req = await fetch(`http://localhost:${SINGLE_INSTANCE_PORT}/setFilesList`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newFileList)
            });
            const res = await req.json();
            console.log(res);
            // Reset the file and icon paths
            setFilePath('');
            setIconPath('');
            setAppName('');

            toggleWindow("windowviewforfile");
        }
        else {
            console.error("File/App or Icon Path is missing.")
        }
    }

    const selectFile = async () => {
        try {
            const dummyBody = {
                "body": "nothing here"
            }
            const req = await fetch(`http://localhost:${SINGLE_INSTANCE_PORT}/pickUpFile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dummyBody)
            });
            const res = await req.json();
            if (res.statusCode !== 200) {
                console.error("Error creating default preferences file");
                return;
            }
            if (res.data) {
                const appNameWithExtension = res.data.split('\\').pop()?.split('/').pop();
                if (appNameWithExtension) {
                    // Remove the file extension
                    const appName = appNameWithExtension.replace(/\.[^/.]+$/, "");
                    setAppName(appName);
                }
                setFilePath(res.data);
            } else {
                console.log('No file selected');
            }
        } catch (error) {
            console.error('Error selecting file:', error);
        }
    };

    const selectIcon = async () => {
        try {
            const dummyBody = {
                "body": "nothing here"
            }
            const req = await fetch(`http://localhost:${SINGLE_INSTANCE_PORT}/pickUpImage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dummyBody)
            });
            const res = await req.json();
            if (res.statusCode !== 200) {
                console.error("Error creating default preferences file");
                return;
            }
            if (res.data) {
                setIconPath(res.data);
            } else {
                console.log('No file selected');
            }
        } catch (error) {
            console.error('Error selecting file:', error);
        }
    };

    const launchApp = async () => {
        if (!filePath) {
            alert('Please select an application first.');
            return;
        }
        try {
            const result = await window.pywebview.api.launch_application(filePath, "control center");
            if (result) {
                console.log('Application launched successfully');
            } else {
                alert('Failed to launch the application.');
            }
        } catch (error) {
            console.error('Error launching application:', error);
        }
    };

    const launchAppFromList = async (appFilePath: string) => {
        if (!appFilePath) {
            alert('Please select an application first.');
            return;
        }
        try {
            const result = await window.pywebview.api.launch_application(appFilePath, "control center");
            if (result) {
                console.log('Application launched successfully');
            } else {
                alert('Failed to launch the application.');
            }
        } catch (error) {
            console.error('Error launching application:', error);
        }
    };

    const toggleWindow = (id: string) => {
        const windowstyle = document.getElementById(id);
        if (windowstyle) {
            if (windowstyle.style.display == "flex") {
                windowstyle.style.display = "none";
            }
            else {
                windowstyle.style.display = "flex";
                windowstyle.style.flexDirection = "column";
                windowstyle.style.alignItems = "center";
                windowstyle.style.justifyContent = "center";
            }
        }
    }

    const getAndSetPreferences = async () => {
        const preferences = localStorage.getItem("preferences");
        if (preferences) {
            const parsedData = JSON.parse(preferences);
            parsedData.forEach((setting: PreferencesListInterface) => {
                if (setting.settingName === "lightmode") {
                    setLightMode(setting.settingValue);
                    setting.settingValue === "true"
                        ? document.querySelector("body")?.classList.add("light-theme")
                        : document.querySelector("body")?.classList.remove("light-theme");
                }
            });
            return;
        }
        const dummyBody = {
            "body": "nothing here"
        }
        const req = await fetch(`http://localhost:${SINGLE_INSTANCE_PORT}/getPreferences`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dummyBody)
        });
        const res = await req.json();
        if (res.statusCode !== 200) {
            console.error("Error creating default preferences file");
            return;
        }
        const parsedData = JSON.parse(res.data);
        localStorage.setItem("preferences", JSON.stringify(res.data));
        parsedData.forEach((setting: PreferencesListInterface) => {
            if (setting.settingName === "lightmode") {
                setLightMode(setting.settingValue);
            }
        });
    }

    const handleAddAppFromInstalledAppsList = async (app: AppListItemInterface) => {
        {
            // Avoid duplicates
            const exists = appList.some(item => item.appName.filePath === app.filePath);
            if (!exists) {
            const filePath = app.filePath;
            const appName = app.appName;
            let iconPath = app.iconPath;

            const getIconPathBody = {
                "exePath": filePath,
                "appName": appName,
            }
            const iconPathReq = await fetch(`http://localhost:${SINGLE_INSTANCE_PORT}/getInstalledAppIcon`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(getIconPathBody)
            });

            const iconPathRes = await iconPathReq.json();
            iconPath = iconPathRes.data;
            
            const newItem = {
                appName: {appName, filePath, iconPath}
            }
            let newList = [...appList];
            newList.push(newItem)
            setAppList(newList);
            toggleWindow('windowviewforapp');

            // Send updated list to backend
            fetch(`http://localhost:${SINGLE_INSTANCE_PORT}/setFilesList`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(newList)
            }).then(res => res.json()).then(console.log).catch(console.error);
            }
            else{
                console.error("This app is already added to the list");
                alert("This app is already added to the list");
            }
        }
    }

    const handleIconPathForAppList = (getIconPath: string) => {
        if(getIconPath.length < 100){
            return `http://localhost:${SINGLE_INSTANCE_PORT}/${getIconPath}`;
        }
        else{
            const base64Data = getIconPath;

            // Convert base64 to Blob
            const byteCharacters = atob(base64Data);
            const byteArrays = [];

            for (let i = 0; i < byteCharacters.length; i += 512) {
                const slice = byteCharacters.slice(i, i + 512);
                const byteNumbers = new Array(slice.length);
                for (let j = 0; j < slice.length; j++) {
                byteNumbers[j] = slice.charCodeAt(j);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, { type: "image/png" });

            const blobUrl = URL.createObjectURL(blob);
            return blobUrl;
        }
    }

    const closeWebviewWindow = () => {
        window.pywebview.api.close_window();
    }

    useEffect(() => {
        getAndSetPreferences();
        getAppList();
        getInstalledAppList();
    }, [])

    return (
        <div className="page-view bg-body text-body">
            <div className="window-title bg-muted-light text-muted">
                <span className="window-title-text">GhostDeck Helper UI</span>
                <button className="window-title-action bg-error border--none border--smooth" onClick={()=>closeWebviewWindow()}>&nbsp;&nbsp; X &nbsp;&nbsp;</button>
            </div>  
            <div className="grid-row row-top row-center col-height-10">

                <SideNav routeActive={"apps"} />

                <div className="col-width-13 padding--small col-height-auto page-view">
                    <h1 className="heading--h1">Apps List</h1>
                    <div className="form-wrapper grid-row padding--medium">
                        <div className="col-width-12">
                            <ul className="list-view-vertical">
                                <li className="grid-row row-middle row-left">
                                    <div className="col-width-7">
                                        <button className="primary-add-button border--none border--smooth bg-secondary-light text-secondary" onClick={() => toggleWindow("windowviewforapp")}>Add any installed app</button>
                                    </div>
                                    <div className="col-width-7">
                                    <button className="primary-add-button border--none border--smooth bg-secondary-light text-secondary" onClick={() => toggleWindow("windowviewforfile")}>Add any image, file, shortcut or script</button>
                                    </div>
                                </li>
                                <br/>
                                {appList.map((app, index) => {
                                    return (
                                        <li key={index} className="list-item border--rounded">
                                            <div className="col-width-1">
                                                <img className="img-icon border--none" src={handleIconPathForAppList(app.appName.iconPath)} alt={app.appName.appName} />
                                            </div>
                                            <div className="col-width-10">
                                                <p className="list-item-label">{app.appName.appName}</p>
                                            </div>
                                            <div className="col-width-2">
                                                <button className="primary-add-button bg-error border--none border--smooth bg-secondary-light text-secondary" onClick={() => removeAppFromList(app.appName.filePath)}>Remove</button>
                                            </div>
                                            <div className="col-width-2">
                                                <button className="primary-add-button bg-primary border--none border--smooth bg-secondary-light text-secondary" onClick={() => launchAppFromList(app.appName.filePath)}>Test Launch</button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="window-view padding--large window-view--small" id="windowviewforfile">
                <div className="window-title bg-muted-light text-muted">
                    <span className="window-title-text">Add your favorite files</span>
                    <button className="window-title-action bg-error border--none border--smooth" onClick={() => toggleWindow("windowviewforfile")}>&nbsp;&nbsp; X &nbsp;&nbsp;</button>
                </div>
                <div className="window-content bg-body text-body">
                    <h2 className="heading--h2">Add a new file to quicklaunch</h2>
                    <div className="form-wrapper grid-row row-bottom row-center padding--small">
                        <div className="col-width-12">
                            {iconPath && <div className="grid-row row-center"><img className="img-icon border--none" src={handleIconPathForAppList(iconPath)} alt={appName} /></div>}
                            {filePath && <h3 className="heading--h3 text-align--center">{appName}</h3>}
                        </div>
                        <div className="col-width-12">
                            <button className="primary-add-button border--none border--smooth bg-secondary-light text-secondary" onClick={selectFile}>Select Any File To Quicklaunch</button>
                        </div>
                        <div className="col-width-12">
                            {filePath && <button className="primary-add-button border--none border--smooth bg-secondary-light text-secondary" onClick={selectIcon}>Select Custom Icon</button>}
                        </div>
                        <div className="col-width-12">
                            <button className="primary-add-button border--none border--smooth bg-error text-error" onClick={launchApp} disabled={!filePath}>Test Launch File</button>
                        </div>
                        <div className="col-width-12">
                            <button className="primary-add-button border--none border--smooth bg-brand-dark text-brand" onClick={addAppToList} disabled={!filePath}>Add To List</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="window-view padding--large window-view--small" id="windowviewforapp">
                <div className="window-title bg-muted-light text-muted">
                    <span className="window-title-text">Add your favorite apps</span>
                    <button className="window-title-action bg-error text-error border--none border--smooth" onClick={() => toggleWindow("windowviewforapp")}>&nbsp;&nbsp; X &nbsp;&nbsp;</button>
                </div>
                <div className="window-content bg-body text-body page-view">
                    <h2 className="heading--h2 padding--small">Add a new app to quicklaunch</h2>
                    <div className="form-wrapper grid-row row-bottom">
                        <ul className="list-view-vertical">
                            {installedAppsList.map((app, index) => (
                                <li
                                key={index}
                                className="installed-apps-list-item grid-row row-middle row-left border--smoother"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleAddAppFromInstalledAppsList(app)}
                                >
                                    <p className="installed-apps-list-item-label">{app.appName}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Apps;