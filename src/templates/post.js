//import { graphql } from "gatbsy";
import { Disqus } from "gatsby-plugin-disqus";
import _ from "lodash";
import moment from "moment-strftime";
import React from "react";
import { Layout, SubscriptionForm } from "../components/index";
import { getPages, htmlToReact, safePrefix } from "../utils";

export default class Post extends React.Component {
  render() {
    let title = _.get(this.props, "pageContext.frontmatter.title");
    let tags = _.get(this.props, "pageContext.frontmatter.tags");
    const disqusConfig = {
      url: "https://damiencosset.com" + _.get(this.props, "pageContext.url"),
      identifier: title,
      title,
    };

    let pages = getPages(this.props.pageContext.pages, "/posts");
    let postsWithSimilarTagOne = _.orderBy(
      _.filter(pages, (post) => post.frontmatter.tags.includes(tags[0])),
      "frontmatter.date",
      "desc"
    );

    let postsWithSimilarTagTwo = _.orderBy(
      _.filter(pages, (post) => post.frontmatter.tags.includes(tags[1])),
      "frontmatter.date",
      "desc"
    );
    postsWithSimilarTagOne.shift();
    postsWithSimilarTagTwo.shift();

    return (
      <Layout {...this.props}>
        <article className="post post-full">
          <header className="post-header">
            <h1 className="post-title underline">
              {_.get(this.props, "pageContext.frontmatter.title")}
            </h1>
          </header>
          {_.get(this.props, "pageContext.frontmatter.subtitle") && (
            <div className="post-subtitle">
              {htmlToReact(
                _.get(this.props, "pageContext.frontmatter.subtitle")
              )}
            </div>
          )}
          {_.get(this.props, "pageContext.frontmatter.content_img_path") && (
            <div className="post-thumbnail">
              <img
                src={safePrefix(
                  _.get(this.props, "pageContext.frontmatter.content_img_path")
                )}
                alt={_.get(this.props, "pageContext.frontmatter.title")}
              />
            </div>
          )}
          <div className="post-content">
            {htmlToReact(_.get(this.props, "pageContext.html"))}
            <a
              target="_blank"
              href="https://twitter.com/share?ref_src=twsrc%5Etfw"
              class="twitter-share-button"
              data-show-count="true"
            >
              <i className="fab fa-twitter" />
              Share on Twitter
            </a>
            <script
              async
              src="https://platform.twitter.com/widgets.js"
              charset="utf-8"
            ></script>
          </div>
          <footer className="post-meta">
            <time
              className="published"
              dateTime={moment(
                _.get(this.props, "pageContext.frontmatter.date")
              ).strftime("%Y-%m-%d %H:%M")}
            >
              {moment(
                _.get(this.props, "pageContext.frontmatter.date")
              ).strftime("%A, %B %e, %Y")}
            </time>
          </footer>
          <div className="similar-posts-container">
            <h4>You may also like:</h4>
            {postsWithSimilarTagOne.slice(0, 2).map((post) => {
              return (
                <p>
                  <a href={safePrefix(_.get(post, "url"))}>
                    {post.frontmatter.title}
                  </a>
                </p>
              );
            })}
            {postsWithSimilarTagTwo.slice(0, 2).map((post) => {
              return (
                <p>
                  <a href={safePrefix(_.get(post, "url"))}>
                    {post.frontmatter.title}
                  </a>
                </p>
              );
            })}
          </div>
          <SubscriptionForm />

          <Disqus config={disqusConfig} />
        </article>
      </Layout>
    );
  }
}
