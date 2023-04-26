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
    <div>
      <Button onClick={() => handleClick()}>选择文件夹</Button>
      <Button onClick={() => handleCompress()}>压缩</Button>
      <div>{srcPath}</div>
    </div>
  );
}

export default Home;
