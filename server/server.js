require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const massive = require("massive")
const session = require("express-session")

let {
    SERVER_PORT,
    REACT_APP_CLIENT_ID,
    CLIENT_SECRET,
    REACT_APP_DOMAIN,
    CONNECTION_STRING,
    SESSION_SECRET
} = process.env;

//Set up your sessions abilities
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized:false
}))

//massive creates the connection from our server to the database
//Your database's conneciton string is entered as the argument, and then we're using the .then statement to "set" the variable name "db" so that it represents the database itself (which is automatically returned to our .then statement)
//This db variable acctually gets put on the "req" object
massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
})

//This is the endpoint that Auth0 will be redirecting to after it logs you in as a user
//IN THIS ENDPOINT WE'LL SET UP OUR SESSION OBJECT IN OUR SERVER SO THAT THE USER SHOWS AS BEING LOGGED IN TO A SESSION
app.get('/auth/callback', async (req, res) => {
    //code from Auth0 sent on req.query.code
    //We need to use that code and exchange it for a token
    let payload = {
        client_id: REACT_APP_CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: `http://${req.headers.host}/auth/callback`
    }
    //post request to exchange the Auth0 code for a token
    let responseWithToken = await axios.post(`https://${REACT_APP_DOMAIN}/oauth/token`, payload)
    //Exchange token for user data
    let userData = await axios.get(`https://${REACT_APP_DOMAIN}/userinfo?access_token=${responseWithToken.data.access_token}`);
    const db = req.app.get('db');
    let {sub, name, picture} = userData.data;
    let userExists =  await db.find_user([sub])
    //Check to see if a user already exists (vs. if they haven't created a user profile yet)
    if(userExists[0]){
        //This will open a running session in your server for whichever user is now logged in
        req.session.user = userExists[0];
        res.redirect('http://localhost:3000/#/private');
        console.log("You Logged In!!!")
    } else {
        //If the user doesn't exist, You'll create a new user and redirect to the home page
        //To see how you could do this without .then() (i.e. using async/await), see the commented-out code below
        db.create_user([sub, name, picture]).then(createdUser => {
            //This creates a session user in our SERVER, so that you can check if a user is logged in
            req.session.user = createdUser[0];
            res.redirect("http://localhost:3000/#/private");
        })
        //The following code is exactly like the code above, except done using an await statement rather than a normal .then() format
        
        // let createdUser = await db.create_user([sub, name, picture])
        // req.session.user = createdUser[0]
        // res.redirect("/")
    }
})


//This get request will be used when a component loads to verify whether or not the user is logged in
app.get("/api/user-data", (req, res) => {
    //This if statement checks the info made in line 60 of our code, to see if the user is logged in, and therefor exists on our req.session object
    if(req.session.user){
        //If the user is logged in, we are sending them the user data that we've stored in the req.sesison object
        res.status(200).send(req.session.user)
    } else {
        res.status(401).send("Nice try, sucker. You must be logged in to get this information.")
    }
})

//Our logout endpoint
app.get('/api/logout', (req, res) => {
    //This command destroys the current user session, along with all the stored user info from the login
    req.session.destroy();
    res.redirect('http://localhost:3000/#/')
})

app.listen(SERVER_PORT, () => {
    console.log(`Server listening on port ${SERVER_PORT}`)
});