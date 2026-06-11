import { createContext, useContext } from "react";

export const SettingsContext = createContext({
  firmName: "LexSchedule",
});

export function useSettings() {
  return useContext(SettingsContext);
}
