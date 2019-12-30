---
title: Scraping dev.to with Puppeteer to make a command line application
subtitle:
excerpt: >-
  Let's explore a bit deeper how the Puppeteer library allows us to scrape websites.
date: "2019-05-27"
thumb_img_path: images/scraping.png
content_img_path: images/scraping.png
tags: ["javascript", "webscraping", "puppeteer"]
template: post
---

# Introduction

For my InvoiceMaker application, I used <a href="https://github.com/GoogleChrome/puppeteer">Puppeteer</a> to generate a PDF. I quite enjoyed the simplicity of the tool, and to showcase some of the many things you can do with Puppeteer, I thought I would make a little application.

## What can Puppeteer do?

According to the Github README, here are some of the things Puppeteer can help you with:

<img src="https://thepracticaldev.s3.amazonaws.com/i/jzq910akp878ho6n9a9v.png" />

Puppeteer is a tool that makes it easier to _scrape the web_. This is a headless instance of the Chrome browser ( so the Chrome browser, without the UI). Web scraping means that you consult a website and extract data from it.

## What we'll build

So, we will be building a little command line application. This article will make sure we can do two things for now:

- Given a username, generate a screenshot of that user's personal page.
- Given a username, retrieve the last article that user wrote and generate it as a PDF.

## Setup

So, let's create a folder called _cli-scraping_. Inside it, run _yarn init_ (or _npm init_, but I'll be using yarn here.). Accept the defaults and create a _index.js_ file. Then, run _yarn add puppeteer_. Finally, create two folders inside _cli-scraping_: _screenshots-users_ and _pdfs_. Let's get coding.

## Getting command line arguments

We will use _process.argv_ to get the arguments we provide. It will return an array, with at least two elements. Let's try it:

```javascript
console.log(process.argv);
```

When I run `node index.js`, I get in my console:

```
[ '/usr/local/Cellar/node/11.4.0/bin/node',
  '/Users/Damien/Desktop/javascript/scraping/index.js' ]
```

You will get a different result, but you will get 2 elements. The first one is the runtime used ( here node v11.4.0), the second is the script's path. So, every argument we'll give will start at process.argv[2]. If I run `node index.js blabla`, process.argv[2] will be `blabla`. Ok? Nice and easy. So, now we know how we'll retrieve arguments. Let's move on to puppeteer.

## Generate a screenshot

To generate a screenshot, we would use the following code:

```javascript

(async () => {
	// Launching an instance of a headless Chrome browser
	const browser = await puppeteer.launch()

	// Create a new page
	const page = await browser.newPage()

	// Move to the specified url
	await page.goto('urlToThePage')

	// Take a screenshot and save it at the specified path
	await page.screenshot({ path: 'screenshot.png' })

	// Close the browser
	await browser.close()
}
```

Ok, so what do we need to do?

- Create a function to wrap this functionality.
- Call that function from the command line
- Give the functionality the proper data ( page url, username )

I will use the following convention for my application: the first argument will be the name of the function, the second will be the username. So, the code could be:

```javascript
const puppeteer = require("puppeteer");

const getScreenshot = async username => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://dev.to/${username}`);
  await page.screenshot({
    path: `screenshots-users/${username}.png`,
    fullPage: true
  });
  await browser.close();
};

switch (process.argv[2]) {
  case "getScreen":
    getScreenshot(process.argv[3]);
    break;
  default:
    console.log("Wrong argument!");
}
```

First, we import puppeteer. Then, we create our _getScreenshot_ function that will take care of generating our screenshots. The skeleton of the function has been seen earlier. Notice a few changes:

- _page.goto_ takes the proper dev.to url with the username provided.
- _page.screenshot_ puts the PNG file in the screenshots folder, with the username as the file name. Notice the _fullPage: true_ to get the full page.

Finally, we have a switch statement. I used _getScreen_ as the argument name to generate screenshots.

Great, now I can run `node index.js getScreen damcosset` to get the screenshot of my profile. And I can see the screenshot in the screenshots-users folder called damcosset.png:

_Note: I am cutting the screenshots to save space, but the entire page is available in the screenshot ;)_

<img src="https://thepracticaldev.s3.amazonaws.com/i/s92z743eo8t6zmzfzx3c.png" />

Let's now run `node index.js getScreen ben` and we'll get the following screenshot in the folder called ben.png:

<img src="https://thepracticaldev.s3.amazonaws.com/i/brahspzgnc7tn7w4ihr1.png" />

## Generating a PDF

For this, we have three different steps:

1- Go to the user personal page
2- Click on the last article she wrote to navigate there
3- Retrieve an attribute to make sure our pdf name is unique ( optional I guess )
4- Generate the PDF

Let's create a function called _getPDF_. The code inside would look like this:

```javascript
const getPDF = async username => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://dev.to/${username}`);

  await Promise.all([page.waitForNavigation(), page.click(".single-article")]);
  const dataPath = await page.evaluate(() =>
    document.querySelector(".article").getAttribute("data-path")
  );
  await page.pdf({ path: `pdfs/${dataPath.split("/")[2]}.pdf` });

  await browser.close();
};
```

The first 3 lines are the always the same, initiate, new page, goto... Then, we have a _Promise.all_. We are waiting for two actions here:

- A click on an article card.
- Then, the page where that article lives needs to load

We need to explore the HTML content of the page here. In the dev tools, I can see that each article in the users personal pages have a class called _single-article_. So, this is what we'll target. For that, we'll use the _page.click_ function and give it that selector.

This will target the first element with that selector, and because dev.to presents your newer article first, this is exactly what I was looking for.

Next, when I studied the HTML structure, I saw that each article is contained in a div with the _article_ class. This element has a _data-path_ attribute. By using _page.evaluate_, I can get that node then retrieve this attribute. This will assure that there will be no conflicts when saving our pdfs.

Finally, I'll call _page.pdf_ and give it a path in the options. The data-path I retrieved gives something like `/username/title-article-000` so I just split it to get the last part.

Finally, don't forget to add a case in our switch statement:

```javascript
switch (process.argv[2]) {
  case "getScreen":
    getScreenshot(process.argv[3]);
    break;
  case "getPDF":
    getPDF(process.argv[3]);
    break;
  default:
    console.log("Wrong argument!");
}
```

Done! Now, we can run the following commands:

`node index.js getPDF damcosset`
`node index.js getPDF ben`
`node index.js getPDF jess`

So, this will create an instance of headless Chrome browser, travel to my page, click on the last article I wrote, travel to that page, and create a PDF with that page's content. Same thing for jess, same thing for ben.

So, now I have 3 PDFs in my _pdfs_ folder, called:

```
start-before-you-are-ready-393e.pdf (Mine)

what-advice-would-you-give-someone-looking-to-use-their-keyboard-more-and-their-mouse-less-1lea.pdf (Ben)

what-was-your-win-this-week-3a9k.pdf (Jess)
```

Tadaaaaaaaa!

The code can be found <a href="https://github.com/Tagada85/cli_scraping">here</a>.

# Conclusion

Ok, so this is it for the first part. Puppeteer is such a fun tool to play with, I'll make sure to come back to show you more of the amazing things we can do with it.

Have fun <3
