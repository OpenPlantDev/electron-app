import {app, BrowserWindow, ipcMain} from "electron";
import {Item} from "../common/models/Item";
import { IQueryOptions, QueryOptions } from "./services/queryOptions";
import { AuthService, AuthServiceProvider } from "./services/authService";
import { ItemsHubCredentials, ItemsHubConnection } from "./services/itemsHubConnection";
import { ApiError } from "./services/api";
import * as socketio from "socket.io-client";
// import {SqliteConnection} from "./services/sqliteConnection";
// import {IVendorRepository} from "./repositories/vendorRepository";

const baseUrl = "http://localhost:4060/";
let mainWindow: BrowserWindow | null;
let itemsHubConnection: ItemsHubConnection | undefined;
// let initVendorRepo: IVendorRepository | undefined;
let socket: SocketIOClient.Socket;

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
  itemsHubConnection = new ItemsHubConnection(`${baseUrl}api/`, login);
}

// const initVendorDb = () => {
//   const sqliteConnection: SqliteConnection = new SqliteConnection("vendor.db");
//   vendorDb = new VendorDb(sqliteConnection);

// };

const initSocketIO = () => {
  socket = socketio.connect(baseUrl);
  socket.on("DbUpdated", async (msg: any) => {
    console.log("Received DbUpdated via SocketIO");
    const data = await getData(QueryOptions.getOptions(""));
    console.log(`Number of components found: ${ data instanceof Error ? 0 : data.length}`);
    await sendData(data);
  });
}

app.on("ready", () => {
  console.log("app is ready");
  console.log(app.getAppPath());
  createWindow();
  initSocketIO();
  initHubConnection();
  // initVendorRepo();

});

ipcMain.on("refresh-request", async (sender: any, queryOptions: IQueryOptions) => {
  console.log("Received refresh-request!");
  const data = await getData(queryOptions);
  console.log(`Number of components found: ${ data instanceof Error ? 0 : data.length}`);
  await sendData(data);
});

const getData = async (queryOptions: IQueryOptions): Promise<Item[] | ApiError> => {
  console.log(queryOptions);

  let data: Item[] | ApiError = new ApiError (500, "nothing happening");

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

  return data;
}

const sendData = async (data: any) => {
  if (!mainWindow) {
    throw new Error("mainWindow is not defined");
  }
  console.log("Sending data-updated!!");
  mainWindow.webContents.send("data-updated", data);

}
