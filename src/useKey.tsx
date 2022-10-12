import React from "react";
export const useKey = (key: string, callback: () => void, canUse = true) => {
  React.useEffect(() => {
    if (canUse) {
      const handlePress = (e: KeyboardEvent) => {
        if (e.code === key) {
          callback();
        }
      };

      document.addEventListener("keydown", handlePress);
      return () => document.removeEventListener("keydown", handlePress);
    }
  });
};
