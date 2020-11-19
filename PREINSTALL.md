Use this extension to convert text written to a Cloud Firestore collection to a QR code and store it in Firebase Storage.

This extension listens to your specified Cloud Firestore collection. If you add a string to a specified field in any document within that collection, this extension:

- Converts the text into a QR code png image using the [QR Code Generator API](https://goqr.me/api).
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
