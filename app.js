const express = require("express");
const app = express();
require("dotenv").config();


// mailchimp
const client = require("@mailchimp/mailchimp_marketing");


// replaces bodyParser.urlencolded({extended:true});
// built in. Parse url-encoded body
app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));




app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {

    // connecting/setting up mailchimp
    client.setConfig({
        apiKey: process.env.MAILCHIMP_API_KEY,
        server: process.env.MAILCHIMP_SERVER
    });

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // from mailchimp
    const listId = process.env.MAILCHIMP_LIST_ID;

    async function run() {
    
        const response = await client.lists.addListMember(listId, {
            
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName
                    }
          
        })
        console.log({response})
    }
    run()
        .then(() => res.sendFile(__dirname + "/success.html"))
        .catch((err) =>  {
           console.log({err});
            res.sendFile(__dirname + "/failure.html")
        });


});


app.post("/failure", (req, res) => {
    res.redirect("/");
});


app.get("/dad-jokes", async (req, res) => {
    res.sendFile(__dirname + "/dad-jokes.html");
})




// api key
// 7b3af28c01037e60c883ff38f7abd108-us11

// list id
// ab7a8ff4fd

app.listen( process.env.PORT || 3000, () => {
    console.log("server listening of port " + process.env.PORT);
});

