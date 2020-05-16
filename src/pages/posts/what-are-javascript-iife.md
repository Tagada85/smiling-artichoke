---
title: What are Javascript's IIFE?
subtitle: Exploring another famous Javascript acronym
excerpt: >-
  In this article, we will understand what is an IIFE in Javascript and why you would want to use them.
date: "2020-05-17"
thumb_img_path: https://dev-to-uploads.s3.amazonaws.com/i/hit6r2erpuls3pwaolfx.jpg
content_img_path: https://dev-to-uploads.s3.amazonaws.com/i/hit6r2erpuls3pwaolfx.jpg
tags: ["javascript", "iife"]
template: post
---

# Another acronym?

We loooove acronym don't we? KISS, DRY, TDD, LOL... So many concepts behind them, so much to remember. So, what's an IIFE in Javascript?

IIFE stands for _Immediately Invoked Function Expression_. You create a anonymous function and immediately call it, you know, with the parenthesis.

_Below is a beautiful function expression, dated to about 4000BC. Author: Anonymous_
![A anonymous function](https://dev-to-uploads.s3.amazonaws.com/i/1d2jjab4chfcnkmu77dh.jpg)

Here, we store a anonymous function in a variable. Later, we _call_ that function by adding those parenthesis.

```javascript
const myFunction = function () {
  console.log("A function has no name.");
};

//Calling the function
myFunction();
// A function has no name
```

An IIFE combines the anonymous function and the call step.

```javascript
(function () {
  console.log("This is IIFE.");
})();
```

What is happening here? 3 things:

- We have an anonymous function. That includes the _function_ keyword, the parenthesis, the curly braces and the console.log statement. This is a **function declaration**
- That **function declaration** is surrounded by parenthesis. This is what turns a **function declaration** into a **function expression**. Who knew two little parenthesis could have so much power?
- Finally, the final parenthesis are calling that **function expression**, running the body of that function.

Congratulations, you just understood what an IIFE is made of! Which now begs the question, why the hell would I want to use one of those things anyway?

# The why behind IIFE

The main reason why you would want to use an IIFE is to not _pollute_ the global scope, and keep the content of your choosing inside your function private.

Because of the surrounding parenthesis, the IIFE has its own scope, which can not be accessed from the outside. Whatever you return from an IIFE will be the only things you can access from outside that IIFE.

```javascript
(function () {
  let sayMyName = "Damien";
})();

console.log(iife.sayMyName); // sayMyName is not defined
```

If I want to make those variables accessible, I need to return it from that IIFE:

```javascript
const iife = (function () {
  let sayMyName = "Damien";
  let privateVariable = "No trespassing!";

  let greeting = function () {
    console.log("Hello from the IIFE");
  };

  return {
    sayMyName,
    greeting,
  };
})();

console.log(iife.sayMyName); // Damien
iife.greeting(); // Hello from the IIFE
console.log(iife.privateVariable); // privateVariable is not defined
```

## The plugins way

IIFE are quite popular when writing Javascript plugins. That allow the users to use the functionality several plugins without having their global scope invaded by thousands of variables. IIFEs just populate the global scope with what they need to work, usually just one variable.

You can find an example in [this article](https://damiencosset.com/posts/what-are-javascript-iife/), where I wrote a simple Calendar plugin.

Basically, a plugin could look something like this. It's a bit more complicated, but it's still an IIFE.

```javascript
(function (globalScope, whatWePopulateTheGlobalScopeWith) {
  globalScope.myCoolPlugin = whatWePopulateTheGlobalScopeWith();
})(this, function () {
  let launchThePlugin = () => {
    document.title = "PLUGIN LAUNCHED";
  };
  return {
    launchThePlugin,
  };
});
```

A bit more technical, let's break it down.

Notice that we still have the IIFE skeleton. A function declaration, surrounded by parenthesis, and immediately called. What might be throwing you off is that when we call the function expression, we give it parameters. The first parameter is _this_, which is the global scope.

In my case, the global scope in the _window_ object, because my plugin runs in a browser. But it could be anything. The second parameter is a function.

In the main body of the IIFE, we populate the globalScope with whatever that function provided in the second parameter will return. Here, I'm returning a function called _launchThePlugin_. Which means, once this IIFE is executed, _window.myCoolPlugin_ will equal the object that function returned.

The main body of the IIFE will populate the global scope, the other function will manage the plugin's functionalities. So, when I import my Javascript file in my HTML, I can run _myCoolPlugin.launchThePlugin()_ (or _window.myCoolPlugin.launchThePlugin()_). This function will update the document's title.

I can add a whole bunch of things in that function, but as long as I **do not return** it, it will **not be accessible** from outside this function.

And that is the power, usefulness, awesomeness of IIFEs.

Hope it was clear! If not, let me know! :heart:
