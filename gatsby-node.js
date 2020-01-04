/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const { graphql } = require("gatsby");
const { createFilePath } = require(`gatsby-source-filesystem`);
let Twit = require("twit");
let client = new Twit({
  consumer_key: "bPQMDh51VSyHCf5oAAJmXsBFG",
  consumer_secret: "sTom1IybTwTdZTQCNVwOQnjohvL6NZUtA7UYFQFBR0JnogONz6",
  access_token: "3369874427-UIs5sQNYk4WAakv3boiQepXbTpE3VIBraefHVL4",
  access_token_secret: "RFXz9APYIX5GJ8QBgobnSKD9GpH7W8H9lwoUY9pmOKOKn"
});

exports.onCreateNode = ({ node, actions, getNode }) => {};
exports.onPostBootstrap = gatsbyNodeHelpers => {
  console.log("POST BOOTSTRAP");
  const { getNodesByType } = gatsbyNodeHelpers;
  const allNodes = getNodesByType(`MarkdownRemark`)
    .filter(node => node.fields.relativeDir == "posts")
    .map(node => {
      return {
        fields: node.fields,
        frontmatter: node.frontmatter
      };
    });

  //console.log(allNodes);
  // let id = setInterval(() => {
  let randomIndex = Math.floor(Math.random() * allNodes.length);
  let article = allNodes.splice(randomIndex, 1)[0];
  if (article) {
    console.log("POSTING ARTICLE");
    let status = `${article.frontmatter.title} #${article.frontmatter.tags.join(
      " #"
    )}\n https://damiencosset.com${article.fields.url}`;
    client.post("statuses/update", { status }, function(err, data, response) {
      console.log(err);
      console.log(data);
    });
  }
  //     clearInterval(id);
  //   }
  // }, 1000 * 60 * 60 * 24 * 2);
};
