---
title: Accessible hiding and hidden-aria
subtitle: Because accessibility should not be an after thought
excerpt: >-
  As developers, accessibility should not be an after thought. We should write our code with accessibility in mind from the start. In this article, we'll talk about accessible hiding and the hidden-aria attribute.
date: "2020-06-18"
thumb_img_path: images/a11y.jpeg
content_img_path: images/a11y.jpeg
tags: ["accessibility", "a11y", "html"]
template: post
---

## Accessibility issues

As developers, accessibility should not be an after thought. We should write our code while having in mind the disabled who will use our product. I'm ashamed to say I have been guilty of not thinking about accessibility for quite some time. I wrote code thinking only about people like me.

In this article, we'll talk about two things: _Accessible hiding_ and _hidden-aria_.

### Accessible hiding

Sometimes, you do not want to show some of you HTML elements. In that case, a good old `display: none;` or `visibility: hidden;` or even the HTML5 `hidden` attribute does the job just fine.

All valid ways to hide an HTML element, and its children.

```html
<p style="display: none;">Hide me!</p>

<p style="visiblity: hidden;">Hide me!</p>

<p hidden>Hide me!</p>
```

One issue with that approach is that the element will be invisible from the screen but also from screen readers. There are cases where you want to hide an element and still being accessible be screen readers. That's accessible hiding.

To achieve that, you would usually add a CSS class to the element you want make accessible to screen readers. Most frameworks, like [Bootstrap](https://getbootstrap.com/docs/4.0/utilities/screenreaders/) for example, gives you a class called _sr-only_ for this purpose. It goes like this:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap; /* added line */
  border: 0;
}
```

The code above is a good place to start with accessible hiding, if you don't have a class for that already :wink:

### Form labels

Let's imagine that you have an input in your HTML.

```html
<form>
  <input id="email" name="email type="email" placeholder="Email please" />
  <button type="submit">Submit</button>
</form>
```

Here, we don't have a _label_ tag. It is good practice to always provide a _label_ tag in terms of accessibility. For more information, you can read [this tutorial about labeling controls in forms from w3.org](https://www.w3.org/WAI/tutorials/forms/labels/).

If you don't want to have a label in your design in that case, you still should have a label available. So, we just add one with the _sr-only_ class.

```html
<label for="email" class="sr-only">Email</label>
<input id="email" name="email" type="email" placeholder="Email please" />
<button type="submit">Submit</button>
```

By adding a _label_ tag and giving it our _sr-only_ class, we are sure that our design remains unchanged and screen readers will still be able to make our design accessible.

### Clarify a link label

For a second example, let's imagine we have this HTML:

```html
<a href="...">Click here <span class="sr-only">for a free e-book</span></a>
```

This link would only display _Click here_ in the browser, which can be fine in the context. But for accessibility purposes, it might be better to have a more explicit description. Here, screen readers would read _Click here for a free e-book_

_Note_: You could have achieve the save thing by using the **arial-label** attribute:

```html
<a href="..." aria-label="Click here for a free e-book">Click here</a>
```

There are probably thousands of ways to implement accessible hiding in order to improve the accessibility of your product.

## aria-hidden attribute

This attribute will hide an element, or group of elements to screen readers. However, it doesn't affect how the elements are displayed in the browser.

To hide an element (and its children!) from screen readers, you just add the **aria-hidden="true"** attribute.

Example: Below is a screenshot of a website. There a lot of informations. There are images placed everywhere. It looks nice, but it won't give any useful information to someone visiting the website with a screen reader. It's better to hide them.

![Screenshot of a website with unnecessary images for screen readers](./images/screen-a11y.png)

```html
<img src="..." alt="Pink pattern" aria-hidden="true" />

<img src="..." alt="Green pattern" aria-hidden="true" />

<div class="images-container" aria-hidden="true">
  <img src="..." alt="Blue pattern" />
  <img src="..." alt="Red pattern" />
</div>
```

We can either use _aria-hidden_ on the images individually, or, if the HTML markup allows it, put the _aria-hidden_ attribute on the parent.

There you go!

Have fun :heart:
