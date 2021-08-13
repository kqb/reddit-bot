const fs = require('fs');
const puppeteer = require('puppeteer');
// const request = require('request-promise-native');
const poll = require('promise-poller').default;
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const pluginProxy = require('puppeteer-extra-plugin-proxy');
const nameGen = require('./nameGen.js');
const pwGen = require('./pwGen.js');
const randomUseragent = require('random-useragent');
const proxyChain = require('proxy-chain');
const dbc = require('./deathbycaptcha.js');
const util = require('util');

// Set test environment which disables proxy and actual captcha call to save on costs.
const isTest = false;
const useProxy = true;

const username = 'shinkirom'; // DBC account username
const password = 'P3Ws5JcYP+3Zt_K'; // DBC account password
// const proxyUrl = 'http://a2.atcproxys.com:3127'
const proxies = ["us-prime.resdleafproxies.com:7000:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7000:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7000:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7000:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7000:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7000:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7000:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7000:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7000:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7000:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7000:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7000:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7000:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7001:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7001:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7001:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7001:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7001:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7001:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7001:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7001:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7001:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7001:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7001:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7001:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7001:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7002:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7002:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7002:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7002:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7002:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7002:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7002:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7002:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7002:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7002:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7002:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7002:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7002:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7003:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7003:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7003:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7003:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7003:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7003:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7003:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7003:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7003:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7003:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7003:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7003:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7003:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7004:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7004:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7004:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7004:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7004:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7004:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7004:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7004:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7004:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7004:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7004:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7004:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7004:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7005:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7005:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7005:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7005:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7005:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7005:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7005:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7005:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7005:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7005:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7005:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7005:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7005:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7006:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7006:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7006:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7006:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7006:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7006:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7006:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7006:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7006:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7006:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7006:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7006:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7006:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7007:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7007:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7007:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7007:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7007:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7007:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7007:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7007:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7007:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7007:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7007:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7007:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7007:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7008:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7008:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7008:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7008:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7008:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7008:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7008:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7008:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7008:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7008:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7008:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7008:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7008:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7009:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7009:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7009:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7009:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7009:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7009:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7009:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7009:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7009:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7009:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7009:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7009:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7009:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7010:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7010:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7010:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7010:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7010:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7010:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7010:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7010:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7010:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7010:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7010:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7010:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7010:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7011:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7011:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7011:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7011:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7011:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7011:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7011:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7011:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7011:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7011:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7011:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7011:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7011:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7012:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7012:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7012:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7012:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7012:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7012:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7012:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7012:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7012:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7012:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7012:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7012:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7012:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7013:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7013:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7013:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7013:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7013:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7013:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7013:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7013:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7013:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7013:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7013:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7013:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7013:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7014:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7014:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7014:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7014:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7014:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7014:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7014:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7014:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7014:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7014:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7014:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7014:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7014:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7015:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7015:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7015:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7015:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7015:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7015:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7015:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7015:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7015:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7015:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7015:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7015:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7015:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7016:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7016:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7016:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7016:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7016:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7016:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7016:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7016:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7016:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7016:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7016:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7016:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7016:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7017:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7017:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7017:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7017:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7017:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7017:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7017:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7017:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7017:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7017:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7017:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7017:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7017:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7018:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7018:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7018:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7018:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7018:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7018:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7018:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7018:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7018:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7018:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7018:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7018:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7018:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7019:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7019:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7019:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7019:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7019:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7019:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7019:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7019:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7019:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7019:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7019:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7019:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7019:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7020:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7020:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7020:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7020:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7020:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7020:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7020:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7020:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7020:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7020:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7020:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7020:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7020:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7021:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7021:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7021:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7021:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7021:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7021:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7021:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7021:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7021:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7021:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7021:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7021:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7021:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7022:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7022:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7022:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7022:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7022:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7022:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7022:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7022:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7022:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7022:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7022:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7022:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7022:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7023:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7023:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7023:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7023:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7023:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7023:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7023:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7023:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7023:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7023:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7023:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7023:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7023:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7024:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7024:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7024:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7024:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7024:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7024:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7024:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7024:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7024:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7024:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7024:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7024:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7024:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7025:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7025:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7025:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7025:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7025:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7025:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7025:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7025:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7025:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7025:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7025:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7025:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7025:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7026:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7026:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7026:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7026:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7026:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7026:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7026:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7026:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7026:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7026:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7026:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7026:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7026:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7027:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7027:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7027:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7027:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7027:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7027:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7027:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7027:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7027:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7027:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7027:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7027:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7027:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7028:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7028:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7028:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7028:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7028:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7028:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7028:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7028:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7028:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7028:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7028:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7028:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7028:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7029:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7029:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7029:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7029:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7029:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7029:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7029:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7029:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7029:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7029:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7029:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7029:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7029:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7030:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7030:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7030:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7030:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7030:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7030:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7030:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7030:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7030:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7030:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7030:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7030:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7030:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7031:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7031:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7031:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7031:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7031:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7031:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7031:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7031:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7031:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7031:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7031:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7031:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7031:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7032:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7032:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7032:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7032:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7032:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7032:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7032:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7032:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7032:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7032:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7032:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7032:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7032:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7033:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7033:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7033:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7033:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7033:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7033:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7033:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7033:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7033:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7033:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7033:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7033:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7033:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7034:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7034:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7034:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7034:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7034:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7034:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7034:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7034:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7034:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7034:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7034:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7034:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7034:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7035:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7035:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7035:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7035:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7035:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7035:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7035:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7035:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7035:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7035:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7035:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7035:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7035:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7036:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7036:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7036:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7036:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7036:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7036:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7036:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7036:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7036:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7036:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7036:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7036:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7036:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7037:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7037:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7037:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7037:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7037:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7037:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7037:orolpnlm8wevu6sgpijrps+6:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7037:orolpnlm8wevu6sgpijrps+7:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7037:orolpnlm8wevu6sgpijrps+8:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7037:orolpnlm8wevu6sgpijrps+9:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7037:orolpnlm8wevu6sgpijrps+10:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7037:orolpnlm8wevu6sgpijrps+11:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7037:orolpnlm8wevu6sgpijrps+12:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7038:orolpnlm8wevu6sgpijrps+0:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7038:orolpnlm8wevu6sgpijrps+1:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7038:orolpnlm8wevu6sgpijrps+2:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7038:orolpnlm8wevu6sgpijrps+3:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7038:orolpnlm8wevu6sgpijrps+4:zfphnxrwhx",
    "us-prime.resdleafproxies.com:7038:orolpnlm8wevu6sgpijrps+5:zfphnxrwhx"
];
let proxyRegex = /([^:]*):([^:]*):([^:]*):([^:]*)/;
let proxyIndex = 4;

