---
title: Implement Code Splitting in React
subtitle: One way to improve performance in React
excerpt: >-
  In this article, we will get started with code splitting in React. By using dynamic imports, React.lazy and Suspense, you can dramatically improve the performance of your application.
date: "2020-05-21"
thumb_img_path: images/code-splitting-bundles.png
content_img_path: images/code-splitting-bundles.png
tags: ["react", "javascript", "performance"]
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

This can cause performance issues. To avoid this, we can implement code splitting. In this article, we will use code splitting based on our routes.

## import()

Code splitting implies that we will have our code into smaller pieces. Yet, we won't need to change the way our code is written. We will change the way we import our components. We need to tell the tool in charge of bundling our code when to split our code.

If you use create-react-app, which uses Webpack, you will start by using the dynamic _import_ function. The syntax goes as follow:

```javascript
import("./myModule.js").then((myModule) => {
  myModule.init();
});
```

The syntax uses a promise to wait for the Javascript file to be loaded before using the content of the file.

## React.lazy

React implements this sort of logic with _React.lazy_. It allows you to display a component just like any other component, the difference being that it will be imported dynamically.

```javascript
import React, { lazy } from "react";

const DynamicallyImported = lazy(() => import("./DynamicallyImported.js"));
```

_React.lazy_ takes a function that returns a dynamic import. This component will not be imported with the rest of the application, like you would without any code-splitting implemented. React will import this component only when it is rendered for the first time.

Note that the component that you dynamically import needs to be a default export, and of course, it needs to export a React component.

So, if we implement code-splitting based on our routes, this means that if a user checks our application and never travels to a particular route, that route won't be imported at all. A huge benefit for your user, as you will only force her browser to import exactly what he needs, and nothing more.

## Suspense

A component imported with _React.lazy_ must be used inside a **Suspense** component. A _Suspense_ component provides a fallback content. This content acts an indication that our lazy component is loading.

```javascript
import React, { lazy, Suspense } from "react";

const DynamicallyImported = lazy(() => import("./DynamicallyImported.js"));

const CoolComponent = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicallyImported />
      </Suspense>
    </div>
  );
};
```

Such dynamically imported components don't need to be directly surrounded by a Suspense component. One Suspense component can also _handle_ several dynamically imported components:

```javascript
import React, { lazy, Suspense } from "react";

const DynamicallyImported = lazy(() => import("./DynamicallyImported.js"));
const AnotherDynamicallyImported = lazy(() =>
  import("./AnotherDynamicallyImported.js")
);

const CoolComponent = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <header>
          <h1>Hello there</h1>
        </header>
        <div>Something else</div>
        <DynamicallyImported />
        <p>Divider</p>
        <AnotherDynamicallyImported />
      </Suspense>
    </div>
  );
};
```

## Code splitting based on our routes

Routes are a good place to start implementing code splitting. Going from one page to another, users are expecting the page to load as a block and to wait a bit for the page to be rendered. It makes it a good place to start while being sure to not alter the user experience.

In this example, I'll use the popular _react-router-dom_ package for the routing of my React application. Of course, it can be used with any library you prefer.

Before code splitting, your _Router_ component could look something like this:

```javascript
import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import Header from "./Header";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Products from "./pages/Products";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export default () => {
  return (
    <Router history={history}>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/products" component={Products} />
        <Route path="/blog" component={Blog} />
        <Route path="/contact" component={Contact} />
      </Switch>
    </Router>
  );
};
```

If you've used _react-router-dom_ before, this will be familiar. If not, this is how routing is implemented using this library.

With this code, whenever a user travels to one page, the entire application code will be loaded. Because we have only one bundle, there can't be any other way! This can be expensive.

We'll need to do three things to make code splitting work and having several bundles:

1. Import _React.lazy_ and _Suspense_.
2. Modify how we import our components (Home, About, Products, Blog and Contact) to make it dynamic using _React.lazy_ and _import()_
3. Use the _Suspense_ component to provide a fallback in our return function.

4. You would change the first line to:

`import React, {lazy, Suspense} from "react";`

Done!

2. Import dynamically our components. Change line 4 to 8 like so:

```javascript
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
```

Awesome!

3. Finally, surround the components dynamically imported with the _Suspense_ component:

```javascript
export default () => {
  return (
    <Router history={history}>
      <Header />
      <Suspense fallback={<div>Loading page...</div>} />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/products" component={Products} />
        <Route path="/blog" component={Blog} />
        <Route path="/contact" component={Contact} />
      </Switch>
    </Router>
  );
};
```

Fantastic! You have successfully implemented code splitting in your React application. Your users are happy with the newfound speed of their application. Time to celebrate!

I am using _create-react-app_, which uses Webpack. If I run `npm run build` after implementing code splitting, I can see that Webpack is creating different bundles now.

![Our new bundles](/images/code-splitting-bundles.png)

More files, but smaller files. And that's the point :wink:

Hope it was clear enough. If not, as always, don't hesitate to ask questions in the comments.

Have fun :heart:
