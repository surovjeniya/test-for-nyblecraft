

 1. user table - fields: (email, firstName, lastName, image(string), pdf(binary))
 2. crud operations on user
     2.1 Create User http://localhost:5000/api/user (POST)
     2.2 Detele User http://localhost:5000/api/user/:id (DELETE)
     2.3 Update User  http://localhost:5000/api/user/:id (PUT)
     2.4 Get User  http://localhost:5000/api/user/:id (GET)
     2.5 Upload Image for User  http://localhost:5000/api/user/upload-image/:id (POST)
     2.6 Create PDF for User http://localhost:5000/api/user/create-pdf/:email (POST)
