---
title: How to add styles to an HTML element on scroll
subtitle: Simple and straightforward!
excerpt: >-
  A quick article about how to use Javascript to add some styles to an HTML element when the user scrolls. It's quite useful to create nice little effects and interactivity
date: "2019-10-20"
thumb_img_path: images/adultlearning.jpeg
content_img_path: images/adultlearning.jpeg
tags: ["javascript", "html", "css"]
template: post
---

## Introduction

This will be a short article about how to add styles to an HTML element when the user scrolls. It's an easy way to add some interactivity to the web page. It's quite common to have CSS changes when the user scroll and there are a million ways you can use that to create cool things.

## What we'll do

Here is what I have on my HTML page:

// first screen

Nothing fancy. A menu and a very long page that is scrollable. A common thing you might see in web is the menu being fixed at the top of the web page when we scroll.

In order to achieve that, we obviously need make the menu fixed at the top, but we also need to add some styles to that menu when the user scrolls. If we don't, we won't have any separation between the webpage content and the menu.

## HTML and CSS

Here is the HTML structure I am working with:

```html
<body>
  <div class="content-container">
    <ul class="menu">
      <li>Home</li>
      <li>Products</li>
      <li>About</li>
      <li>Blog</li>
      <li>Contact</li>
    </ul>
    <div class="my-cool-content">
      <h1>Very long content page</h1>
    </div>
  </div>
</body>
```

And here is my CSS:

```css
body {
  margin: 0;
}
.menu {
  list-style: none;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  width: 100%;
}

.content-container {
  background-color: lightgrey;
  height: 3000px;
}

.my-cool-content {
  padding-top: 100px;
}
```

### Menu most stay on top at all time

To do this, we need to give the list inside the menu a _fixed_ position:

```css
.menu{
    position: fixed;  <--- this!
    width: 100%; <-- need this too!
    height: 50px;
    list-style: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
```

A fixed element is outside of the normal document flow and we don't leave him any more space than it needs. This means that if I only add the position rule, this would happen:

// SECOND SCREEN

Our menu's list doesn't take the full width anymore and the content is one top of the list! That's what we mean when we say the fixed element is _outside_ the normal document flow. The rest of the HTML just acts like it's not even there anymore!

This is why we need to give the list parent a height. In our case, our _.menu_ element has a height of 50 pixels to tell the other HTML elements: that's my space, for me and my children.

And this is also why we need to specify a width of a 100% for our list. By adding these rules, we're back where we started.

Note that the top rule is not mandatory, but I'm putting it for good measure. The rules _top_, _bottom_, _right_, _left_ would be used

### What happens when I scroll?

Well, it's not pretty:

// third screen

I've scrolled a bit, and because my menu share the background of the content, they are just on top of another. Here comes Javascript!

With Javascript, we are able to detect when the user is scrolling. Check this out:

```html
<script>
  window.addEventListener("scroll", function () {
    console.log("SCROOOOOOLL");
  });
</script>
```

I've added a script tag in the <head> of my HTML. What this code does is:

- Listen to scroll events inside the window element. Every time you detect one, runs this anonymous function.

That's convenient! With Javascript, I'm also able to know how pixels we have scrolled!

```html
<script>
  window.addEventListener("scroll", function () {
    // Prints the number of pixels we scrolled vertically
    let numberOfPixelsScrolled = window.scrollY;
  });
</script>
```

So when this number gets higher than 0, I know the user has scrolled. So, now I know when I need to change the styles of my menu:

```html
<script>
  window.addEventListener("scroll", function () {
    // Prints the number of pixels we scrolled vertically
    let numberOfPixelsScrolled = window.scrollY;
    if (numberOfPixelsScrolled > 20) {
    }
  });
</script>
```
