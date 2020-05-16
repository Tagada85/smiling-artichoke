import React from "react";
import _ from "lodash";

import { Layout, SubscriptionForm } from "../components/index";
import { htmlToReact, safePrefix } from "../utils";

export default class Subscribe extends React.Component {
  render() {
    return (
      <Layout {...this.props}>
        <article className="post page post-full">
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
          {_.get(this.props, "pageContext.frontmatter.img_path") && (
            <div className="post-thumbnail">
              <img
                src={safePrefix(
                  _.get(this.props, "pageContext.frontmatter.img_path")
                )}
                alt={_.get(this.props, "pageContext.frontmatter.title")}
              />
            </div>
          )}
          <div className="post-content">
            <SubscriptionForm />
          </div>
        </article>
      </Layout>
    );
  }
}
