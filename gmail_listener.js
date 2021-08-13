const express = require('express');
const Gmailpush = require('gmailpush');

const app = express();

// Initialize with OAuth2 config and Pub/Sub topic
const gmailpush = new Gmailpush({
  clientId: '12345abcdefg.apps.googleusercontent.com',
  clientSecret: 'hijklMNopqrstU12vxY345ZA',
  pubsubTopic: 'projects/gmailread-320106/topics/reddit'
});

const users = [
  {
    email: 'user1@gmail.com',
    token: {
      access_token: 'ABcdefGhiJKlmno-PQ',
      refresh_token: 'RstuVWxyzAbcDEfgh',
      scope: 'https://www.googleapis.com/auth/gmail.readonly',
      token_type: 'Bearer',
      expiry_date: 1543210123451
    }
  }
];

app.post(
  // Use URL set as Pub/Sub Subscription endpoint
  '/pubsub-push-endpoint',
  // Parse JSON request payload
  express.json(),
  (req, res) => {
    // Acknowledge Gmail push notification webhook
    res.sendStatus(200);

    // Get Email address contained in the push notification
    const email = gmailpush.getEmailAddress(req.body);

    // Get access token for the Email address
    const token = users.find((user) => user.email === email).token;

    gmailpush
      .getMessages({
        notification: req.body,
        token
      })
      .then((messages) => {
        console.log(messages);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

app.listen(3000, () => {
  console.log('Server listening on port 3000...');
});