"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const functions = require('firebase-functions');
const admin = require('firebase-admin');

var fs = require('fs');
var request = require('request').defaults({
  encoding: null
});

var ChangeType;

(function (ChangeType) {
    ChangeType[ChangeType["CREATE"] = 0] = "CREATE";
    ChangeType[ChangeType["DELETE"] = 1] = "DELETE";
    ChangeType[ChangeType["UPDATE"] = 2] = "UPDATE";
})(ChangeType || (ChangeType = {}));

admin.initializeApp();

const tmpFileLocation = '/tmp/newfile.png';
var id;

exports.fsqrcodegenerator = functions.handler.firestore.document.onWrite(async (change) => {
    const { inputFieldName, outputFieldName, outputEncoding, bucket, storageDirectoryPath } = config_1.default;

    if (inputFieldName == outputFieldName) {
        console.log("QR Code Generator: input field cannot be the same as output field. Please reconfigure your extension.");
        return;
    }
    id = change.after.id;
    const changeType = getChangeType(change);
    try {
        switch (changeType) {
            case ChangeType.CREATE:
                console.log("create");
                await handleCreateDocument(change.after);
                break;
            case ChangeType.DELETE:
                console.log("delete");
                await handleDeleteDocument(change.before);
                break;
            case ChangeType.UPDATE:
                console.log("update");
                await handleUpdateDocument(change.before, change.after);
                break;
        }
    }
    catch (err) {
        console.log("QR Code Generator extension error: " + err);
    }
});

const extractInput = (snapshot) => {
    return snapshot.get(config_1.default.inputFieldName);
};
const getChangeType = (change) => {
    if (!change.after.exists) {
        return ChangeType.DELETE;
    }
    if (!change.before.exists) {
        return ChangeType.CREATE;
    }
    return ChangeType.UPDATE;
};

const handleCreateDocument = async (snapshot) => {
    const input = extractInput(snapshot);
    if (input) {
    	var url = createQRCodeUrl(input);
        downloadFile(url, tmpFileLocation, async function() {
            uploadTmpFile(snapshot);
        });
    }
};

const handleDeleteDocument = async (snapshot) => {
	var path = snapshot.get(config_1.default.outputFieldName + "/" + "realtive_path");
    var bucketRef = getBucket(config_1.default.bucket);
    await deleteItem(bucketRef, path);
};

const deleteItem = async function(bucketRef, path) {
    console.log("trying to delete");
    await bucketRef.file(path).delete().then(() => {
        console.log("deleted?");
    });
}

const uploadTmpFile = function(snapshot) {
    var bucketRef = getBucket(config_1.default.bucket);
    var destination = (config_1.default.storageDirectoryPath == undefined ? "" : config_1.default.storageDirectoryPath) + id + '.png';
    return new Promise(() => {
        bucketRef.upload(
        tmpFileLocation, 
        {
            destination: destination,
            gzip: true
        }, 
        function(err, file) {
            snapshot.ref.set({ [config_1.default.outputFieldName]: {gs_path: "gs://" + bucketRef.name + '/' + destination, relative_path: destination}}, {merge: true});
        }
    )});
}

const handleUpdateDocument = async (before, after) => {
    const inputAfter = extractInput(after);
    const inputBefore = extractInput(before);
    const inputHasChanged = inputAfter !== inputBefore;
    if (!inputHasChanged &&
        inputAfter !== undefined &&
        inputBefore !== undefined) {
            return;
        }
    if( inputBefore ) {
        var path = snapshot.get(config_1.default.outputFieldName + "/" + "realtive_path");
        var bucketRef = getBucket(config_1.default.bucket);
        await deleteItem(bucketRef, path);
    }
    if (inputAfter) {
    	var url = createQRCodeUrl(inputAfter);
        downloadFile(url, tmpFileLocation, async function() {
            uploadTmpFile(after);
        });
    }
};

const getBucket = function(bucketName) {
  if( bucketName == undefined ) {
    return admin.storage().bucket()
  } else {
    return admin.storage().bucket(bucketName);
  } 
}

const createQRCodeUrl = function(input) {
    return 'https://chart.googleapis.com/chart?cht=qr' +
          '&chs=177x177' +
          '&chl=' + input +
          '&choe=' + config_1.default.outputEncoding;
};

const downloadFile = async function(uri, filename, callback){
  await request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};