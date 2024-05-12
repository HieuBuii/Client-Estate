import { createContext, useEffect, useState } from "react";
import { IUWConfig, IUWResult } from "../../types/uploadWidget.types";
import { toast } from "react-toastify";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext({ loaded: false });

interface IProps {
  uwConfig: IUWConfig;
  setState: React.Dispatch<React.SetStateAction<string[]>>;
}

function UploadWidget({ uwConfig, setState }: IProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    if (loaded) {
      // @ts-ignore:next-line
      const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error: unknown, result: IUWResult) => {
          if (!error && result && result.event === "success") {
            setState((prev) => [...prev, result.info.url]);
          } else if (error) {
            toast.error("Upload file failed");
          }
        }
      );
      myWidget.open();
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id="upload_widget"
        className="cloudinary-button"
        onClick={initializeCloudinaryWidget}
        type="button"
      >
        Upload
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };
