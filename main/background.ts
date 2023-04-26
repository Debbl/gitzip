import path from "path";
import { app, dialog, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { compress } from "./compress";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }

  // select directory
  ipcMain.handle("dialog:openDir", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: "选择文件夹",
      properties: ["openDirectory"],
    });
    if (canceled) {
      return "";
    } else {
      return filePaths[0];
    }
  });
  // compress directory
  ipcMain.handle("dialog:compress", async (_, srcPath) => {
    // get directory name by srcPath
    const dirName = path.basename(srcPath);
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      defaultPath: path.join(srcPath, `${dirName}.zip`),
      filters: [{ name: "zip", extensions: ["zip"] }],
    });
    if (canceled) {
      return "";
    }
    compress(srcPath, filePath);
    return filePath;
  });
})();

app.on("window-all-closed", () => {
  app.quit();
});
