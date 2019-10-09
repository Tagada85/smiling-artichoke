---
title: Generate a PDF from HTML with Puppeteer
subtitle: I spent too much time solving this...
excerpt: >-
  After long hours of trial and error, I finally managed to generate a proper PDF file from HTML using the Puppeteer library. Maybe you'll find some things to help you.
date: "2019-04-19"
thumb_img_path: images/pdfjs.png
content_img_path: images/pdfjs.png
tags: ["pdf", "puppeteer", "javascript", "nodejs"]
template: post
---

# Introduction

This is one of those frustrations post where I just spent hours working on something and I _finally_ managed to have a working solution. I learned quite a bit but I feel like it should not have taken me that much time...

Anyway, the goal was to generate a PDF from HTML, then send it back to the browser so the user could download it. I tried a lot of different things, and it's more than likely my solution is not the most elegant, or fast, but fuck it, it works.

I consider this post to be a place where I can store this solution, juste in case I forget it in the future. I'll know where to look. Let's jump into the actual solution.

# The solution!

## Front-end

Let's start with the front-end.

```javascript
const downloadPDF = () => {
  fetch("/api/invoices/create-pdf", {
    data: {
      invoiceDetails,
      invoiceSettings,
      itemsDetails,
      organisationInfos,
      otherDetails,
      clientDetails
    },
    method: "POST"
  }).then(res => {
    return res
      .arrayBuffer()
      .then(res => {
        const blob = new Blob([res], { type: "application/pdf" });
        saveAs(blob, "invoice.pdf");
      })
      .catch(e => alert(e));
  });
};
```

This is the function that does everything. We are generating an invoice in my case.

1. A fetch with the POST method. This is the part where we generate our PDF with the proper data and generate our PDF on the server. (server code will follow)

2. The response we get needs to be converted into an arraybuffer.

3. We create a Blob ( Binary Large Objects ) with the new Blob() constructor. The Blob takes a iterable as the first argument. Notice how our response turned arraybuffer is surrounded by square braquets( _[res]_ ). To create a blob that can be read as a PDF, the data needs to be an iterable into a binary form ( I think...). Also, notice the type _application/pdf_.

4. Finally, I'm using the saveAs function from the _file-saver_ package to create the file on the front end!

## Back-end

Here is the back-end things. There is a whole express application and everything. I juste show you the controller where the two methods reside for this PDF problem.

```javascript
module.exports = {
  createPDF: async function(req, res, next) {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../invoices/templates/basic-template.html"),
      "utf-8"
    );
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(content);
    const buffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        left: "0px",
        top: "0px",
        right: "0px",
        bottom: "0px"
      }
    });
    await browser.close();
    res.end(buffer);
  }
};
```

1. I am using _puppeteer_ to create a PDF from the HTML content. The HTML content is read from an HTML file I simply fetch with _readFileSync_

2. We store the buffer data returned by _page.pdf()_ and we return it to the front-end. This is the response converted to an arraybuffer later.

# Done

Well, looking at the code, it really looks easier now that it actually did when I tried to solve this problem. It took me close to 10 hours to find a proper answer. 10 FREAKING HOURS!!!!

Note to self: if you get frustrated, walk away from the computer, get some fresh air, and come back later...

Happy Coding <3
