import {app, BrowserWindow, ipcMain} from "electron";
// import {SqliteConnection} from "./services/sqliteConnection";
import {Item} from "../common/models/Item";
import { IQueryOptions } from "./services/queryOptions";
// import {ComponentsDb} from "./repositories/ComponentsDb";
import { ItemsHub } from "./repositories/ItemsHub";
import { ItemsRepository } from "./repositories/ItemsRepository";

let mainWindow: BrowserWindow | null;
let compsHub: ItemsRepository | undefined;
// let compsDb: IComponentsRepository | undefined;

const createWindow = () => {

  mainWindow = new BrowserWindow(
    { width: 800,
      height: 800,
      resizable: true,
      webPreferences: {
        nodeIntegration: true,
      },
      show: false,
    });

  const htmlFile = `file://${__dirname}/../index.html`;
  mainWindow.loadURL(htmlFile);
  mainWindow.webContents.openDevTools();

  mainWindow.once("ready-to-show", () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  mainWindow.on("closed", () => {
    console.log("Closing window");
    mainWindow = null;
  });

};

const initHub = () => {
  compsHub = new ItemsHub('http://localhost:4060/api/');
}

// const initDb = () => {
//   const sqliteConnection: SqliteConnection = new SqliteConnection("model.db");
//   compsDb = new ComponentsDb(sqliteConnection);

// };

app.on("ready", () => {
  console.log("app is ready");
  console.log(app.getAppPath());
  createWindow();
  initHub();
  // initDb();

});

ipcMain.on("refresh-request", async (sender: any, queryOptions: IQueryOptions) => {

  console.log("Received refresh-request!");
  console.log(queryOptions);
  if (!mainWindow) {
    throw new Error("mainWindow is not defined");
  }

  let data: Item[] | Error = new Error ("nothing happening");

  if(!compsHub) {
    throw new Error("Hub is not defined");
  }
  const result = await compsHub.getItems(queryOptions);
  console.log(result);

  // if (!compsDb) {
  //   throw new Error("compsDb is not defined");
  // }
  // console.log("Read data from compsDb");
  // const result = await compsDb.getComponents(queryOptions);

  if (result instanceof Error) {
    data = result;
  } else {
    data = result;
  }

  console.log("Sending data-updated!!");
  console.log(`Number of components found: ${ data instanceof Error ? 0 : data.length}`);
  mainWindow.webContents.send("data-updated", data);
});
