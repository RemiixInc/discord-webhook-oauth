// Import modules
const express = require('express');
const app = express();
const axios = require('axios');

// Set these variables
const client_id = ""
const client_secret = ""
const redirect_uri = ""

app.get('/', (req, res) => {
  // If the authorization hasn't been completed, redirect to it
  if (!req.query.code) return res.redirect(`https://discord.com/api/oauth2/authorize?response_type=code&client_id=${client_id}&scope=webhook.incoming&redirect_uri=${redirect_uri}`);
  // Contact Discord with OAuth2 code and create the webhook
  const body = {
    'client_id': client_id,
    'client_secret': client_secret,
    'grant_type': 'authorization_code',
    'code': req.query.code,
    'redirect_uri': redirect_uri,
    'scope': 'webhook.incoming'
  };
  axios.post('https://discord.com/api/v8/oauth2/token', body, {
    transformRequest: function(json) {
      return Object.entries(json)
        .map(function(e) { return encodeURIComponent(e[0]) + "=" + encodeURIComponent(e[1]); })
        .join('&');
    },
  })
    .then(function(response) {
      // Log generated webhook url
      console.log(response.data.webhook.url)
      res.send("Success!")
    })
    .catch(function(error) {
      // If something went wrong
      console.log(error)
      res.send("Error!")
    });
});

// Start server
app.listen(8080, () => { 
  console.log("Server started!") 
});
