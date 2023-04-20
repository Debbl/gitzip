import React, { useState } from "react";
import { Button } from "antd";
import electron from "electron";

function Home() {
  const ipcRenderer = electron.ipcRenderer || false;
  const [srcPath, setSrcPath] = useState("");

  const handleClick = async () => {
    if (!ipcRenderer) return;
    const dir = await ipcRenderer.invoke("dialog:openDir");
    setSrcPath(dir);
    console.log(dir);
  };

  const handleCompress = () => {
    ipcRenderer && ipcRenderer.emit("upload:compress");
  };

  return (
    <div>
      <Button onClick={() => handleClick()}>upload</Button>
      <Button onClick={() => handleCompress()}>compress</Button>
      <div>{srcPath}</div>
    </div>
  );
}

export default Home;
