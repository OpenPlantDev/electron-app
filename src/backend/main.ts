import {app, BrowserWindow, ipcMain} from "electron";
import {Item} from "../common/models/Item";
import { IQueryOptions } from "./services/queryOptions";
import { AuthService, AuthServiceProvider } from "./services/authService";
import { ItemsHubCredentials, ItemsHubConnection } from "./services/itemsHubConnection";
import { ApiError } from "./services/api";
// import {SqliteConnection} from "./services/sqliteConnection";
// import {IVendorRepository} from "./repositories/vendorRepository";

let mainWindow: BrowserWindow | null;
let itemsHubConnection: ItemsHubConnection | undefined;
// let initVendorRepo: IVendorRepository | undefined;

const credentials: ItemsHubCredentials = {userName: "dan.nichols@bentley.com", password: ""};

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

// This is a callback for the ItemsHubConnection to login when required
// It should have a UI to prompt for userName and password, but for now it is hard-coded
// Hard-coded password is initially incorrect, then corrected for second attempt
const login = async (authService: AuthServiceProvider): Promise<string | Error> => {

  console.log(`Attempting Login with credentials: userName=${credentials.userName} password=${credentials.password}`);
  let loginResult = await AuthService.Instance.login(authService, credentials.userName, credentials.password);
  if(loginResult instanceof ApiError) {
    console.log(`Login failed: ${loginResult.message}`);
    credentials.password = "123";
    console.log(`Attempting Login with credentials: userName=${credentials.userName} password=${credentials.password}`);
    loginResult = await AuthService.Instance.login(authService, credentials.userName, credentials.password);
    if(loginResult instanceof ApiError) {
      console.log(`Login failed: ${loginResult.message}`);
    } else {
      console.log(`Login suceeded`);
    }
  }

  return loginResult;
}

const initHubConnection = () => {
  itemsHubConnection = new ItemsHubConnection('http://localhost:4060/api/', login);
}

// const initVendorDb = () => {
//   const sqliteConnection: SqliteConnection = new SqliteConnection("vendor.db");
//   vendorDb = new VendorDb(sqliteConnection);

// };

app.on("ready", () => {
  console.log("app is ready");
  console.log(app.getAppPath());
  createWindow();
  initHubConnection();
  // initVendorRepo();

});

ipcMain.on("refresh-request", async (sender: any, queryOptions: IQueryOptions) => {

  console.log("Received refresh-request!");
  console.log(queryOptions);
  if (!mainWindow) {
    throw new Error("mainWindow is not defined");
  }

  let data: Item[] | Error = new Error ("nothing happening");

  if(!itemsHubConnection) {
    throw new Error("Hub is not defined");
  }

  const result = await itemsHubConnection.getItems(queryOptions);
  // console.log(result);

  // if (!vendorRepo) {
  //   throw new Error("vendorRepo is not defined");
  // }
  // console.log("Read data from VendorRepo");
  // const result = await compsDb.getVendorData();

  if (result instanceof Error) {
    data = result;
  } else {
    data = result;
  }

  console.log("Sending data-updated!!");
  console.log(`Number of components found: ${ data instanceof Error ? 0 : data.length}`);
  mainWindow.webContents.send("data-updated", data);
});
