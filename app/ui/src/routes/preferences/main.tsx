import { useEffect, useState } from "react";
import SideNav from "../../common/sidenav/main";

interface PreferencesListInterface {
  settingName: string;
  settingValue: string;
  settingDisplayName: string;
}

const Preferences = () => {
    const [searchEngineName, setSearchEngineName] = useState("");
    const [searchEngineUrl, setSearchEngineUrl] = useState("");
    const [lightMode, setLightMode] = useState("false");

  const searchEngineOptions = [
    { Custom: "" },
    { Google: "https://google.com/search?q=" },
    { Bing: "https://www.bing.com/search?q=" },
    { DuckDuckGo: "https://duckduckgo.com/?q=" },
    { Yahoo: "https://search.yahoo.com/search?p=" },
    { Baidu: "https://www.baidu.com/s?wd=" },
    { Yandex: "https://yandex.com/search/?text=" },
  ];

  const [preferences, setPreferences] = useState<PreferencesListInterface[]>([]);
  const defaultPreferences = [
    {
      settingName: "lightmode",
      settingValue: "false",
      settingDisplayName: "Color Scheme",
    },
    {
      settingName: "runAtStartup",
      settingValue: "false",
      settingDisplayName: "Run at Startup",
    },
    {
      settingName: "showNotifications",
      settingValue: "true",
      settingDisplayName: "Show Notifications",
    },
    {
      settingName: "autoUpdate",
      settingValue: "true",
      settingDisplayName: "Auto Update",
    },
    {
      settingName: "defaultSearchEngine",
      settingValue: "https://google.com/search?q=",
      settingDisplayName: "Default Search Engine",
    },
  ]

  useEffect(() => {
    // set prefers-color-scheme as light or dark based on settingValue
        lightMode === "true" 
            ? document.querySelector("body")?.classList.add("light-theme")
            : document.querySelector("body")?.classList.remove("light-theme")
  }, [lightMode]);

  const getPreferences = async () => {
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
      // preference file not found, create a new one using default values
      const req = await fetch("http://localhost:8000/setPreferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(defaultPreferences),
      });
      const res = await req.json();
      if (res.statusCode !== 200) {
        console.error("Error creating default preferences file");
        return;
      }
      setPreferences(defaultPreferences);
      setSearchEngineName("Google");
      setSearchEngineUrl("https://google.com/search?q=");
    }
    const parsedData = JSON.parse(res.data);
    setPreferences(parsedData);
    parsedData.forEach((setting: PreferencesListInterface) => {
        if (setting.settingName === "defaultSearchEngine") {
            setSearchEngineUrl(setting.settingValue);
            searchEngineOptions.forEach(sE => {
                if (Object.values(sE)[0] === setting.settingValue) {
                    setSearchEngineName(Object.keys(sE)[0]);
                }
                else{
                    setSearchEngineName("Custom");
                }
            });
        }
        else if (setting.settingName === "lightmode") {
            setLightMode(setting.settingValue);
        }
    });    
  };

  const updatePreferences = async (
    setting: string,
    updatedValue: boolean | string
  ) => {
    const newPreferences = [...preferences];
    const index = newPreferences.findIndex(
      (pref) => pref.settingName === setting
    );
    if (index === -1) {
      alert("Preference not found");
      return;
    } else {
      newPreferences[index].settingValue = updatedValue.toString();
    }
    setPreferences(newPreferences);
    if(setting === "lightmode") {
        setLightMode(updatedValue.toString());
    }

    // Send the new app list to the backend
    const req = await fetch("http://localhost:8000/setPreferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPreferences),
    });
    const res = await req.json();
    console.log(res);
  };

  useEffect(() => {
    getPreferences();
  }, []);

  return (
    <div className="page-view bg-body text-body">
      <div className="grid-row row-top row-center col-height-10">
        <SideNav routeActive={"preferences"} />

        <div className="col-width-13 padding--small col-height-auto">
          <h1 className="heading--h1">User Preferences</h1>
          <div className="form-wrapper grid-row padding--medium">
            <div className="col-width-12">
              <ul className="list-view-vertical">
                {preferences.map((pref, index) => (
                  <li key={index} className="list-item-preferences">
                    <div className="col-width-10">
                      <p className="list-item-label">{pref.settingDisplayName}</p>
                    </div>
                    <div className="col-width-5 text-align--right">
                      {pref.settingName === "defaultSearchEngine" ? (
                        <select
                          className="list-item-select bg-body-dark text-body border--smooth border--thin border--solid"
                          value={pref.settingValue}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            const selectedName = Object.keys(
                              searchEngineOptions.find(
                                (option) =>
                                  Object.values(option)[0] === selectedValue
                              ) || {}
                            )[0];
                            updatePreferences(pref.settingName, selectedValue);
                            setSearchEngineUrl(selectedValue);
                            setSearchEngineName(selectedName);
                          }}
                        >
                          {searchEngineOptions.map((option, idx) => {
                            const [key, value] = Object.entries(option)[0];
                            return (
                              <option key={idx} value={value}>
                                {key}
                              </option>
                            );
                          })}
                        </select>
                      ) : pref.settingValue === "true" ||
                        pref.settingValue === "false" ? (
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={pref.settingValue === "true"}
                            onChange={(e) =>
                              updatePreferences(
                                pref.settingName,
                                e.target.checked
                              )
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      ) : (
                        <input
                          type="text"
                          className="list-item-input bg-body-dark text-body border--smooth border--thin border--solid"
                          value={pref.settingValue}
                          onChange={(e) =>
                            updatePreferences(pref.settingName, e.target.value)
                          }
                        />
                      )}
                    </div>
                  </li>
                ))}

                <li className="list-item-preferences">
                  <div className="col-width-10">
                    <p className="list-item-label">Search Engine URL</p>
                  </div>
                  <div className="col-width-5 text-align--right">
                    {searchEngineName === "Custom" ? (
                      <input
                        type="text"
                        value={searchEngineUrl}
                        className="list-item-input bg-body-dark text-body border--smooth border--thin border--solid"
                        onChange={(e) => {
                          updatePreferences("defaultSearchEngine", e.target.value);
                          setSearchEngineUrl(e.target.value);
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        className="list-item-input bg-body text-body-light border--smooth border--thin border--solid"
                        value={searchEngineUrl}
                        disabled={true}
                      />
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
