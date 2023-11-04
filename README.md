# Incedo Services GmbH Backend Challenge - Artist Search and CSV Export

This Node.js application allows you to search for artists by name and export the results to a CSV file. If no results are found, it retrieves random artist names from a JSON dictionary source file.

![Incedo Logo](addons/github_assets/incedo-logo_bg-white_4c%20Kopie.jpg)

## Table of Contents
- [Author](#author)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Example API Request](#example-api-request)
- [Author](#author)
 


# About The Author
You can connect with me here:
* [Donia Skima]()
* [Linkedin](https://www.linkedin.com/in/donia-skima/)
* [Github](https://github.com/doniaskima)

# Project Instructions


Following are the features of this project:
* **This backend is written in Typescript**: The type safety at build time and having intellisense for it in the IDE like vscode is unparalleled to productivity. I have found production bug reduced to a significant amount since most of the code vulnerabilities are identified during the build phase itself.
* **Centralised Error handling**: I have created a framework where all the errors are handled centrally. This reduces the ambiguity in the development when the project grows larger.
* **Centralised Response handling**: Similar to Error handling we have a response handling framework. This makes it very convenient 
* **Async execution**: I have used async/await for the promises and made sure to use the non-blocking version of all the functions with few exceptions.
* **Docker compose has been configured**: I have created the Dockerfile to provide the easy deployability without any setup and configurations. 
* **Unit test is favored**: The tests have been written to test the functions and routes without the need of the database server. Integration tests has also been done but the unit test is favored.



## Prerequisites

Before you get started, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/doniaskima/incedo-backend-challenge
   ```

   Change to the project directory:

   ```bash
     cd incedo-backend-challenge
   ```

   Install the project dependencies:

    ```bash
     npm install
   ```

## Configuration:

   Before you can use the application, you need to configure it.   Create a .env file in the project directory and specify the following environment variables:


    ```bash
     PORT=3000
     API_KEY=your_api_key
    ```


## Usage:

   To start the application, run:

    ```bash
     npm start
    ```
 
This will build the project and start the server. The application will be available at `http://localhost:your-port-number`, where `your-port-number` is the port you have configured in your project.

## Using the API

Once the application is running, you can use the API to search for artists by name and export the results to a CSV file. Here are the available API endpoints:

* GET `/search/:artistName`: Search for artists by name. Replace `:artistName` with the name of the artist you want to search for.
* GET `/search/:artistName/:csvFileName`: Gets the artist info and writes it to a CSV file in the `data` folder.

Example:


http://localhost:3000/search/EdSheeran
http://localhost:3000/search/EdSheeran/artist_data.csv


## Generating CSV

The application will generate a CSV file in the `src/data` directory with the artist data.

**Note:** If no results are found for a search, the application retrieves random artist names from a JSON dictionary source file and adds them to the CSV file.
 

