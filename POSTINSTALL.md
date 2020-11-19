### See it in action

You can test out this extension right away!

1.  Go to your [Cloud Firestore dashboard](https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore/data) in the Firebase console.

1.  If you do not already have one, create a new collection named ${param:COLLECTION_PATH}`.

1.  Create a document with a field named `${param:INPUT_FIELD_NAME}`, then add the text that you want to convert.

1.  In a few moments, you'll see a new field called `${param:OUTPUT_FIELD_NAME}` pop up in the same document you just created. It will contain the paths to the newly created QR code located in Firebase Cloud Storage. 

### Using the extension

Whenever you write a string to the field `${param:INPUT_FIELD_NAME}` in `${param:COLLECTION_PATH}`, this extension does the following:

- Converts the text into a QR code png image using the [QR Code Generator API](https://goqr.me/api).
- Saves the converted QR code image to Firebase Storage.
- Saves the path for the image in Firestore.


If the `${param:INPUT_FIELD_NAME}` field of the document is updated, then the QR code will be automatically updated, as well.

### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.