const chromeOptions = (prox) => ({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    slowMo: 10,
    defaultViewport: null,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        "--disable-notifications",
        (isTest || !useProxy) ? '' : `--proxy-server=https://${prox[1]}:${prox[2]}`

    ],
    headless: false,


});

let timesToRun = 1102;
const emailList = ["guardwing.io"]
let redditUser = ''
let redditEmail = ''
let redditPassword = pwGen()
// const router = express.Router();

const initRedditUserData = () => {
    if (!isTest) {
        redditUser = nameGen();
        redditEmail = `${redditUser.toLowerCase()}@${emailList[~~(Math.random() * emailList.length)]}`
    } else {
        // test 
        redditUser = "apple";
        redditEmail = `${redditUser.toLowerCase()}@${emailList[~~(Math.random() * emailList.length)]}`

    }
}


const checkLoading = async (page) => {
    let passed = await page.evaluate(() => {
        let elements = Array.from(document.querySelectorAll("#register-form c-form-control-feedback-error"));
        // Make sure 2 check marks are shown for username and email
        return elements.reduce((a, b) => a + ((getComputedStyle(b).display) == "none" ? 0 : 1), 0) === 0
    });
    page.waitForTimeout(10)
    if (!passed) await checkLoading(page);

}
const clearField = async (page, selector) => {
    const inputValue = await page.$eval(selector, el => el.value);
    if (!inputValue.length) return
    await page.click(selector);
    for (let i = 0; i < inputValue.length; i++) {
        await page.keyboard.press('Backspace');
    }

}
const fillNameEmail = async (page) => {
    await clearField(page, '#user_reg')
    await clearField(page, '#email_reg')
    initRedditUserData();
    await page.waitForTimeout(~~(Math.random() * 1000));
    await page.type('#user_reg', redditUser);
    await page.type('#email_reg', redditEmail);
    await page.click('#passwd_reg');
    console.log(`Check validator loading`)
    await checkLoading(page);
    await page.waitForTimeout(1000);

    console.log(`Validator loading passed`)

    console.log("Check validator pass")
    let passed = await page.evaluate(() => {
        let elements = Array.from(document.querySelectorAll("#register-form span.c-form-control-feedback.c-form-control-feedback-success"));
        // Make sure 2 check marks are shown for username and email
        return elements.reduce((a, b) => a + ((getComputedStyle(b).display) == "none" ? 0 : 1), 0) === 2
    });

    if (!passed) {
        console.log("Validator failed, regenerating username until passes")
        await fillNameEmail(page);
    }

}
// const setRandomInterval = async (cb) => {
//     var min = 5,
//         max = 10;
//     var rand = Math.floor(Math.random() * (max - min + 1) + min); //Generate Random number between 5 - 10
//     console.log('Wait for ' + rand + ' seconds');
//     return new Promise((res, rej) => {
//         const interval = setInterval(async () => {
//                 if (await cb()) {
//                     res();
//                     clearInterval(interval);
//                 }
//             },
//             rand * 100);
//     });
// }

