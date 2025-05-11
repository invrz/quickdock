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
    lightMode,
    setLightMode,
    searchEngineUrl,
    setSearchEngineUrl,
    searchBarInFocus,
    setSearchBarInFocus,
  } = useLauncherHooks();

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
      if (alphanumericKeys[event.key as keyof typeof alphanumericKeys]) {
        setSearchParam(
          (prev) =>
            prev + alphanumericKeys[event.key as keyof typeof alphanumericKeys]
        );
      } else if (event.key === "Enter") {
        if (appListToRender.length > 0) {
          if (selectedApp !== "Type here to search your deck or the web") {
            // get path of selected app
            const currentIndex = appListToRender.findIndex(
              (app) => app.appName.appName === selectedApp
            );
            const selectedAppPath =
              appListToRender[currentIndex].appName.filePath;
            if (selectedAppPath) {
              launchApp(selectedAppPath);
            }
          }
        } else {
          window.open(
            `${searchEngineUrl}${searchParam}`,
            "_blank"
          );
          launchApp("UserDidAWebSearch");
        }
      } else if (event.key === "Backspace" || event.key === "Delete") {
        setSearchParam((prev) => prev.slice(0, -1));
      } else if (event.key === "ArrowLeft") {
        const currentIndex = appListToRender.findIndex(
          (app) => app.appName.appName === selectedApp
        );
        if (currentIndex > 0) {
          const hoveredAppPrev = document.querySelector(
            "#app-id-" + currentIndex
          ) as HTMLElement;
          if (hoveredAppPrev) {
            hoveredAppPrev.classList.remove("app-icon-hovered");
          }
          setSelectedApp(appListToRender[currentIndex - 1].appName.appName);
          const hoveredApp = document.querySelector(
            "#app-id-" + (currentIndex - 1)
          ) as HTMLElement;
          if (hoveredApp) {
            hoveredApp.classList.add("app-icon-hovered");
          }
        } else {
          const hoveredAppPrev = document.querySelector(
            "#app-id-" + 0
          ) as HTMLElement;
          if (hoveredAppPrev) {
            hoveredAppPrev.classList.remove("app-icon-hovered");
          }
          setSelectedApp(
            appListToRender[appListToRender.length - 1].appName.appName
          );
          const hoveredApp = document.querySelector(
            "#app-id-" + (appListToRender.length - 1)
          ) as HTMLElement;
          if (hoveredApp) {
            hoveredApp.classList.add("app-icon-hovered");
          }
        }
      } else if (event.key === "ArrowRight") {
        const currentIndex = appListToRender.findIndex(
          (app) => app.appName.appName === selectedApp
        );
        if (currentIndex < appListToRender.length - 1) {
          const hoveredAppPrev = document.querySelector(
            "#app-id-" + currentIndex
          ) as HTMLElement;
          if (hoveredAppPrev) {
            hoveredAppPrev.classList.remove("app-icon-hovered");
          }
          setSelectedApp(appListToRender[currentIndex + 1].appName.appName);
          const hoveredApp = document.querySelector(
            "#app-id-" + (currentIndex + 1)
          ) as HTMLElement;
          if (hoveredApp) {
            hoveredApp.classList.add("app-icon-hovered");
          }
        } else {
          const hoveredAppPrev = document.querySelector(
            "#app-id-" + (appListToRender.length - 1)
          ) as HTMLElement;
          if (hoveredAppPrev) {
            hoveredAppPrev.classList.remove("app-icon-hovered");
          }
          setSelectedApp(appListToRender[0].appName.appName);
          const hoveredApp = document.querySelector(
            "#app-id-" + 0
          ) as HTMLElement;
          if (hoveredApp) {
            hoveredApp.classList.add("app-icon-hovered");
          }
        }
      } else if (event.key === "ArrowDown") {
        let currentIndex = appListToRender.findIndex(
          (app) => app.appName.appName === selectedApp
        );
        const hoveredAppPrev = document.querySelector(
          "#app-id-" + currentIndex
        ) as HTMLElement;
        if (hoveredAppPrev) {
          hoveredAppPrev.classList.remove("app-icon-hovered");
        }
        currentIndex = currentIndex - 7;
        if (currentIndex < 0) {
          currentIndex =
            ((currentIndex % appListToRender.length) + appListToRender.length) %
            appListToRender.length;
        }
        if (currentIndex >= 0) {
          setSelectedApp(appListToRender[currentIndex].appName.appName);
          const hoveredApp = document.querySelector(
            "#app-id-" + currentIndex
          ) as HTMLElement;
          if (hoveredApp) {
            hoveredApp.classList.add("app-icon-hovered");
          }
        } else {
          setSelectedApp(
            appListToRender[appListToRender.length - 1].appName.appName
          );
          const hoveredApp = document.querySelector(
            "#app-id-" + (appListToRender.length - 1)
          ) as HTMLElement;
          if (hoveredApp) {
            hoveredApp.classList.add("app-icon-hovered");
          }
        }
      } else if (event.key === "ArrowUp") {
        let currentIndex = appListToRender.findIndex(
          (app) => app.appName.appName === selectedApp
        );
        const hoveredAppPrev = document.querySelector(
          "#app-id-" + currentIndex
        ) as HTMLElement;
        if (hoveredAppPrev) {
          hoveredAppPrev.classList.remove("app-icon-hovered");
        }
        currentIndex = currentIndex + 7;
        if (currentIndex >= appListToRender.length) {
          currentIndex = currentIndex % appListToRender.length;
        }
        if (currentIndex <= appListToRender.length - 1) {
          setSelectedApp(appListToRender[currentIndex].appName.appName);
          const hoveredApp = document.querySelector(
            "#app-id-" + currentIndex
          ) as HTMLElement;
          if (hoveredApp) {
            hoveredApp.classList.add("app-icon-hovered");
          }
        } else {
          setSelectedApp(appListToRender[0].appName.appName);
          const hoveredApp = document.querySelector(
            "#app-id-" + 0
          ) as HTMLElement;
          if (hoveredApp) {
            hoveredApp.classList.add("app-icon-hovered");
          }
        }
      } else if (event.key === "Escape") {
        setSearchParam("");
        setSelectedApp("Type here to search your deck or the web");
        const searchBar = document.getElementById("search-bar");
        if (searchBar) {
          searchBar.style.color = "#000000";
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [appListToRender, searchParam, selectedApp]);

  useEffect(() => {
    if (searchParam !== "" || searchBarInFocus) {
      const searchBar = document.getElementById("search-bar");
      if (searchBar) {
        lightMode === "true"
          ? searchBar.style.color = "#6700bb"
          : searchBar.style.color = "#ffebb4"
      }
    } else {
      const searchBar = document.getElementById("search-bar");
      if (searchBar) {
        searchBar.style.color = "#000000";
      }
    }
  }, [searchParam, searchBarInFocus]);

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
    const req = await fetch("http://localhost:8000/getPreferences", {
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

  const handleIconPathForAppList = (getIconPath: string) => {
    if (getIconPath.length < 100) {
      return `http://localhost:8000/${getIconPath}`;
    }
    else {
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
                  type="text"
                  className="search-bar col-width-12 bg-body border-body--dark border--smoother text-align--center"
                  placeholder={selectedApp}
                  value={searchParam}
                  onFocus={() => { setSearchBarInFocus(true); }}
                  onBlur={() => { setSearchBarInFocus(false); }}
                  // autoFocus={true}
                  // onChange={(e) => {setSearchParam(e.target.value);}}
                  id="search-bar"
                />
              </div>
            </div>
          {appListToRender.length !== 0 ? (
            <div className="grid-row col-width-15 col-height-8 row-middle row-center">
              {appListToRender.map((app, index) => (
                <div
                  key={index}
                  className="padding--small"
                  onMouseOver={() => handleMouseOverIcon(app.appName.appName)}
                  onMouseOut={() => handleMouseOutIcon(app.appName.appName)}
                  onClick={() => launchApp(app.appName.filePath)}
                >
                  <img
                    className="app-icon"
                    id={"app-id-" + index}
                    src={handleIconPathForAppList(app.appName.iconPath)}
                    alt={app.appName.appName}
                  />
                </div>
              ))}
              </div>
            ) : (
              <div className="grid-row--vertical col-width-15 col-height-8 row-middle row-center">
                {
                  appList.length !== 0 && searchParam.length === 0 ? (
                    <h1 className="text-align--center">
                      No results found, press Enter <br />
                      to search the web...
                    </h1>
                  ) : (
                    <h1 className="text-align--center">
                      No quick launch apps found, <br />
                      you can add them by opening "Control Center" <br />
                      from the system tray/action center area.
                    </h1>
                  )
                }
                <br />
                <br />
                <label className="text-align--center">
                  {tips[currentTipIndex]}
                </label>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${progress}%`,
                      height: "5px",
                      color: "transparent",
                    }}
                  >
                    .
                  </div>
                </div>
              </div>
            )}
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
