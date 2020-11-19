# QR Code Generation

**Author**: Firebase (**[https://firebase.google.com](https://firebase.google.com)**)

**Description**: Generates a QR code for text entered into a given Firestore property and saves it to Firebase Storage.


**Details**: Use this extension to convert text written to a Cloud Firestore collection to a QR code and store it in Firebase Storage.

This extension listens to your specified Cloud Firestore collection. If you add a string to a specified field in any document within that collection, this extension:

- Converts the text into a QR code png image.
- Saves the converted QR code image to Firebase Storage.
- Saves the path for the image in Firestore.


If the original field of the document is updated, then the original QR code image will be automatically updated, as well.

#### Additional setup

Before installing this extension, make sure that you've [set up a Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) and have [set up Cloud Storage](https://firebase.google.com/docs/storage) in your Firebase project.

#### Billing
To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s free tier:
  - Cloud Firestore
  - Firebase Cloud Storage
  - Cloud Functions (Node.js 10+ runtime. [See FAQs](https://firebase.google.com/support/faq#expandable-24))

**Configuration Parameters:**

* Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your database. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Collection path: What is the path to the collection that contains the strings that you want to analyze?


* Input field name: What is the name of the field that contains the string that you want to analyze?


* QR code location information output field name: What is the name of the field where you want to store the reference to the QR code image?


* The Firebase Cloud Storage bucket where you will store the image files.

* The directory in the designated Firebase Cloud Storage bucket where you will want to store the QR code images.

**Cloud Functions:**

* **fsqrcodegenerator:** Listens to a field in Firestore documents and turns the text from those fields into QR codes, then saves them as images in Firebase Storage before leaving a reference link to that QR code in the triggering Firestore document.


**APIs Used**:

* QR Code Generator API (Reason: To generate the QR code images remotely.)

**Access Required**:



This extension will operate with the following project IAM roles:

* datastore.user (Reason: Allows the extension to write QR code data to Cloud Firestore.)
* storage.objectAdmin (Reason: Allows the extension to create, delete, and modify data in  Firebase Cloud Storage.)
