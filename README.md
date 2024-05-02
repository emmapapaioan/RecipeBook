# RecipeBook

https://github.com/emmapapaioan/RecipeBook/assets/108992250/b67a7dd3-eb7c-4605-a9c3-190edb017f47

RecipeBook is a web application developed using Angular framework. It allows users to store, view, edit, print, or delete recipes from a remote database. The project also provides OCR (Optical Character Recognition) functionality where users can upload an image with text (a recipe image, for example) and retrieve the text from the image.

## View Production Site

This project is deployed using Firebase Hosting. You can access the live version of the application by clicking the link:
[View Production Site](https://recipe-book-41dd4.web.app/).

## Technologies

The project is developed using Angular, a TypeScript-based open-source web application framework. It also uses other technologies such as HTML, CSS, Bootstrap, and TypeScript.

## Server-Side and OCR Functionality

The project includes a Heroku-deployed server that handles OCR (Optical Character Recognition) functionality. This setup is primarily designed to process images fetched from URLs that may be subject to CORS restrictions.

### Automatic Usage
The application is configured to automatically use the server for OCR tasks. Users do not need to take any manual action to interact with the server; the application handles all interactions seamlessly in the background. This ensures a smooth user experience, particularly when processing images from the internet that require server-side handling due to CORS policies.

### Independent Usage
For those interested in using the OCR functionality directly or for custom implementations, the server can be accessed independently. Here is the endpoint you can use to interact with the OCR service:
```bash
https://fierce-mountain-99172-8d2017e4ad7b.herokuapp.com/ocr?imageUrl={YOUR_IMAGE_URL}
```
Replace `{YOUR_IMAGE_URL}` with the actual URL of the image you wish to process. The server will process the image and return the extracted text as a JSON response. This can be useful for testing or integrating the OCR service into other projects.

## Local Development Setup

To set up your local development environment for this project, you need to have Node.js and Angular CLI installed on your machine. You can then clone the repository using the following command:
```bash
git clone https://github.com/emmapapaioan/ShoppingProject.git
```

Once you have cloned the repository, navigate to the project directory and install the dependencies using the following command:
```bash
npm install
```

You can then start the development server and launch the application in your browser by running the following command:
```bash
ng serve
```

The application should be available at http://localhost:4200/ or at whatever port is available.

## Deployment

To deploy your own version of the application, you'll need to set up your own Firebase project. Follow these steps:

1. **Setup Firebase Project**:
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Obtain your project ID and update the Firebase configuration in your project's environment settings.

2. **Build the Project**:
   - Ensure you have Angular CLI installed. Then, build your project with:
     ```bash
     ng build
     ```

3. **Deploy to Firebase Hosting**:
   - Install Firebase CLI by running `npm install -g firebase-tools`.
   - Authenticate the Firebase CLI with your Google account by running `firebase login`.
   - Initialize Firebase in your project directory (if not already done):
     ```bash
     firebase init
     ```
   - Deploy the built project to Firebase Hosting:
     ```bash
     firebase deploy --project your-firebase-project-id
     ```
     

## Acknowledgments

The initial concept of this project was inspired by the Udemy course "The Complete Guide to Angular 2" by Maximilian Schwarzmüller, which helped lay the foundational skills in Angular development.
While the course provided the initial spark and valuable Angular knowledge, this project has since evolved into a more comprehensive application, incorporating advanced features and server-side components that were developed independently.
For those interested in Angular fundamentals, the course can be found [here](https://www.udemy.com/course/the-complete-guide-to-angular-2/).

