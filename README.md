# tutorial-getting-started-electron
Multi-part tutorial on creating a Electron application

After cloning:
  * cd [yourFolder]
  * code .
  * open terminal
  * npm install
  * npm run dev


Issues upgrading to latest on 08-21-19:
  Changes to electron ipcRenderer

  Had to add target: 'electron-renderer' to webpack.config.js

  Lots of changes to satisfy latest bentley tslint standards
  Note: had to disable "no-floating-promises": false, because mainWindow.loadURL was failing linting, not sure why

  To get sqlite3 to work had to run rebuild script (can't recall why this is necessary)

  