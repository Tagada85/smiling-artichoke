import React from "react";
import { Helmet } from "react-helmet";
import _ from "lodash";

import { safePrefix } from "../utils";
import Header from "./Header";
import Footer from "./Footer";

export default class Body extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>
            {_.get(this.props, "pageContext.frontmatter.title")} -{" "}
            {_.get(this.props, "pageContext.site.data.author.name")}
          </title>
          <meta
            name="google-site-verification"
            content="68e2nWiKHyRcMIJaa-fisR0T8dXzqYlIng7X1W_WCp8"
          />
          <script
            data-ad-client="ca-pub-1312670291761945"
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          ></script>
          <meta
            name="twitter:image:src"
            content={`https://damiencosset.com/${_.get(
              this.props,
              "pageContext.frontmatter.thumb_img_path"
            )}`}
          />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@DamCosset" />
          <meta
            name="twitter:title"
            content={`${_.get(this.props, "pageContext.frontmatter.title")}`}
          />
          <meta
            name="twitter:description"
            content={
              `${_.get(this.props, "pageContext.frontmatter.subtitle")}` || ""
            }
          />
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initialScale=1.0"
          />
          <meta
            content={this.props.pageContext.frontmatter.excerpt}
            name="description"
          />
          <meta name="google" content="notranslate" />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i"
            rel="stylesheet"
          />
          <link rel="stylesheet" href={safePrefix("assets/css/main.css")} />
          {_.get(this.props, "pageContext.frontmatter.template") === "post" &&
            _.get(this.props, "pageContext.frontmatter.canonical_url") && (
              <link
                rel="canonical"
                href={_.get(
                  this.props,
                  "pageContext.frontmatter.canonical_url"
                )}
              />
            )}
        </Helmet>
        <div
          id="page"
          className={
            "site style-" +
            _.get(this.props, "pageContext.site.siteMetadata.layout_style") +
            " palette-" +
            _.get(this.props, "pageContext.site.siteMetadata.palette")
          }
        >
          <Header {...this.props} />
          <div id="content" className="site-content">
            <div className="inner">
              <main id="main" className="site-main">
                {this.props.children}
              </main>
              <Footer {...this.props} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
