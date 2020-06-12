module.exports = {
  pathPrefix: "/",
  siteMetadata: require("./site-metadata.json"),
  plugins: [
    {
      resolve: `gatsby-plugin-web-monetization`,
      options: {
        paymentPointer: `$ilp.uphold.com/QdybDnRqE3EJ`,
      },
    },
    {
      resolve: "gatsby-plugin-mailchimp",
      options: {
        endpoint:
          "https://gmail.us20.list-manage.com/subscribe/post?u=ff6b9c607da69eebbf4349f76&amp;id=1a659290ce", // add your MC list endpoint here; see instructions below
      },
    },
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `damcosset-blog`,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sharp`,
    `gatsby-source-data`,
    `gatsby-plugin-robots-txt`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-149533256-1",
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: `gatsby-plugin-stackbit-static-sass`,
      options: {
        inputFile: `${__dirname}/src/sass/main.scss`,
        outputFile: `${__dirname}/public/assets/css/main.css`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-embed-video",
            options: {
              width: 800,
              ratio: 1.77, // Optional: Defaults to 16/9 = 1.77
              height: 400, // Optional: Overrides optional.ratio
              related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
              noIframeBorder: true, //Optional: Disable insertion of <style> border: 0
              // urlOverrides: [
              //   {
              //     id: "youtube",
              //     embedURL: videoId =>
              //       `https://www.youtube-nocookie.com/embed/${videoId}`
              //   }
              // ] //Optional: Override URL of a service provider, e.g to enable youtube-nocookie support
            },
          },
          "gatsby-remark-emoji",
          //`gatsby-remark-social-cards`,
          // {
          //   resolve: `gatsby-remark-prismjs`,
          //   options: {
          //     // Class prefix for <pre> tags containing syntax highlighting;
          //     // defaults to 'language-' (eg <pre class="language-js">).
          //     // If your site loads Prism into the browser at runtime,
          //     // (eg for use with libraries like react-live),
          //     // you may use this to prevent Prism from re-processing syntax.
          //     // This is an uncommon use-case though;
          //     // If you're unsure, it's best to use the default value.
          //     classPrefix: "language-",
          //     // This is used to allow setting a language for inline code
          //     // (i.e. single backticks) by creating a separator.
          //     // This separator is a string and will do no white-space
          //     // stripping.
          //     // A suggested value for English speakers is the non-ascii
          //     // character '›'.
          //     inlineCodeMarker: null,
          //     // This lets you set up language aliases.  For example,
          //     // setting this to '{ sh: "bash" }' will let you use
          //     // the language "sh" which will highlight using the
          //     // bash highlighter.
          //     aliases: {},
          //     // This toggles the display of line numbers globally alongside the code.
          //     // To use it, add the following line in src/layouts/index.js
          //     // right after importing the prism color scheme:
          //     //  `require("prismjs/plugins/line-numbers/prism-line-numbers.css");`
          //     // Defaults to false.
          //     // If you wish to only show line numbers on certain code blocks,
          //     // leave false and use the {numberLines: true} syntax below
          //     showLineNumbers: false,
          //     // If setting this to true, the parser won't handle and highlight inline
          //     // code used in markdown i.e. single backtick code like `this`.
          //     noInlineHighlight: false,
          //     // This adds a new language definition to Prism or extend an already
          //     // existing language definition. More details on this option can be
          //     // found under the header "Add new language definition or extend an
          //     // existing language" below.
          //     // Customize the prompt used in shell output
          //     // Values below are default
          //     prompt: {
          //       user: "root",
          //       host: "localhost",
          //       global: false,
          //     },
          //   },
          // },
          // {
          //   resolve: `gatsby-transformer-remark`,
          //   options: {
          //     plugins: [
          //       {
          //         resolve: `gatsby-remark-highlight-code`,
          //         options: {
          //           terminal: 'ubuntu'
          //         }
          //       },
          //     ],
          //   },
          // },
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 590,
            },
          },
          `gatsby-remark-component`,
        ],
      },
    },
    {
      resolve: `gatsby-remark-page-creator`,
      options: {},
    },
    {
      resolve: `@stackbit/gatsby-plugin-menus`,
      options: {
        sourceUrlPath: `fields.url`,
        pageContextProperty: `menus`,
        menus: require("./src/data/menus.json"),
      },
    },
  ],
};
