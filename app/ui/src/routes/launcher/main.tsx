import { useEffect } from "react";
import { useLauncherHooks } from "./hooks";

interface PreferencesListInterface {
  settingName: string;
  settingValue: string;
  settingDisplayName: string;
}

const Launcher = () => {
  const {
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
    setCurrentTipIndex,
    setProgress,
    tips,
    alphanumericKeys,
    getAppList,
    launchApp,
    filterAppList,
    handleMouseOverIcon,
    handleMouseOutIcon,
    isLoaded,
    lightMode,
    setLightMode,
    searchEngineUrl,
    setSearchEngineUrl,
    searchBarInFocus,
    setSearchBarInFocus,
    searchBarRef,
    selectApp,
  } = useLauncherHooks();

    const SINGLE_INSTANCE_PORT = 23897

  // To avoid setAppList and setAppListToRender being unused error
  console.log(setAppList + ", " + setAppListToRender);

  useEffect(() => {
    // set prefers-color-scheme as light or dark based on settingValue
    lightMode === "true"
      ? document.querySelector("body")?.classList.add("light-theme")
      : document.querySelector("body")?.classList.remove("light-theme");
  }, [lightMode]);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 6000); // Change tip every 6 seconds

    return () => clearInterval(tipInterval); // Cleanup interval on component unmount
  }, [tips.length]);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setProgress(0); // Reset progress when the tip changes
    }, 6000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 60); // Update progress every 60ms (100 steps in 6 seconds)

    return () => {
      clearInterval(tipInterval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    filterAppList();
  }, [filterAppList]);

  // Add event listener for keyup
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 1. Alphanumeric -> focus search bar and update
      if (alphanumericKeys[event.key as keyof typeof alphanumericKeys]) {
        if (!searchBarInFocus) {
          searchBarRef.current?.focus();
          setSearchBarInFocus(true);
        }
        // setSearchParam((prev) => prev + alphanumericKeys[event.key as keyof typeof alphanumericKeys]);
        return;
      }

      // 2. Escape clears search and deselects
      if (event.key === "Escape") {
        setSearchParam("");
        setSelectedApp("Type here to search your deck or the web");
        setSearchBarInFocus(false);
        searchBarRef.current?.blur();
        return;
      }

      // 3. Backspace/Delete
      // if (event.key === "Backspace" || event.key === "Delete") {
      //   setSearchParam((prev) => prev.slice(0, -1));
      //   return;
      // }

      // 4. Enter launches app or performs web search
      if (event.key === "Enter") {
        if (appListToRender.length > 0 && selectedApp !== "Type here to search your deck or the web") {
          const currentIndex = appListToRender.findIndex(app => app.appName.appName === selectedApp);
          const path = appListToRender[currentIndex]?.appName.filePath;
          if (path) launchApp(path);
        } else {
          window.open(`${searchEngineUrl}${searchParam}`, "_blank");
          launchApp("UserDidAWebSearch");
        }
        return;
      }

      // 5. If search bar is in focus, ignore arrow navigation
      if (searchBarInFocus) return;

      // 6. Arrow Navigation
      const currentIndex = appListToRender.findIndex(app => app.isSelected);
      if (currentIndex === -1 || appListToRender.length === 0) return;

      const ROW_LENGTH = 7;
      const lastIndex = appListToRender.length - 1;
      let newIndex = currentIndex;

      switch (event.key) {
        case "ArrowLeft":
          newIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
          break;
        case "ArrowRight":
          newIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
          break;
        case "ArrowUp":
          newIndex = currentIndex - ROW_LENGTH;
          if (newIndex < 0) {
            const remainder = currentIndex % ROW_LENGTH;
            const rows = Math.floor(lastIndex / ROW_LENGTH);
            const bottomRowStart = rows * ROW_LENGTH;
            newIndex = bottomRowStart + remainder;
            if (newIndex > lastIndex) newIndex = lastIndex;
          }
          break;
        case "ArrowDown":
          newIndex = currentIndex + ROW_LENGTH;
          if (newIndex > lastIndex) newIndex = currentIndex % ROW_LENGTH;
          break;
        default:
          return;
      }

      selectApp(newIndex);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  const search = async () => {
    const dummyBody = {
      body: searchParam,
    };
    // const result = await window.pywebview.api.search_files_and_folders(searchParam);
    const req = await fetch(`http://localhost:${SINGLE_INSTANCE_PORT}/searchLocalFilesAndFolders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dummyBody),
    });
    const res = await req.json();
    if (res) {
        const parsedData = res.data;
        setSearchResults(parsedData);
    } else {
        throw new Error('Failed to search.');
    }
  }

  useEffect(() => {
    if (searchParam !== "" || searchBarInFocus) {
      // search local files and folders using jsapi
        search();
    }
  }, [searchParam]);

  useEffect(() => {
    const searchBar = document.getElementById("search-bar");

    if (searchParam !== "" || searchBarInFocus) {
      if (searchBar) {
        lightMode === "true"
          ? (searchBar.style.color = "#6700bb")
          : (searchBar.style.color = "#ffebb4");
      }
    } else {
      if (searchBar) {
        searchBar.style.color = "#000000";
        // Blur the search bar when searchParam is empty and searchBarInFocus is false
        if (!searchBarInFocus) {
          (searchBar as HTMLInputElement).blur();
        }
      }
    }
  }, [searchBarInFocus, lightMode]);

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
        if (setting.settingName === "defaultSearchEngine") {
          setSearchEngineUrl(setting.settingValue);
        }
      });
      return;
    }
    const dummyBody = {
      body: "nothing here",
    };
    const req = await fetch(`http://localhost:${SINGLE_INSTANCE_PORT}/getPreferences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dummyBody),
    });
    const res = await req.json();
    if (res.statusCode !== 200) {
      console.error("Error creating default preferences file");
      return;
    }
    const parsedData = JSON.parse(res.data);
    localStorage.setItem("preferences", res.data);
    parsedData.forEach((setting: PreferencesListInterface) => {
      if (setting.settingName === "lightmode") {
        setLightMode(setting.settingValue);
        setting.settingValue === "true"
          ? document.querySelector("body")?.classList.add("light-theme")
          : document.querySelector("body")?.classList.remove("light-theme");
      }
      if (setting.settingName === "defaultSearchEngine") {
        setSearchEngineUrl(setting.settingValue);
      }
    });
  };
  
  const iconBlobUrlCache = new Map<string, string>();

  const handleIconPathForAppList = (getIconPath: string) => {
    if (/^(https?:\/\/|data:image\/)/i.test(getIconPath)) {
      return getIconPath;
    }

    // It's likely a relative path to backend API
    if (getIconPath.length < 100) {
      return `http://localhost:${SINGLE_INSTANCE_PORT}/${getIconPath}`;
    }

    // It's base64 — check cache
    if (iconBlobUrlCache.has(getIconPath)) {
      return iconBlobUrlCache.get(getIconPath)!;
    }

    // Create blob only once
    const byteCharacters = atob(getIconPath);
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

    // Save to cache
    iconBlobUrlCache.set(getIconPath, blobUrl);

    return blobUrl;
  };

  const launchHelperUI = () => {
    const requestBody = {
      body: "nothing here",
    };
    const req = fetch(`http://localhost:${SINGLE_INSTANCE_PORT}/show_helper_ui`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    req.then((res) => {
      if (res.status !== 200) {
        console.error("Error launching Helper UI");
      }
    });
  }

  useEffect(() => {
    getAndSetPreferences();
    if (appList.length === 0) {
      getAppList();
    }
    setSelectedApp("Type here to search your deck or the web");
  }, []);

  return (
    <>
      {isLoaded ? (
        <div className="page-view bg-body text-body">
          <div className="grid-row col-width-15 col-height-10 row-middle row-center padding--small">
            <div className="grid-row col-width-15 col-height-2 row-middle row-center">
              <div className="grid-row col-height-1 col-width-15 row-middle row-center">
                <input
                  ref={searchBarRef}
                  type="text"
                  className="search-bar col-width-12 bg-body border-body--dark border--smoother text-align--center"
                  placeholder={selectedApp}
                  value={searchParam}
                  onFocus={() => setSearchBarInFocus(true)}
                  onBlur={() => setSearchBarInFocus(false)}
                  onChange={(e) => setSearchParam(e.target.value)}
                  id="search-bar"
                />
              </div>
            </div>
            {
            // searchParam === "" ? (
            //   // 1. Default Launcher View
            //   <div className="grid-row col-width-15 col-height-8 row-middle row-center">
            //     {appListToRender.map((app, index) => (
            //       <div
            //         key={index}
            //         className="padding--small"
            //         onMouseOver={() => handleMouseOverIcon(app.appName.appName)}
            //         onMouseOut={() => handleMouseOutIcon(app.appName.appName)}
            //         onClick={() => launchApp(app.appName.filePath)}
            //       >
            //         <img
            //           className="app-icon"
            //           id={"app-id-" + index}
            //           src={handleIconPathForAppList(app.appName.iconPath)}
            //           alt={app.appName.appName}
            //         />
            //       </div>
            //     ))}
            //   </div>
            // ) : 
            appListToRender.length > 0 ? (
              // 2. Filtered App View
              <div className="grid-row col-width-15 col-height-8 row-middle row-center">
                {appListToRender.map((app, index) => (
                  <div
                    key={index}
                    id={`app-id-${index}`}
                    className={`app-icon ${
                      app.isSelected
                        ? lightMode === "true"
                          ? "app-icon-hovered"
                          : "app-icon-hovered--dark"
                        : ""
                    } border--circular margin--tiny`}
                    onMouseOver={() => handleMouseOverIcon(app.appName.appName)}
                    onMouseOut={() => handleMouseOutIcon(app.appName.appName)}
                    onClick={() => launchApp(app.appName.filePath)}
                  >
                    <img
                      className="app-icon"
                      src={handleIconPathForAppList(app.appName.iconPath)}
                      alt={app.appName.appName}
                    />
                  </div>
                ))}
              </div>
            ) : appListToRender.length === 0 && searchResults.length > 0 ? (
              // 3. Fallback File Search View
              <div className="grid-row--vertical col-width-15 col-height-8 row-middle row-center">
                <div className="col-height-1 col-width-15">
                  <h3 className="text-align--center">Check these local files or press Enter to search the web</h3>
                  <h2 className="text-align--center">Hover over files to check their path(s)</h2>
                </div>
                <div className="col-height-7 col-width-15">
                    <ul className="search-results-list">
                      {searchResults.map((result, index) => (
                            <li className="tooltip-wrapper search-result-item border--none border--smoother bg-body-dark margin--small padding--small text-body" key={index} onClick={() => launchApp(result.filePath)}>
                              {result.fileName}
                              <span className="tooltip-content bg-body-dark text-body border--smooth" id={`tooltip-${index}`}>
                                {result.filePath}
                              </span>
                            </li>
                      ))}
                    </ul>
                </div>
              </div>
            ) : appListToRender.length === 0 && searchResults.length === 0 ? (
              // 4. No Results at All
              <div className="grid-row--vertical col-width-15 col-height-8 row-middle row-center">
                <h2 className="text-align--center">
                  No results found, press Enter to search the web or add new apps/files
                  <br />
                  from Control Center.<br/><br/>
                </h2>
                <button className="border--solid border--medium border-body-dark padding--small border--smoother bg-body-dark text-secondary centerCenter" onClick={launchHelperUI}>
                  Open Control Center
                </button>
              </div>
            ) : (<p>null</p>)}

          </div>
        </div>
      ) : (
        <div className="page-view bg-body text-body">
          <div className="grid-row row-top row-center row-middle col-height-10">
            <h1 id="loading-text text-align--center">Loading ...</h1>
          </div>
        </div>
      )}
    </>
  );
};

export default Launcher;
