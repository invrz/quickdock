import { useState } from "react";

const Apps = () => {
    const [filePath, setFilePath] = useState('');
    const [iconPath, setIconPath] = useState('');
    const [appName, setAppName] = useState('');

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
            const selectedFile = await window.pywebview.api.open_file_dialog();
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

    return (
        <div className="page-view bg-body text-body">
            <div className="grid-row--vertical row-top row-middle col-height-10">
                <div className="col-width-15 padding--small">
                    <h1 className="heading--h1">Add your favorite apps</h1>
                    <div className="form-wrapper grid-row border--thin border--solid border--rounded padding--medium">
                        <div className="col-width-8">
                            {filePath && <p>Selected file: {filePath}</p>}
                            <button className="primary-add-button border--none border--smooth bg-secondary-light text-secondary" onClick={selectFile}>Select Any Application Or File</button>
                        </div>
                        <div className="col-width-7">
                            {iconPath && <p>Icon Path  :{iconPath} <br/>Icon Preview: <br /> <img className="img-icon border--none" src={iconPath.toString()} alt={appName} /><br/></p>}
                            <button className="primary-add-button border--none border--smooth bg-secondary-light text-secondary" onClick={selectIcon}>Select Custom Icon</button>
                            <br/><br/>
                        </div>
                        <div className="col-width-8">
                            <button className="primary-add-button border--none border--smooth bg-error text-error" onClick={launchApp} disabled={!filePath}>Test Launch App</button>
                        </div>
                        <div className="col-width-7">
                            <button className="primary-add-button border--none border--smooth bg-brand-dark text-brand" onClick={launchApp} disabled={!filePath}>Add To List</button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default Apps;