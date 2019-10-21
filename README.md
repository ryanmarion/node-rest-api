# node-rest-api
A RESTful API implemented in NodeJS Express + MongoDB for a store with users, products, and orders

Author: Ryan Marion

#Main Features:
-A RESTful, stateless backend
-Handles user authentication with JSON Web Tokens
-Supports API's for Products and Orders (which consist of products)

#User:
-Authentication is handled using JSON Web Tokens (JWT) - a JWT lifespan is 1 hour before re-login and generation of a new token is required
-Routes are handled at the /singup, /login, and /{userId} paths
-Handles GET, POST, and DELETE operations on users
-/signup routing will handle the registration of new users - credentials are encrypted
-/login routing will handle the login and generation of JWT - 1 hour lifespan for a given user/token
-/{userId} routing will hanndle a DELETE method on a user - JWT is required for this operation.

#Products API:
-The Product data model consists of an _id (unique), name, price, and an option to attach a product image associated with a product.
-Routes are handled at the /products or /products/{id} paths
-/products routes allow for GET and POST methods to get all products and create new products
-/prodcuts/{productId} routes allow for GET, PATCH, and DELETE methods when accessing individual products
-Authentication JWT is required for POST, PATCH, and DELETE operations.
-Product images can be accessed in the /uploads/{productImage} path
-Maximum product image size is spec's at 5MB, only .JPEG and .PNG mimetypes are accepted

#Orders API:
-Currently the Orders data model consists of an _id (unique), quantity, and an associated product in the order
-Routes are handled at the /orders and /orders/{orderId} paths
-/orders routes allow for GET and POST methods to access a list of all orders or to create a new order
-/orders/{orderId} routes allow for GET and DELETE methods to access a single order or delete a single order
-Authentication with JWT required for all operations - access to orders should be limited
