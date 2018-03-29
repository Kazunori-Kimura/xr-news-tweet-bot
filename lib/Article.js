// Article.js
require("dotenv").config();

const redis = require("redis");
/**
 * Redis Client
 * @type {RedisClient}
 */
let client;
if (process.env.REDIS_URL) {
  // heroku
  const url = require("url");
  const data = url.parse(process.env.REDIS_URL);
  client = redis.createClient(data.port, data.hostname);
  client.auth(data.auth.split(":")[1]);
} else {
  // local
  client = redis.createClient();
}

const googl = require("goo.gl");
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
googl.setKey(GOOGLE_API_KEY);

/**
 * 記事
 */
class Article {
  /**
   * 
   * @param {string} url 
   * @param {string} title 
   */
  constructor(url, title) {
    this.url = url;
    this.title = title;
  }

  /**
   * @returns {Promise<string>}
   */
  async message() {
    const shorturl = await googl.shorten(this.url);
    const titleLength = 120 - shorturl.length;
    let shorttitle = this.title;
    if (shorttitle.length > titleLength) {
      shorttitle = shorttitle.slice(0, titleLength - 3) + "...";
    }

    return `${shorttitle} (${shorturl}) #XR_News`;
  }

  /**
   * @returns {Promise<Article>}
   */
  static async pop() {
    return new Promise((resolve, reject) => {
      // LPOP
      client.lpop("xr-list", (err, reply) => {
        if (err) {
          reject(err);
          return;
        }
        let article = null;
        if (reply) {
          const data = JSON.parse(reply);
          article = new Article(data.url, data.title);
        }

        resolve(article);
      });
    });
  }
}

module.exports = Article;
