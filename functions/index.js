const functions = require('firebase-functions');
const admin = require('firebase-admin');

var fs = require('fs');
var request = require('request').defaults({
  encoding: null
});

admin.initializeApp();

//https://developers.google.com/chart/infographics/docs/qr_codes
exports.qrcode = functions.firestore.document('/reviews/{documentId}')
    .onCreate(async (snap, context) => {
      const input = snap.data().qr
      
      if( input ) {
      	const directory = 'images/qr/';//'';
      	const bucketName = '';//'ptruiz-extensions';
      	const fileType = 'png';
		const qr_code_path = 'path';
      	const cht = (false) ? '' : 'qr';
      	const chs = (false) ? '' : '144x144';
      	const choe = (false) ? '' : 'UTF-8';

		const key = snap.id;
      	const tmpFileLocation = '/tmp/newfile.png';
		const destination = directory + key + '.' + fileType;
      	const bucketRef = getBucket(bucketName);

      	var imageUrl = 
	      	'https://chart.googleapis.com/chart?' +
	      	'cht=' + cht +
	      	'&chs=' + chs +
	      	'&chl=' + input +
	      	'&choe=' + choe;

	    return Promise.resolve(new Promise(() => {
	    	download(imageUrl, tmpFileLocation, async function(){
	  		return new Promise(() => {
	  			bucketRef.upload(tmpFileLocation, {
			    destination: destination,
			    gzip: true
			},  function(err, file) {
			  	snap.ref.set({ [qr_code_path]: "gs://" + bucketRef.name + '/' + destination}, {merge: true});
				});
	  		}).then(() => {
      			//write file path to firestore
    		}).catch(err => {
      			console.error('ERROR:', err);
    		});
		});
    }));
	return Promise.resolve(null);
  } else {
  	return Promise.resolve(null);
  }      
});

var getBucket = function(bucketName) {
	if( bucketName == '' ) {
		return admin.storage().bucket()
	} else {
		return admin.storage().bucket(bucketName);
	}	
}

 var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};