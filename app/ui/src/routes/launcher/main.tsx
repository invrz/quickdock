import { useEffect } from "react";
import { useLauncherHooks } from "./hooks";

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
    setIsLoaded,
  } = useLauncherHooks();

  console.log(setAppList, setAppListToRender);

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
          if (selectedApp !== "Start Typing To Search") {
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
            `https://www.google.com/search?q=${searchParam}`,
            "_blank"
          );
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
        setSelectedApp("Start Typing To Search");
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
    if (searchParam !== "") {
      const searchBar = document.getElementById("search-bar");
      if (searchBar) {
        searchBar.style.color = "#ffebb4";
      }
    } else {
      const searchBar = document.getElementById("search-bar");
      if (searchBar) {
        searchBar.style.color = "#000000";
      }
    }
  }, [searchParam]);

  useEffect(() => {
    if (appList.length === 0) {
      getAppList();
      setIsLoaded(true);
    }
    setSelectedApp("Start Typing To Search");
  }, []);

  return (
    <>
      {isLoaded ? (
        <div className="page-view bg-body text-body">
          <div className="grid-row--vertical row-top row-center col-height-10 col-width-15">
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
            {appListToRender.length !== 0 ? (
              <div className="grid-row col-width-15 row-middle row-center">
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
                      src={app.appName.iconPath}
                      alt={app.appName.appName}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid-row--vertical col-width-15 row-middle row-center col-height-6">
                <h1 className="text-align--center">
                  No results found, press Enter
                  <br /> to search the web...
                </h1>
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
                      backgroundColor: "#ffebb4",
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
