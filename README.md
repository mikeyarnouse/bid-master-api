# Bid Master

## Instructions To Run Application:

- Npm install all dependencies within the package.json file
- Set up .env file based on the contents of the.env.sample file
- Generate Secret Key for the .env file with the command: node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
- Run npx knex migrate:latest to create database tables
- Run npx knex seed:run to populate the database tables with mock user, item and bid data

## Overview

What is your app? Brief description in a couple of sentences.

#### Bid Master is an online bidding marketplace application. Users will be able to post bidding items to the site with a starting price and a specified expiration date. Other users will then be able to place bids on those items, and win them if they have the highest bid at the time of the bidding item's expiration.

### Problem

Why is your app needed? Background information around any pain points or other reasons.

#### This app is needed because it provides users the ability to gain value from items which they no longer want/use anymore, as well as search for and potentially win other items at a discounted bidding value. Albeit there are many other varieties of this sort of app available at ease to everyone, I thought it would be fun to build out for myself as a personal challenge.

### User Profile

Who will use your app? How will they use it? Any special considerations that your app must take into account.

#### Anyone who wants a great deal on user personal items or wants to make money from selling items they no longer use or want anymore will find use in this app.

### Features

List the functionality that your app will include. These can be written as user stories or descriptions with related details. Do not describe _how_ these features are implemented, only _what_ needs to be implemented.

- Registering an account
- Logging in
- Posting items for bid
- Placing bids on items
- Viewing all bidding items
- Viewing a specific user's bidding items
- Searching and sorting bidding items

## Implementation

### Tech Stack

List technologies that will be used in your app, including any libraries to save time or provide more functionality. Be sure to research any potential limitations.

- React
- React-Router
- Sass
- Node
- Express
- Axios
- AWS S3 Bucket

### APIs

List any external sources of data that will be used in your app.

### Sitemap

List the pages of your app with brief descriptions. You can show this visually, or write it out.

- HomePage:

  - Contains NavBar with Sign In Form or button to Register Account
  - Displays User's items in card form with picture of item, current bid, and time for expiration
  - Can only bid on items if you Register an account

- RegisterPage:

  - Form input in order to create an account for the user

- ProfilePage:

  - Displays account details for a given user
  - User can upload bidding items here
  - View the user's current listed bidding items

- UploadBiddingItemPage:

  - Form input in order to upload a bidding item

- BiddingItemDetailsPage:
  - Displays details for a given bidding item (i.e. item name, description, expiration)
  - Displays list of current bids for a given bidding item

### Mockups

Provide visuals of your app's screens. You can use tools like Figma or pictures of hand-drawn sketches.

- Figma Design:
  - https://www.figma.com/file/iViigEMQ7WB3AKIBbo6Do6/BidMaster-Figma-Design?type=design&node-id=0-1&mode=design&t=5nbcdReCHfqsrVkE-0

### Data

Describe your data and the relationships between them. You can show this visually using diagrams, or write it out.

![Screenshot of BidMaster ERD Diagram](/client/src/assets/images/bidmaster_erd.png)

- UsersTable one-to-many with BidsTable

  - This is because a user can place many bids, but a bid can only placed by one user

- UsersTable one-to-many with ItemsTable

  - This is because a user can post many items, but an item can only posted by one user

- ItemsTable one-to-many with BidsTable
  - Item can have many bids; one bid can only be on one item;

### Endpoints

List endpoints that your server will implement, including HTTP methods, parameters, and example responses.

- /api/users -> list of users
- /api/users/:userId -> for a specific user
- /api/users/:userId/items -> list of items for a specific user
- /api/users/:userId/items/:itemId -> for a specific item of a specific user

- /api/items -> list of all uploaded items
- /api/items/:itemId -> for a specific item
- /api/items/:itemId/bids -> list of bids on a specific item
- /api/items/:itemId/bids/:bidId -> for a specific bid on a specific item

- /api/bids -> list of all bids
- /api/bids/:bidId -> find a specific bid

### Auth

Does your project include any login or user profile functionality? If so, describe how authentication/authorization will be implemented.

Authentication Flow:

- Register:

  - When a user creates an account, the backend will verify the uniqueness of the username/email and securely store the user's credentials (e.g., hashed passwords) in the database.

- Login:

  - When a user logs in, the backend will verify the provided credentials against those stored in the database. If the credentials are correct, the backend will generate a session token or JWT (JSON Web Token) and send it back to the client.

- Home:

  - Manages the user's authentication state, with useState or useContext hooks, to store authentication-related data such as the user's login status and token.

- Logout:

  - Logout functionality that clears the user's session/token and updates the authentication state accordingly.

- All:
  - Implement error handling for scenarios such as invalid credentials, server errors, or network issues. Provide appropriate feedback to the user in case of errors.

## Roadmap

Scope your project as a sprint. Break down the tasks that will need to be completed and map out timeframes for implementation. Think about what you can reasonably complete before the due date. The more detail you provide, the easier it will be to build.

- Backend Database setup with MockData
- Backend Routes
- HomePage Component to get list of MockItems
- FrontEnd Register Component
- FrontEnd Sign In Component
- ProfilePage Component

## Nice-to-haves

Your project will be marked based on what you committed to in the above document. Under nice-to-haves, you can list any additional features you may complete if you have extra time, or after finishing.
