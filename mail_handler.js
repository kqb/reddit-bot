const path = require("path");
const gmail = require("gmail-tester");
(async () => {
    const email = await gmail.check_inbox(
        path.resolve(__dirname, "credentials.json"), // Assuming credentials.json is in the current directory.
        path.resolve(__dirname, "token.json"), // Look for gmail_token.json in the current directory (if it doesn't exists, it will be created by the script).
        {
            subject: "Verify your Reddit email address", // We are looking for 'Activate Your Account' in the subject of the message.
            from: "noreply@reddit.com", // We are looking for a sender header which is 'no-reply@domain.com'.
            // to: "leeladoge@gmail.com", // Which inbox to poll. credentials.json should contain the credentials to it.
            wait_time_sec: 10, // Poll interval (in seconds).
            max_wait_time_sec: 30, // Maximum poll time (in seconds), after which we'll giveup.
            include_body: true
        }
    );
    if (email) {
        console.log(email);
    } else {
        console.log("Email was not found!");
    }
})()