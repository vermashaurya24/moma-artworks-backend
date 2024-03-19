# Meuseum of Modern Artworks - Backend

Welcome to the MoMA Artworks Backend repository! This project provides backend APIs for managing artists & artworks related to the Museum of Modern Art (MoMA). The API allows users to perform various operations such as retrieving artworks, adding new artworks, updating existing ones, and much more.

## APIs
![localhost_5000_swagger-ui_](https://github.com/vermashaurya24/moma-artworks-backend/assets/58764912/c4788533-4c61-4642-aa98-5096ad01e411)
These are the APIs provided here. Once the server is live, feel free to check out http://localhost:5000/swagger-ui/ to test these routes yourself!

## Getting Started 
- Clone this repository to your local machine.
- Install dependencies using ```npm install```.
- Set up your PostgreSQL database and configure the connection details in the .env file.
- Run the server using npm start.
- Explore the API documentation available at the ```/swagger-ui``` endpoint.
- All details about the server, port, and routes are given in the image above.

## Environment Variables
- On the root directory of the project, add a .env file.
- Populate the .env files with these values
```env
PORT=5000

HOST=localhost
POSTGRES_PORT=5432 #Your port
DATABASE=moma_artworks #You may use some other database
USER=postgres #Your username
PASSWORD=password #Your password

ARTISTS_PATH=../Artists.json
ARTWORKS_PATH=../Artworks.json
```

## Initializing database with Artists and Artworks data
Please follow the following steps to initialize our database with the required data.
  - Download the Artists.json and Artworks.json files from the [MoMA Repository](https://github.com/MuseumofModernArt/collection), and store store them in the root directory.
  - The root directory should look like this
    
  <div style="text-align:center;">
    <img src="https://github.com/vermashaurya24/moma-artworks-backend/assets/58764912/5f39894d-79f3-4d52-a4aa-58ba5f7e23bb" width="325" height="400">
  </div>
  
  - After which, there are two files in the /db folder - seeder.js & deseeder.js.
  - You may run the seeder.js file to create & initialize the database tables with all values present in the MoMA Artists.json & Artworks.json files.
  - After you are done, you may run the deseeder.js file to clear the database.

## Technologies Used
- Node.js
- Express.js
- PostgreSQL
- Swagger for API documentation
- Postman for testing routes locally

[View frontend repository here](https://github.com/vermashaurya24/moma-artworks-frontend)

Feel free to contact me for any queries!

