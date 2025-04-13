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
    const [lightMode, setLightMode] = useState("false");

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
        const req = await fetch("http://localhost:8000/getFilesList", {
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

    const removeAppFromList = async (appFilePath: string) => {
        if (appFilePath) {
            const newFileList = appList.filter((app) => app.appName.filePath !== appFilePath);
            setAppList(newFileList);
            // Send the new app list to the backend
            const req = await fetch("http://localhost:8000/setFilesList", {
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
            const req = await fetch("http://localhost:8000/setFilesList", {
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

            toggleWindow("windowviewid");
        }
        else {
            console.error("File/App or Icon Path is missing.")
        }
    }

    const selectFile = async () => {
        try {
            const selectedFile = await window.pywebview.api.open_file_dialog();
            if (selectedFile) {
                // Get the file name with extension
                const appNameWithExtension = selectedFile.split('\\').pop()?.split('/').pop();
                if (appNameWithExtension) {
                    // Remove the file extension
                    const appName = appNameWithExtension.replace(/\.[^/.]+$/, "");
                    setAppName(appName);
                }
                setFilePath(selectedFile);
            } else {
                console.log('No file selected');
            }
        } catch (error) {
            console.error('Error selecting file:', error);
        }
    };

    const selectIcon = async () => {
        try {
            const selectedFile = await window.pywebview.api.open_imagepicker_dialog();
            if (selectedFile) {
                setIconPath(selectedFile);
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

    const launchAppFromList = async (appFilePath: string) => {
        if (!appFilePath) {
            alert('Please select an application first.');
            return;
        }
        try {
            const result = await window.pywebview.api.launch_application(appFilePath);
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
        if(windowstyle){
            if(windowstyle.style.display == "flex"){
                windowstyle.style.display = "none";
            }
            else{
                windowstyle.style.display = "flex";
                windowstyle.style.flexDirection = "column";
                windowstyle.style.alignItems = "center";
                windowstyle.style.justifyContent = "center";
            }    
        }
    }

    const getAndSetPreferences = async () => {
        const dummyBody = {
            "body": "nothing here"
        }
        const req = await fetch("http://localhost:8000/getPreferences", {
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
        parsedData.forEach((setting: PreferencesListInterface) => {
        if (setting.settingName === "lightmode") {
            setLightMode(setting.settingValue);
        }
    });  
    }

    useEffect(() => {
        getAppList();
        getAndSetPreferences();
    }, [])

    return (
        <div className="page-view bg-body text-body">
            <div className="grid-row row-top row-center col-height-10">

                <SideNav routeActive={"apps"} />

                <div className="col-width-13 padding--small col-height-auto">
                    <h1 className="heading--h1">Apps List</h1>
                    <div className="form-wrapper grid-row padding--medium">
                        <div className="col-width-12">
                            <ul className="list-view-vertical">
                                <li>
                                    <button className="primary-add-button border--none border--smooth bg-secondary-light text-secondary" onClick={()=>toggleWindow("windowviewid")}>Add New App</button>
                                </li>
                                {appList.map((app, index) => {
                                    return (
                                        <li key={index} className="list-item grid-row row-middle row-center">
                                            <div className="col-width-1">
                                                <img className="img-icon border--none" src={`http://localhost:8000/${app.appName.iconPath}`} alt={app.appName.appName} />
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

            <div className="window-view padding--large window-view--small" id="windowviewid">
                <div className="window-title bg-muted-light text-muted">
                    <span className="window-title-text">Add your favorite apps</span>
                    <button className="window-title-action bg-error border--none border--smooth" onClick={()=>toggleWindow("windowviewid")}>&nbsp;&nbsp; X &nbsp;&nbsp;</button>
                </div>
                <div className="window-content bg-body-dark text-body">
                <h2 className="heading--h2">Add a new app or file to quicklaunch</h2>
                <div className="form-wrapper grid-row row-bottom padding--small">
                    <div className="col-width-7">
                        {filePath && <h3 className="heading--h3">{appName}</h3>}
                        <br /><button className="primary-add-button border--none border--smooth bg-secondary-light text-secondary" onClick={selectFile}>Select Any App Or File</button>
                    </div>
                    <div className="col-width-1"></div>
                    <div className="col-width-7">
                        {iconPath && <div className="grid-row row-center"><img className="img-icon border--none" src={`http://localhost:8000/${iconPath}`} alt={appName} /></div>}
                        <br /><button className="primary-add-button border--none border--smooth bg-secondary-light text-secondary" onClick={selectIcon}>Select Custom Icon</button>
                    </div>
                    <div className="col-width-7">
                        <br /><br />
                        <button className="primary-add-button border--none border--smooth bg-error text-error" onClick={launchApp} disabled={!filePath}>Test Launch App</button>
                    </div>
                    <div className="col-width-1"></div>
                    <div className="col-width-7">
                        <br /><br />
                        <button className="primary-add-button border--none border--smooth bg-brand-dark text-brand" onClick={addAppToList} disabled={!filePath}>Add To List</button>
                    </div>
                </div>

                </div>
            </div>
        </div>
    );
};

export default Apps;