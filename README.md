# water_management_app
This app has a bare-bone(un modularized) implementation of what a water management system would function and look like. It is built keeping modularity in mind(with comments separating different pieces of code, which can be extracted as a module/component in future) using Node.js, Express.js, Sequelize, MYSQL, Nodemailer, React.js, TailwindCSS.

## Installation

Server:
( npm install ) on root directory

MYSQL setup (inside server.js): 
On the sequelize initialization pass the table_name, username and password of the database you want to use. Change host if needed.

NOTE: Need to populate the "waterusages" table with some dummy data to simulate some features.

sendMail setup(inside sendMail.js):
On the nodemailer initialization pass the email(user), password, host, PORT of the according to mailer you want to use.

( npm start ) to start the server

Client:
(npm install) on water-management-system directory

( npm start ) to start the client

## Simulating the app

To simulate the app for water usage update from the actual water meter, update the waterUsage in the database using
curl -X POST http://localhost:3000/usage -H "Content-Type: application/json" \
-d '{
    "UserId": 1,
    "usage": 12.5,
    "timestamp": "2025-05-31T10:00:00Z"
  }'

This will update the waterUsage of the user and will trigger the email notification if the usage is greater than the usage Limit of that user.
