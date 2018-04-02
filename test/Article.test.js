const Article = require("../lib/Article");

jest.spyOn(console, "log");

describe("Article", () => {
  /**
   * @type {Article}
   */
  let article;

  test("pop()", async () => {
    expect.assertions(1);
    article = await Article.pop();
    expect(article).toBeInstanceOf(Article);
  });

  test("message()", async () => {
    expect.assertions(1);
    const message = await article.message();
    expect(message.length).toBeLessThanOrEqual(140);
  });
});
