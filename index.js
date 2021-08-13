//https://jsoverson.medium.com/bypassing-captchas-with-headless-chrome-93f294518337

const reddit = require("./reddit");

(async () => {
  // await reddit.initializeSubreddit("smallbusiness", {
  //   headless: true,
  //   devtools: false
  // });
  await reddit.initialize("smallbusiness", {
    executablePath: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`,    
    headless: false,
    devtools: true,
    slowMo: 10,
    args: ['--no-sandbox', '--proxy-server=http://a2.atcproxys.com:3127:100086:zQwGp/sF'],
    defaultViewport: null,
  
  });
  await reddit.login('shinkirom', "fuck!")
  debug
  // reddit.gotoUser("smolpupnamedkat")
  // reddit.upvoteLinkWithKeyword("foxx")
  // const results = await reddit.get();
  // const results = await reddit.get({
  //   type: "new",
  //   number: 10
  // });
  // const results = await reddit.get({
  //   limit: 5
  // });

  // const results = await reddit.searchFor(["reminder", "appointment"]).get(5);
  // const results = await reddit
  //   .searchFor(["reminder", "appointment"])
  //   .get({ limit: 5 });

  // const results = await reddit.getLatestHot();
  // const results = await reddit.getLatestNew();

  // const results = await reddit.getLatest({
  //   type: "hot",
  //   number: 150
  //   // keywords: ["appointment", "reminder"]
  // });

  // if (!results.length) {
  //   console.log("No results");
  // }

  // results.forEach(result => {
  //   console.log("\n");
  //   console.log(`Title: ${result.title}`);
  //   console.log(`Link: ${result.link}`);
  //   console.log("\n");
  // });

  // await reddit.close();
})();
