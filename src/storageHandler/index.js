const engine = require("store/src/store-engine");
const storages = [
  require("store/storages/sessionStorage"),
  require("store/storages/cookieStorage"),
];
const plugins = [require("store/plugins/expire")];

const storageHandler = engine.createStore(storages, plugins);

export default storageHandler;
