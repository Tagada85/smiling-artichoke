---
title: Implement Code Splitting in React
subtitle: One way to improve performance in React
excerpt: >-
date: "2019-12-15"
thumb_img_path: images/react-native.png
content_img_path: images/react-native.png
tags: ["react", "javascript"]
template: post
---

## Understanding React bundling

By using tools such as _Webpack_ or _Browserify_, React applications are bundled. Bundled means that the files inside your application are imported and merged into one file. This way, when you import your application in a webpage, you only need to import one file.

Assuming you have two files:

```javascript
// greeting.js
export const greeting = () => {
  console.log("Hello my friend");
};
```

```javascript
// index.js
import { greeting } from "./greeting.js";

greeting();
```

A bundle would transform these files into:

```javascript
const greeting = () => {
  console.log("Hello my friend");
};

greeting();
```

Of course, this is oversimplified, because there are a lot of steps in the bundling process, but you get the idea.

## Bundling issue

Bundling is great when your application is small, but as your application grows, the bundle grows as well. That means, if a user loads the home page of your web app, she will still have to import the bundle of your ENTIRE application...

This can cause performance issues. To avoid this,
