# tallboi

## init

* to init run `npm install` (or `npm i` for short) to install dependencies

## compile

* to compile once run `npm run build`
* to build and watch the project (so it recompiles on save) run `npm start`. this also starts a simple http server and auto reloads the browser window
* typescript will compile and bundle into javascript in `dist/main.js` and this is then referenced in `index.html` 

## lint

* for linting i recommend `ms-vscode.vscode-typescript-tslint-plugin` vscode extension and then setting the following in `settings.json` (F1 -> search for settings -> `Preferences: Open settings (JSON)`)

```json
"editor.codeActionsOnSave": {
    "source.fixAll.tslint": true,
    "source.organizeImports": true
}
```