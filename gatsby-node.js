/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const { graphql } = require("gatsby");
const { createFilePath } = require(`gatsby-source-filesystem`);
const Twitter = require("twitter");

let client = new Twitter({
  consumer_key: "bPQMDh51VSyHCf5oAAJmXsBFG",
  consumer_secret: "sTom1IybTwTdZTQCNVwOQnjohvL6NZUtA7UYFQFBR0JnogONz6",
  access_token_key: "UIs5sQNYk4WAakv3boiQepXbTpE3VIBraefHVL4",
  access_token_secret: "RFXz9APYIX5GJ8QBgobnSKD9GpH7W8H9lwoUY9pmOKOKn"
});

exports.onCreateNode = ({ node, actions, getNode }) => {};
exports.onPostBootstrap = gatsbyNodeHelpers => {
  const { getNodesByType } = gatsbyNodeHelpers;
  const allNodes = getNodesByType(`MarkdownRemark`)
    .filter(node => node.fields.relativeDir == "posts")
    .map(node => {
      return `https://damiencosset.com${node.fields.url}`;
    });

  console.log(allNodes);
  client
    .post("statuses/update", { status: "I Love Twitter" })
    .then(function(tweet) {
      console.log(tweet);
    })
    .catch(function(error) {
      throw error;
    });
};
