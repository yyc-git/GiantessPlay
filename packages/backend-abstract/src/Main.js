"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setData = exports.getData = exports.isLoginSuccess = exports.registerUser = exports.checkPassword = exports.checkUserName = exports.init = void 0;
// import * as MarketService from "./application_layer/market/MarketService"
const LoginService = __importStar(require("./application_layer/user/LoginService"));
// import * as PublishAppService from "./application_layer/publish/PublishAppService"
// import * as PublishFinalAppService from "./application_layer/publish/PublishFinalAppService"
// // import * as GetElementDataService from "./application_layer/assemble_space/element_assemble/GetElementDataService"
// // import * as PublishElementContributeService from "./application_layer/assemble_space/element_assemble/PublishElementContributeService"
// import * as PublishPackageService from "./application_layer/publish/PublishPackageService"
// import * as PackageMarketService from "./application_layer/market/PackageMarketService"
// import * as DependencyService from "./application_layer/assemble_space/DependencyService"
let init = (init, env) => init(env);
exports.init = init;
// export let handleLoginForWeb3 = (handleLoginForWeb3: (account: string) => Stream<unknown>, account: string) => handleLoginForWeb3(account)
let checkUserName = (checkUserName, account) => checkUserName(account);
exports.checkUserName = checkUserName;
let checkPassword = (checkPassword, account, password) => checkPassword(account, password);
exports.checkPassword = checkPassword;
let registerUser = (registerUser, account, password) => registerUser(account, password);
exports.registerUser = registerUser;
exports.isLoginSuccess = LoginService.isLoginSuccess;
let getData = (getDataFunc, ...values) => getDataFunc(...values);
exports.getData = getData;
let setData = (setDataFunc, ...values) => setDataFunc(...values);
exports.setData = setData;
// export let getAllPublishProtocolData = MarketService.getAllPublishProtocolData
// export let batchFindPublishProtocolData = MarketService.batchFindPublishProtocolData
// export let getAllPublishProtocolDataCount = MarketService.getAllPublishProtocolDataCount
// export let getAllPublishProtocolConfigData = MarketService.getAllPublishProtocolConfigData
// export let batchFindPublishProtocolConfigData = MarketService.batchFindPublishProtocolConfigData
// export let getAllPublishImplementInfo = MarketService.getAllPublishImplementInfo
// export let findPublishImplement = MarketService.findPublishImplement
// export let publishApp = PublishAppService.publish
// export let findPublishApp = PublishAppService.findPublishApp
// export let findAllPublishAppsByAccount = PublishAppService.findAllPublishAppsByAccount
// export let findAllPublishApps = PublishAppService.findAllPublishApps
// export let findAllRecommendPublishApps = PublishAppService.findAllRecommendPublishApps
// export let publishFinalApp = PublishFinalAppService.publish
// export let findPublishFinalApp = PublishFinalAppService.findPublishFinalApp
// export let findAllPublishFinalAppsByAccount = PublishFinalAppService.findAllPublishFinalAppsByAccount
// export let findAllPublishFinalApps = PublishFinalAppService.findAllPublishFinalApps
// export let findAllRecommendPublishFinalApps = PublishFinalAppService.findAllRecommendPublishFinalApps
// // export let getAllPublishNewestData = GetElementDataService.getAllPublishNewestData
// // export let getElementAssembleData = GetElementDataService.getElementAssembleData
// // export let findAllElementAssembleData = GetElementDataService.findAllElementAssembleData
// // export let publishElementAssembleData = PublishElementContributeService.publishElementAssembleData
// // export let publishElementContribute = PublishElementContributeService.publishElementContribute
// export let publishPackage = PublishPackageService.publish
// export let getAllPublishPackageEntryExtensionProtocols = PackageMarketService.getAllPublishPackageEntryExtensionProtocols
// export let getAllPublishPackageInfos = PackageMarketService.getAllPublishPackageInfos
// export let findPublishPackage = PackageMarketService.findPublishPackage
// export let findNewestPublishPackage = DependencyService.findNewestPublishPackage
//# sourceMappingURL=Main.js.map