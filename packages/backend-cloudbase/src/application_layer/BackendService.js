"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKey = exports.getDataByKeyContain = exports.addMarketImplementData = exports.getMarketImplementAccountDataWithWhereData = exports.getFileID = exports.hasData = exports.deleteFile = exports.getDataByKey = exports.getDataWithWhereData = exports.addData = exports.updateData = exports.uploadFile = exports.downloadFile = exports.getAccountFromMarketImplementCollectionData = exports.filterMarketImplementCollection = exports.mapMarketImplementCollection = exports.getDataFromMarketProtocolCollection = exports.getMarketImplementCollection = exports.getMarketProtocolCollectionCount = exports.batchFindMarketProtocolCollection = exports.getMarketProtocolCollection = exports.setData = exports.getData = exports.hasAccount = exports.registerUser = exports.handleLoginForWeb3 = exports.checkPassword = exports.checkUserName = exports.getDatabase = exports.init = void 0;
const js_sdk_1 = require("@cloudbase/js-sdk");
const most_1 = require("most");
const Repo_1 = require("../domain_layer/repo/Repo");
// import * as BackendService from "meta3d-backend-cloudbase";
const BackendService = require("../../../meta3d-backend-cloudbase");
// import { curry2, curry3_1, curry4, curry4_1 } from "meta3d-fp/src/Curry";
let init = (env) => {
    let app = js_sdk_1.default.init({
        env: env // 此处填入您的环境ID
    });
    (0, Repo_1.setBackend)(app);
    return (0, most_1.fromPromise)(app.auth()
        .anonymousAuthProvider()
        .signIn());
};
exports.init = init;
let getDatabase = () => {
    return (0, Repo_1.getBackend)().database();
};
exports.getDatabase = getDatabase;
let checkUserName = (account) => BackendService.checkUserName((0, Repo_1.getBackend)(), account);
exports.checkUserName = checkUserName;
let checkPassword = (account, password) => BackendService.checkPassword((0, Repo_1.getBackend)(), account, password);
exports.checkPassword = checkPassword;
let handleLoginForWeb3 = (account) => BackendService.handleLoginForWeb3((0, Repo_1.getBackend)(), account);
exports.handleLoginForWeb3 = handleLoginForWeb3;
let registerUser = (account, password) => BackendService.registerUser((0, Repo_1.getBackend)(), account, password);
exports.registerUser = registerUser;
let hasAccount = (collectionName, account) => BackendService.hasAccount((0, Repo_1.getBackend)(), collectionName, account);
exports.hasAccount = hasAccount;
let getData = (collectionName, key) => BackendService.getData((0, Repo_1.getBackend)(), collectionName, key);
exports.getData = getData;
let setData = (collectionName, key, data) => BackendService.setData((0, Repo_1.getBackend)(), collectionName, key, data);
exports.setData = setData;
let getMarketProtocolCollection = (collectionName, limitCount, skipCount) => BackendService.getMarketProtocolCollection((0, Repo_1.getBackend)(), null, collectionName, limitCount, skipCount);
exports.getMarketProtocolCollection = getMarketProtocolCollection;
let batchFindMarketProtocolCollection = (collectionName, protocolNames) => BackendService.batchFindMarketProtocolCollection((0, Repo_1.getBackend)(), null, collectionName, protocolNames);
exports.batchFindMarketProtocolCollection = batchFindMarketProtocolCollection;
let getMarketProtocolCollectionCount = (collectionName) => BackendService.getMarketProtocolCollectionCount((0, Repo_1.getBackend)(), collectionName);
exports.getMarketProtocolCollectionCount = getMarketProtocolCollectionCount;
let getMarketImplementCollection = (collectionName, limitCount, skipCount, whereData = {}) => BackendService.getMarketImplementCollection((0, Repo_1.getBackend)(), null, collectionName, limitCount, skipCount, whereData);
exports.getMarketImplementCollection = getMarketImplementCollection;
// export let getMarketImplement = (
// 	collectionName: string,
// 	limitCount: number,
// 	skipCount: number,
// 	account: string,
// 	name: string,
// 	version: string
// ) => {
// 	return getDatabase()
// 		.collection(collectionName)
// 		.where({
// 			key: BackendService.handleKeyToLowercase(account),
// 			name: name,
// 			version: version
// 		})
// 		.skip(skipCount)
// 		.limit(limitCount)
// 		.get()
// 		.then(res => {
// 			if (res.data.length === 0) {
// 				return null
// 			}
// 			return res.data[0]
// 		})
// }
exports.getDataFromMarketProtocolCollection = BackendService.getDataFromMarketProtocolCollection;
exports.mapMarketImplementCollection = BackendService.mapMarketImplementCollection;
exports.filterMarketImplementCollection = BackendService.filterMarketImplementCollection;
exports.getAccountFromMarketImplementCollectionData = BackendService.getAccountFromMarketImplementCollectionData;
// export let getFileDataFromMarketImplementCollectionData = BackendService.getFileDataFromMarketImplementCollectionData
let downloadFile = (onDownloadProgressFunc, fileID, notUseCache = false) => {
    // TODO support onDownloadProgressFunc
    onDownloadProgressFunc(0);
    return BackendService.downloadFile((0, Repo_1.getBackend)(), null, fileID, notUseCache);
};
exports.downloadFile = downloadFile;
let _blobToFile = (theBlob, fileName) => {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
};
let _arrayBufferToBlob = (arrayBuffer) => {
    return new Blob([arrayBuffer]);
};
let uploadFile = (onUploadProgressFunc, filePath, fileContent, fileName) => {
    return (0, most_1.fromPromise)((0, Repo_1.getBackend)().uploadFile({
        cloudPath: filePath,
        filePath: _blobToFile(_arrayBufferToBlob(fileContent), fileName),
        onUploadProgress: function (progressEvent) {
            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onUploadProgressFunc(percentCompleted);
        }
    }));
    // .then(({ fileID }) => fileID))
};
exports.uploadFile = uploadFile;
let updateData = (collectionName, key, updateData) => BackendService.updateMarketImplementData((0, Repo_1.getBackend)(), collectionName, key, updateData, null);
exports.updateData = updateData;
let addData = (collectionName, key, data) => BackendService.addDataToMarketProtocolCollection((0, Repo_1.getBackend)(), null, collectionName, key, null, data);
exports.addData = addData;
let getDataWithWhereData = (collectionName, whereData) => {
    return (0, exports.getDatabase)().collection(collectionName)
        .where(whereData)
        .skip(0)
        .limit(1000)
        .get()
        .then(res => res.data);
};
exports.getDataWithWhereData = getDataWithWhereData;
let getDataByKey = (collectionName, key) => {
    // return getDataWithWhereData(collectionName, { key: BackendService.handleKeyToLowercase(key) })
    return (0, exports.getDataWithWhereData)(collectionName, { key: key });
};
exports.getDataByKey = getDataByKey;
let deleteFile = (fileID) => {
    return BackendService.deleteFile((0, Repo_1.getBackend)(), fileID);
};
exports.deleteFile = deleteFile;
let hasData = (collectionName, key) => BackendService.hasData((0, Repo_1.getBackend)(), collectionName, key);
exports.hasData = hasData;
exports.getFileID = BackendService.getFileID;
// export let getMarketImplementAccountData = (collectionName, account, name, version) => BackendService.getMarketImplementAccountData(getBackend(), null, collectionName, account, name, version)
let getMarketImplementAccountDataWithWhereData = (collectionName, whereData) => BackendService.getMarketImplementAccountDataWithWhereData((0, Repo_1.getBackend)(), null, collectionName, whereData);
exports.getMarketImplementAccountDataWithWhereData = getMarketImplementAccountDataWithWhereData;
let addMarketImplementData = (collectionName, data) => {
    return BackendService.addMarketImplementData((0, Repo_1.getBackend)(), collectionName, data);
};
exports.addMarketImplementData = addMarketImplementData;
// export let updateMarketImplementData = (collectionName, account, updateData, oldMarketImplementCollectionData) =>
// 	BackendService.updateMarketImplementData(getBackend(), collectionName, account, updateData, oldMarketImplementCollectionData)
// export let getDataFromMarketImplementAccountData = BackendService.getDataFromMarketImplementAccountData
// export let isContain = BackendService.isContain
// export let buildMarketImplementAccountData = BackendService.buildMarketImplementAccountData
// export let addMarketImplementDataToDataFromMarketImplementCollectionData = BackendService.addMarketImplementDataToDataFromMarketImplementCollectionData
let getDataByKeyContain = (collectionName, limitCount, skipCount, values) => {
    return (0, most_1.fromPromise)((0, exports.getDatabase)().collection(collectionName)
        .skip(skipCount)
        .limit(limitCount)
        .get()
        .then(res => res.data.filter(({ key }) => {
        return values.reduce((result, value) => {
            if (!result) {
                return result;
            }
            return key.includes(value);
        }, true);
    })));
};
exports.getDataByKeyContain = getDataByKeyContain;
// export let getData = (collectionName: string, limitCount: number, skipCount: number) => {
// 	return getDatabase().collection(collectionName)
// 		.skip(skipCount)
// 		.limit(limitCount)
// 		.get()
// 		.then(res => res.data)
// }
// export let getPackageMarketEntryExtensionProtocolCollection = () => getMarketProtocolCollection("publishedpackages")
// export let getPackageMarketEntryExtensionProtocolCollection = () => getData("publishedpackages")
// export let getDataFromPackageMarketEntryExtensionProtocolCollection = getDataFromMarketProtocolCollection
exports.getKey = BackendService.getKey;
