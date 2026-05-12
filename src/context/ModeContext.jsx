import {
  createContext,
  useEffect,
  useState,
} from "react";

// CONTEXT
export const ModeContext =
  createContext();

// PROVIDER
export default function ModeProvider({
  children,
}) {

  // LOAD SAVED MODE
  const [mode, setMode] =
    useState(() => {

      return (
        localStorage.getItem(
          "appMode"
        ) || "demo"
      );
    });

  // SAVE MODE
  useEffect(() => {

    localStorage.setItem(
      "appMode",
      mode
    );

  }, [mode]);

  return (

    <ModeContext.Provider
      value={{
        mode,
        setMode,
      }}
    >

      {children}

    </ModeContext.Provider>
  );
}