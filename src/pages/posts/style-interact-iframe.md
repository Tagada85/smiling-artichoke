---
title: Iframes and communicating between two applications
subtitle: Because IFrames are awesome!
excerpt: >-
  Stripe uses them, Yousign uses them, a lot of companies use Iframes to give developers access to their functionalities. Let's see how to create, style and interact with them.
date: "2020-26-04"
thumb_img_path: images/iframes.png
content_img_path: images/iframes.png
tags: ["html", "css", "javascript"]
template: post
---

## Introduction

Iframes are awesome! They allow you to embed another HTML page inside the current one. The embedded page carries its own browsing context with it. So, if a HTML page creates an iframe with a remote application as its source, you'll have the first application _hosting_ that remote application with all its functionalities. It's a technique that's used by a lot of companies to allow developers to use their service easily ( Stripe and Yousign come to mind)

## The problem

The problem is this: I want an iframe to be added to the HTML DOM when the user interacts with an element, in my case, a click on a button. I want that iframe to take up the entire page. From the user perspective, it would look like you actually travelled to a new page, or that a full width modal just opened.

## Setting up

So, we need an 2 applications. One of them, when we click on a button, will open an iframe. Inside that iframe will be embedded the second application. I'll use React for both my applications, but the concepts work with any framework.

Let's create our two React application. I'll do that with _create-react-app_. So, I'll run `create-react-app main-app` and `create-react-app iframe-app`.

Go the to the _App.js_ file inside the _main-app_ React application and add a button to open an iframe:

```js
import React from "react";
import "./App.css";

function App() {
  let openFrame = () => {
    let iframe = document.createElement("iframe");
    iframe.src = `http://localhost:3001`;
    iframe.frameBorder = "0";
    iframe.id = "iframe";
    iframe.style.position = "absolute";
    iframe.style.zIndex = "999";
    iframe.style.height = "100%";
    iframe.style.width = "100%";
    iframe.style.top = "0";
    iframe.style.backgroundColor = "white";
    iframe.style.border = "none";
    document.body.prepend(iframe);
    document.body.style.overflow = "hidden";
  };
  return (
    <div className="App">
      <header className="App-header">
        <p>This app opens an iframe and runs on port 3000</p>
        <button onClick={() => openFrame()}>Open IFRAME</button>
      </header>
    </div>
  );
}

export default App;
```

So, this application runs on port 3000 and open an iframe when the user clicks on the button. That will create an iframe with the _src_ attribute _http://localhost:3001_ where our second application will run.

Notice that I wrote that in vanilla javascript to show you how it could be used anywhere.

Then, we are adding some styles to make our iframe take up the whole page, just like if it was a different page. Notice that we also set _overflow: hidden_ on the body, to not be able to scroll the main page.

Now, go to the second application in _iframe-app_ and change the _App.js_ file:

```js
import React from "react";
import "./App.css";

function App() {
  let closeIframe = () => {};

  return (
    <div className="App">
      <button onClick={() => closeIframe()}>Close Iframe </button>
      <p>This app runs on port 3001 and his embedded inside the iframe</p>
    </div>
  );
}

export default App;
```

This application will run on port 3001. When we click on the button, we will close the iframe.

Make sure your main application is running on port 3000, and your iframe application is running on port 3001. (by running `PORT=3001 yarn start`)

Ok, so if you now go to _http://localhost:3000_ in your browser, and click on the _Open IFRAME_ button. You will see the second React application take up the whole page inside its iframe. We're still on the port 3000 page. From the user, it doesn't look like an iframe at all though!

![Before opening the iframe](https://dev-to-uploads.s3.amazonaws.com/i/qndnl6n2eo5e2jlwa2zf.png)

![After opening the iframe](https://dev-to-uploads.s3.amazonaws.com/i/fmteuimq1lcf7axvo5sb.png)

Awesome, now, our first app correctly opens an iframe. The functionality works as expected.

## Closing the iframe

Now, what we need to do next is allow the user to close the iframe. Since we want the user to experience our iframe opening as a modal or a new page, we need to give him a way to close/go back.

It does seem easy. Add a close button, click on it, then make the iframe disappear. Well, it's not that simple. The React application is on a different domain from the HTML page. The functionality to close the iframe will start on the React application. But we will try to manipulate the DOM of the first application. For security reasons, we can't manipulate the DOM from another domain (thankfully...). There are two ways we can solve this issue:

- Make the React applications communicate with one another.
- Create a header that would still be part of the first React application.

The second solution is the simplest one. Just style your DOM to show a button above the iframe content (maybe using some z-index styles), or show a header above the iframe (so the iframe would not take the whole height of the page, leaving some space for that header).

The second solution, for our purposes, doesn't suit me. So, to make both pages communicate with one another, we will use _window.postMessage()_

The _postMessage_ function allows to send messages between cross-origin domains. When we would want to close our iframe, we will use this function to tell the main HTML page that we need to make the iframe disappear.

### Adding the closing functionality

![MDN PostMessage definition](https://dev-to-uploads.s3.amazonaws.com/i/36vfmsyfir5dkrfy7btq.png)

We need to call _postMessage_ on the _targetWindow_. The target window, in our case, is the window of the HTML page. We can get that window's reference with _window.parent_. Note that in the main HTML page, which does not have a parent, _window.parent_ is the main window.

The first argument that the postMessage function takes is a message. You could send an object if you wish, or a string. Here, we don't need to send anything special, so I'll just call it _close-iframe_. The second argument it takes is the url of the target window. That would be _http://localhost:3000_ in our case. But, we want to make that dynamic:

```js
let closeIframe = () => {
  let url =
    window.location != window.parent.location
      ? document.referrer
      : document.location.href;
  window.parent.postMessage("close-iframe", url);
};
```

Notice how we retrieve the parent's url. If the window's location is different from the parent's location, we'll get it through _document.referrer_, otherwise, for IE browsers, we'll get it with document.location.href.

### Get the message in the main application

Now that the iframe application sends a message, we need the main application to catch it. To do that, we can use the _addEventListener_ method. We will add this event listener inside a _useEffect_ hook.

```js
// Inside your App.js file
useEffect(() => {
  window.addEventListener("message", function (event) {
    let frameToRemove = document.getElementById("iframe");
    if (frameToRemove) {
      frameToRemove.parentNode.removeChild(frameToRemove);
      document.body.style.overflow = "inherit";
    }
  });
});
```

The _postMessage_ function sends a _message_ event. Inside this _addEventListener_, we retrieve our iframe element and we remove it from the DOM. This is how it will looks like in your browser.

`youtube: https://youtu.be/EA_L9Pl3GaU`

Congratulations! You can now make two applications communicate with one another through an iframe. Now, remember that the postMessage can work both ways. We made it from from child to parent, but parent to child is also valid!

Have fun :heart:
