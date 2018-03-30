// index.js
require("dotenv").config();
const Article = require("./lib/Article");
const Twitter = require("twitter");
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

(async () => {
  try {
    const article = await Article.pop();
    if (article) {
      const message = await article.message();
      const tweet = await client.post("statuses/update", { status: message });
      console.log(tweet);
    }
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
