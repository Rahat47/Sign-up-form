//*REQUIRED COMPONENTS
const express = require('express');
const bodyParser = require("body-parser")
const https = require("https")
const mailchimp = require("@mailchimp/mailchimp_marketing")
require('dotenv').config()
//*CREATE A NEW EXPRESS APP
const port = process.env.PORT
const app = express()

//*MAILCHIMP KEYS
const mcServer = "us17"
const mcApi = process.env.MCAPIKEY
const mcListId = "3a61c50aa1"


//*APP USES
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: true }))

//*ROUTES
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post('/', (req, res) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const phone = req.body.phone
    const email = req.body.email
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                    PHONE: phone
                },
                update_existing: true
            }
        ]
    };
    //!USING NORMAL HTTPS METHOD
    const jsonData = JSON.stringify(data)

    const url = `https://${mcServer}.api.mailchimp.com/3.0/lists/${mcListId}`

    const options = {
        method: "POST",
        auth: `rahat47:${mcApi}`
    }

    const request = https.request(url, options, response => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", data => console.log(JSON.parse(data)))
    })

    request.write(jsonData)
    request.end()
    //!Using the mailchipm library
    // mailchimp.setConfig({
    //     apiKey: mcApi,
    //     server: mcServer,
    // })
    // const run = async () => {
    //     const response = await mailchimp.lists.batchListMembers(mcListId, data)
    //     console.log(response);
    // }
    // run()
})


//* INITIALIZE APP
app.listen(port, () => {
    console.log("App Started at Port 3000");
})