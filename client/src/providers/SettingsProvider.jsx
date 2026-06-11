import { useEffect, useState } from "react";
import { SettingsContext } from "../context/SettingsContext";
import request from "../utils/request";

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({ firmName: "LexSchedule" });

  useEffect(() => {
    request.get("/admin/settings")
      .then((data) => {
        if (data?.firmName) setSettings(data);
      })
      .catch(() => {});
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}
