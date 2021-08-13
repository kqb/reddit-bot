const puppeteer = require("puppeteer");
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const randomUseragent = require('random-useragent');
var robot = require("robotjs");


const BASE_URL = "https://old.reddit.com/login";
const SUBREDDIT_URL = subreddit => `${BASE_URL}/r/${subreddit}`;
const USER_URL = userpage => `${BASE_URL}/user/${userpage}`

const dbc = require('./deathbycaptcha.js');

const username = 'shinkirom'; // DBC account username
const password = 'P3Ws5JcYP+3Zt_K'; // DBC account password

const self = {
  browser: null,
  page: null,
  keywords: [],
  number: 25,
  type: "hot",
  limit: null,
  randomUseragent,

  capchaSolve: () => {
    // Proxy and Recaptcha token data
    const token_params = JSON.stringify({
      'proxy': 'http://a2.atcproxys.com:3127:100086:zQwGp/sF',
      'proxytype': 'HTTP',
      'googlekey': '6LeTnxkTAAAAAN9QEuDZRpn90WwKk_R1TRW_g-JC',
      'pageurl': 'https://old.reddit.com/login',
    });

    // Death By Captcha Socket Client
    const client = new dbc.SocketClient(username, password);
    // const client = new dbc.HttpClient(username, password) for http client

    // Get user balance
    client.get_balance((balance) => {
      console.log(balance);
    });

    // Solve captcha with type 4 & token_params extra arguments
    client.decode({
      extra: {
        type: 4,
        token_params: token_params
      }
    }, (captcha) => {
      if (captcha) {
        console.log('Captcha ' + captcha['captcha'] + ' solved: ' + captcha['text']);

        /*
         * Report an incorrectly solved CAPTCHA.
         * Make sure the CAPTCHA was in fact incorrectly solved!
         * client.report(captcha['captcha'], (result) => {
         *   console.log('Report status: ' + result);
         * });
         */

      }
    });
  },
  moveMouse: () => {
    // Speed up the mouse.
    console.log("movestart")
    robot.setMouseDelay(2);

    var twoPI = Math.PI * 2.0;
    var screenSize = robot.getScreenSize();
    var height = (screenSize.height / 2) - 10;
    var width = screenSize.width;

    for (var x = 0; x < width; x++) {
      y = height * Math.sin((twoPI * x) / width) + height;
      robot.moveMouse(x, y);
    }
    console.log("movedone")

  },
  keyboard: (word) => {
    // Type "Hello World".
    robot.typeString(word);

    // Press enter.
    robot.keyTap("enter");

  },

  initializeSubreddit: async (subreddit, opts = {
    headless: false,
    devtools: true
  }) => {
    this.pageOptions = {
      waitUntil: 'networkidle2',
      timeout: countsLimitsData.millisecondsTimeoutSourceRequestCount
    };
    puppeteerExtra.use(pluginStealth());

    self.browser = await puppeteerExtra.launch(opts);
    self.page = await self.browser.newPage();

    // await self.page.goto(SUBREDDIT_URL(subreddit), {
    //   waitUntil: "networkidle2"
    // });
    await self.page.goto(SUBREDDIT_URL(BASE_URL), {
      waitUntil: "networkidle2"
    });
  },
  initialize: async (subreddit, opts = {
    headless: false,
    devtools: true
  }) => {
    self.browser = await puppeteer.launch(opts);
    self.page = await self.browser.newPage();
    console.log(BASE_URL)
    // await self.page.goto(BASE_URL, {
    //   waitUntil: "networkidle2"
    // });
  },
  login: async (username, password) => {
    await self.page.goto(BASE_URL, {
      waitUntil: "networkidle2"
    })
    await page.type('#user_reg', username , {
      delay: () =>  Math.random() * (3000 - 500) + 500
    });
    await page.type('#passwd_reg', password , {
      delay: () =>  Math.random() * (3000 - 500) + 500
    });
    await page.type('#passwd2_reg', password , {
      delay: () =>  Math.random() * (3000 - 500) + 500
    });
    await page.click('#register-form button[type=submit]');


    // await self.page.type('body > main > form > fieldset > label:nth-child(2) > input[type=text]', username, {
    //   delay: () =>  Math.random() * (3000 - 500) + 500
    // })
    // await self.page.type('body > main > form > fieldset > label:nth-child(3) > input[type=text]', password, {
    //   delay: () =>  Math.random() * (3000 - 500) + 500
    // })
    // self.moveMouse
    // await self.page.waitFor(4000)
    // await self.page.click('body > main > form > fieldset > button')

    // await self.page.waitFor(1500)
    // let error = await self.page.$('div[class="status error"]')
    // if (error) {
    //   let errorMessage = await (await error.getProperty('innerText')).jsonValue()
    //   console.log(`${username} failed login`)
    //   console.log(errorMessage)
    // }
  },
  gotoUser: async (user) => {
    // console.log(USER_URL(user))
    // console.log(self.page)

    await self.page.goto(USER_URL(user), {
      waitUntil: "networkidle2"
    })
    // console.log(USER_URL(user))

  },
  upvoteLinkWithKeyword: async (keyword) => {
    // const aElementsWithKeyword = await self.page.$x(`//a[contains(., '${keyword}')]`);
    const aElementsWithKeyword = null
    await page.evaluate(() => {
      aElementsWithKeyword = [...document.querySelectorAll('a')].find(element => element.textContent.includes(keyword));
    });
    console.log(aElementsWithKeyword)

  },
  close: async () => {
    await self.browser.close();
  },
  searchFor: keywords => {
    self.keywords = (Array.isArray(keywords) ? keywords : [keywords]).map(
      keyword => keyword.toLowerCase()
    );

    return self;
  },
  get: async opts => {
    if (
      opts &&
      (Object.entries(opts).length !== 0 && opts.constructor === Object)
    ) {
      self.setOptions(opts);
    } else if (Number.isInteger(opts)) {
      self.limit = opts;
    }

    if (self.type !== "hot") {
      await self[`switchTo${self.type.toUpperCase()}Tab`]();
    }

    let results = [];
    do {
      const parsedResults = await self.parseResults();
      results = [...results, ...parsedResults];

      if (results.length < (self.limit || self.number)) {
        const nextPageButton = await self.page.$(
          'span[class="next-button"] > a[rel="nofollow next"]'
        );

        if (!nextPageButton) break;

        await nextPageButton.click();
        await self.page.waitForNavigation({
          waitUntil: "networkidle2"
        });
      }
    } while (results.length <= (self.limit || self.number));

    if (self.keywords.length) {
      return results
        .slice(0, self.number)
        .filter(result => self.containsAnyOfTheKeywords(result.title));
    }

    return results.slice(0, self.limit || self.number);
  },

  setOptions: opts => {
    Object.entries(opts).forEach(pair => {
      if (self.hasOwnProperty(pair[0])) {
        if (pair[0] === "keywords") {
          self.searchFor(pair[1]);
        } else {
          self[pair[0]] = pair[1];
        }
      }
    });
  },

  getLatest: async opts => {
    if (
      opts &&
      (Object.entries(opts).length !== 0 && opts.constructor === Object)
    ) {
      self.setOptions(opts);
    }
    return await self.get();
  },

  getLatestHot: async opts => {
    return await self.get();
  },

  getLatestNew: async _ => {
    self.type = "new";

    return await self.get();
  },

  parseResults: async () => {
    const elements = await self.page.$$('#siteTable > div[class*="thing"]');
    const results = [];

    for (const element of elements) {
      const title = await element.$eval('p[class="title"]', node =>
        node.innerText.trim()
      );

      if (self.limit && self.keywords.length) {
        if (!self.containsAnyOfTheKeywords(title)) {
          continue;
        }
      }

      const link =
        BASE_URL +
        (await element.$eval('p[class="title"] > a', node =>
          node.getAttribute("href")
        ));
      const rank = await element.$eval('span[class="rank"]', node =>
        node.innerText.trim()
      );
      const postTime = await element.$eval('p[class="tagline "] > time', node =>
        node.getAttribute("title")
      );
      const authorUrl = await element.$eval(
        'p[class="tagline "] > a[class*="author"]',
        node => node.getAttribute("href")
      );
      const authorName = await element.$eval(
        'p[class="tagline "] > a[class*="author"]',
        node => node.innerText.trim()
      );
      const score = await element.$eval('div[class="score likes"]', node =>
        node.innerText.trim()
      );
      const commentsNo = await element.$eval(
        'a[data-event-action="comments"]',
        node => node.innerText.trim()
      );

      results.push({
        title,
        link,
        rank,
        postTime,
        authorUrl,
        authorName,
        score,
        commentsNo
      });
    }

    return results;
  },

  containsAnyOfTheKeywords: text => {
    const textWords = text.split(" ").map(word => word.toLowerCase());
    return self.keywords.some(keyword =>
      textWords.find(word => word === keyword)
    );
  },

  switchToNEWTab: async () => {
    const newTabButton = await self.page.$(
      'ul[class="tabmenu "] li:nth-child(2) a'
    );

    if (!newTabButton) return;

    await newTabButton.click();
    await self.page.waitForNavigation({
      waitUntil: "networkidle2"
    });
  }
};

module.exports = self;