async function main() {
    puppeteerExtra.use(pluginStealth());
    let prox = proxies[proxyIndex++ % proxies.length].match(proxyRegex);
    if (!isTest && useProxy) puppeteerExtra.use(pluginProxy({
        address: prox[1],
        port: prox[2],
        credentials: {
            username: prox[3],
            password: prox[4],
        }
    }));
    const browser = await puppeteerExtra.launch(chromeOptions(prox));
    try {

        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (['image', 'font'].indexOf(request.resourceType()) !== -1) {
                request.abort();
            } else {
                request.continue();
            }
        });
        await page.goto('https://old.reddit.com/login');
        await fillNameEmail(page);
        // const password = getPassword();
        await page.type('#passwd_reg', redditPassword);
        page.waitForTimeout(500)

        await page.type('#passwd2_reg', redditPassword);
        page.waitForTimeout(500)

        console.log(redditUser, redditEmail, redditPassword)
        await checkLoading(page);
        page.waitForTimeout(1000)

        const response = await capchaSolve();
        console.log(response);
        console.log("Sending captcha to solve....")
        await page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${response}";`);
        await page.click('#register-form button[type=submit]');
        page.on("framenavigated", async frame => {
            if (frame._url === 'https://old.reddit.com/') {
                // await page.goto()

                const cookies = await page.cookies()


                console.log(redditUser, redditEmail, redditPassword, cookies)
                var data = `${redditUser}, ${redditEmail}, ${redditPassword}, ${JSON.stringify(cookies)} \n`;

                // append data to file
                fs.appendFileSync('sample.txt', data, 'utf8');
                console.log("Data is appended to file successfully.")
                await page.goto("https://www.reddit.com/search/?q=Madbabydoge", {
                    waitUntil: 'networkidle2'
                });

                // page.waitForSelector('#vote-arrows-t3_p02but > button:nth-child(1)')
                //     .then(async () => {
                console.log("registration done")
                await page.evaluate(() => {
                    let elements = document.querySelectorAll(".voteButton[data-click-id=upvote]")
                    for (let i = 0; i < elements.length; i += 2) {
                        // await new Promise(resolve => setTimeout(resolve, 100));
                        elements[i].click();
                    }
                });
                // const upvote = await page.$('#vote-arrows-t3_p02but > button:nth-child(1)');
                // await upvote.click()
                console.log("upvote done")
                page.waitForTimeout(1000)

                await browser.close();
                // });
            }
        });
        // setTimeout(async () => await browser.close(), 50000)

    } catch (error) {
        console.log(error);
    } finally {
        // while (timesToRun-- > 0)
        //    await main();
    }
}

const capchaSolve = async () => {
    if (isTest) return
    // Proxy and Recaptcha token data
    const token_params = JSON.stringify(
        (isTest || !useProxy) ? {
            'googlekey': '6LeTnxkTAAAAAN9QEuDZRpn90WwKk_R1TRW_g-JC',
            'pageurl': 'https://old.reddit.com/login',
        } : {
            'proxy': 'http://a2.atcproxys.com:3127:100086:zQwGp/sF',
            'proxytype': 'HTTP',
            'googlekey': '6LeTnxkTAAAAAN9QEuDZRpn90WwKk_R1TRW_g-JC',
            'pageurl': 'https://old.reddit.com/login',
        }
    );

    // Death By Captcha Socket Client
    // const client = new dbc.SocketClient(username, password);
    const client = new dbc.HttpClient(username, password)
    const asyncGetBalance = util.promisify(client.get_balance).bind(client);
    const asyncDecode = util.promisify(client.decode).bind(client);

    // Get user balance
    let balance = await asyncGetBalance();

    console.log(`balance: ${balance}`)

    let captcha = await asyncDecode({
        extra: {
            type: 4,
            token_params: token_params
        }
    });
    console.log('Captcha ' + captcha['cpuaptcha'] + ' solved: ' + captcha['text']);
    return captcha.text;
};



(async () => {
    // while (true) {
    //     try {
    //         await main();

    //     } catch (err) {
    //         console.log(err)
    //     } finally {
    //         setTimeout(main, 30000);

    //     }

    // }
    await main();
})()