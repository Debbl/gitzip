import React, { useState } from "react";
import { Button, message } from "antd";
import electron from "electron";

function Home() {
  const ipcRenderer = electron.ipcRenderer || false;
  const [srcPath, setSrcPath] = useState("");

  const handleClick = async () => {
    if (!ipcRenderer) return;
    const dir = await ipcRenderer.invoke("dialog:openDir");
    setSrcPath(dir);
  };

  const handleCompress = async () => {
    if (!ipcRenderer) return;
    const filePath = await ipcRenderer.invoke("dialog:compress", srcPath);
    filePath && message.success(`${filePath}压缩成功！`);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{ marginTop: "10%", display: "flex", flexDirection: "column" }}
      >
        <div style={{ display: "flex", columnGap: "10px" }}>
          <Button onClick={() => handleClick()}>选择文件夹</Button>
          <Button onClick={() => handleCompress()}>压缩</Button>
        </div>
        <div style={{ marginTop: "10px" }}>{srcPath}</div>
      </div>
    </div>
  );
}

export default Home;
