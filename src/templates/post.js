import React from "react";
import _ from "lodash";
import moment from "moment-strftime";

import { Layout } from "../components/index";
import { htmlToReact, safePrefix } from "../utils";

export default class Post extends React.Component {
  render() {
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
            <i className="fab fa-twitter" />
            <a
              target="_blank"
              href="https://twitter.com/share?ref_src=twsrc%5Etfw"
              class="twitter-share-button"
              data-show-count="true"
            >
              {" "}
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
        </article>
      </Layout>
    );
  }
}
