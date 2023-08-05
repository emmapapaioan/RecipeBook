# RecipeBook

https://github.com/emmapapaioan/ShoppingProject/assets/108992250/813f201e-81da-47ac-9969-87dbc515b80e

RecipeBook is a web application developed using Angular framework. It allows users to store, view, edit, print, or delete recipes from a remote database. The project also provides OCR (Optical Character Recognition) functionality where users can upload an image with text (a recipe image, for example) and retrieve the text from the image.

## Technologies

The project is developed using Angular, a TypeScript-based open-source web application framework. It also uses other technologies such as HTML, CSS, Bootstrap, and TypeScript.

## Getting Started

To get started with the project, you need to have Node.js and Angular CLI installed on your machine. You can then clone the repository using the following command:
```git clone https://github.com/emmapapaioan/ShoppingProject.git```

Once you have cloned the repository, navigate to the project directory and install the dependencies using the following command:
```npm install```. If the result is not successfull, try ```npm install --legacy-peer-deps``` or ```npm install --force```. These commands will attempt to install the dependencies, with the last two options providing alternative ways to handle issues with peer dependencies or other conflicts.

You can then start the development server and launch the application in your browser by running the following command:
```ng serve```

The application should be available at http://localhost:4200/.

## Server-Side and OCR Functionality
The project includes server-side functionality essential for the OCR feature, particularly when the uploaded file is from an internet URL and a CORS policy exists. To use the server, navigate to the server-side directory and start it with the following command:
```node app.js```

## Acknowledgments
This project is being built as I follow along with the Udemy course "The Complete Guide to Angular 2" by Maximilian Schwarzmüller. It serves as a practical application to enhance my skills in Angular development.

You can find the course [here](https://www.udemy.com/course/the-complete-guide-to-angular-2/).

