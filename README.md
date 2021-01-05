## Project Name & Pitch

Tarbuti

An application used to collect trusted users recommendations cultural events services providers. the data is presented to all, according to filters defined by tags.

## Project Status

This is the backend part of Tarbuti project.
This project is currently in development.  

## Project Screen Shot(s)

## Installation and Setup Instructions 

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

Installation:

`npm install`   

To Start Server:

`npm start`  

configuration:

config.json file is not included in this repo. pls refer to me directlly before you run this API


## Reflection

  This is a REST API designed to serve the Tarbuti App. this API enables signUp and Admin approval of users, as well as login to approved user. it also enable getting the data from approved user and store id in DB. 

  Ive decided on a flow were the user is 1st registering and upon admin approval this API generated a random password and send it to the mail the user put in registration. this may akter to using phoneNum and sms instead of mail later on.

  I used Node.js, express, nodemailer and mongoose technologies and MongoDB/Atlas for DB driver/storage. 

  the Admin is registered manually directlly in the DB.