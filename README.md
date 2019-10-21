# node-rest-api
A RESTful API implemented wuth NodeJS/Express + MongoDB for a store with users, products, and orders

Author: Ryan Marion

## Main Features:
- A RESTful, stateless backend
- An MVC-type architecture with controllers managing the routes in Node/Express (no views currently implemented)
- A NoSQL MongoDB database for storing all users, products, and orders data - this app will validate any incoming data to the db
- Handles user authentication and route protection with JSON Web Tokens
- Supports API's for Products and Orders (which consist of products)
- Error handling for all endpoints
- Cross-Origin Resource Sharing (CORS) functionality handled by appending correct headers

## User:
- User data model includes email (unique) and password, encryped for security purposes
- Authentication is handled using JSON Web Tokens (JWT) - a JWT lifespan is 1 hour before re-login and generation of a new token is required
- Endpoints at the /singup, /login, and /{userId} paths
- Handles GET, POST, and DELETE operations on users
- The /signup endpoint will handle the registration of new users - credentials are encrypted
- The /login endpoint will handle the login and generation of JWT - 1 hour lifespan for a given user/token
- The /{userId} endpoint will hanndle a DELETE method on a user - JWT is required for this operation.

## Products API:
- The Product data model consists of an _id (unique), name, price, and a product image associated with a given product.
- API endpoints at the /products or /products/{id} paths
- The /products endpoint allows for GET and POST methods to get all products and create new products
- The /prodcuts/{productId} endpoint allows for GET, PATCH, and DELETE methods when accessing individual products
- Authentication JWT is required for POST, PATCH, and DELETE operations.
- Product images can be accessed in the /uploads/{productImage} path
- Maximum product image size is spec's at 5MB, only .JPEG and .PNG mimetypes are accepted

## Orders API:
- Currently the Orders data model consists of an _id (unique), quantity, and an associated product in the order
- Endpoints at the /orders and /orders/{orderId} paths
- The /orders endpoint allows for GET and POST methods to access a list of all orders or to create a new order
- The /orders/{orderId} endpoint allows for GET and DELETE methods to access a single order or delete a single order
- Authentication with JWT required for all operations - access to orders should be limited

## Testing
- This was a project mainly used to demonstrate the functionality of the API, so no automated testing was baked in
- All testing was done on a local server - this could lead to unforseen issues when deploying to a production environment, though CORS has been considered by appending the appropriate headers
- Manual testing performed using Postman to generated requests to the API on the local NodeJS server
- [Postman - Platform for API development](https://www.getpostman.com/)
- Entries to database go through validation prior to being entered

## Further Improvements
- The Orders data model could be expanded to be more robust in handling a variety of products
- Automated testing could be baked in
- Some refactoring of reptetitive error handling and other functionality could be improved upon
- Multer was used to upload files - this code could be broken out into its own file for a cleaner organization to the project
- This could be deployed for more robust testing.
