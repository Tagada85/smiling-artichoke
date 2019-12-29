---
title: How to use the state hook in React
excerpt: >-
  Hooks have changed the way we use React. Classes components are no longer mandatory when we want to use state. Let's see how to use the state hook.
date: "2019-12-28"
thumb_img_path: images/react.png
content_img_path: images/react.png
tags: ["react", "hooks", "javascript", "state"]
template: post
---

## Introduction

Hooks have been introduced in React 16.8. This feature completely changed the way we write our components.
As you may know, before Hooks, you couldn't use state in functional components. Whenever you needed to add state to a functional component, you needed to re-write that component as a class... Annoying. The state Hook finally solves that issue.

## How to use it

The state hook is used as follow:

```js
import React, {useState} from 'react';

const CreateDebate = () => {
    // We declare a state variable, called debateName
    const [debateName, setDebateName] = useState("");

    return (
        <div>
            <p>Enter a debate name:</p>
            <input type="text"
            value={debateName}
            onChange={e => setDebateName(e.target.value)}>
        </div>
    )
}
```

We have here a very simple piece of code. We create a functional component called _CreateDebate_. That component renders a _div_ element. Inside that element, we find a paragraph with an input. We use the Hook state, with _useState_, to add state to this component. We'll go in detail on how it works, but for now, let's compare that with the same functionality with a class component.

```js
import React from "react";

export default class CreateDebateClass extends React.Component {
  constructor() {
    this.state = {
      debateName: ""
    };
  }

  render() {
    return (
      <div>
        <p>Enter a debate name:</p>
        <input
          type="text"
          value={this.state.debateName}
          onChange={e => this.setState({ debateName: e.target.value })}
        />
      </div>
    );
  }
}
```

##### Function components

React Hooks do not work with classes. They only work with functions. As a reminder, function components can be written in different ways:

```js
function MyFunctionComponent() {
  //Hooks go here
  return <div />;
}
```

```js
const MyFunctionComponent = () => {
  //Hooks go here
  return <div />;
};
```

The React team recommends the term _Function components_ to talk about these functions. Before Hooks, you may know them as _Stateless components_ or _Functional components_.

#### A hook in detail

What is a Hook exactly? A Hook is a special function. It allows you to use certain React features. Our first example details the state Hook. When using that hook, we can use the state feature you are used to see in class components.

To use that particular hook, you first need to import it.

```js
import React, { useState } from "react";

const StatefulFunction = () => {
  // Your code...
};
```

Before, when you had to use state inside a component, that component _had to be a class_. Now, we can simply import the _useState_ function for that!

For those who don't know, or remember, _state_ is a React feature. It allows you to keep variables values between function calls. Usually, when a function is done with its job, the variables _disappear_. Which would cause some problem every time we need to update our interface and re-render our components. With a state, we can keep and update variables over time without losing our _progress_.

```js
const Example = () => {
  const [firstName, setFirstName] = useState("Damien");
  return <div />;
};
```

The _useState_ function declares a new state variable. The function is a new way to use _this.state_ you found in classes. As you can see above, _useState_ takes one argument. This argument represent the initial state. In a class, that would be done in the constructor. In a class however, that initial state needs to be an object, even if you only have one string or integer in your state.

```js
class Example extends React.Component {
  constructor() {
    this.state = {
      firstName: "Damien"
    };
  }

  render() {
    //...
  }
}
```

With _useState_, that can be anything you want. Here, I want my initial state to be a string.

###### What does it return? What's up with that syntax?

```js
const [firstName, setFirstName] = useState("Damien");
```

The _useState_ function returns two values. The first value is the current state, the second is the function that updates that state. In our case, _firstName_ is the current state, and _setFirstName_ is a function that will allow me to modify the state value.

The syntax might seem a bit odd if you are not used to it. This is what we call _array destructuring_, a cool little syntax feature we got from Javascript ES6.
This syntax allows us to assign the first item in the array to a variable, here called _firstName_, and the second item of the array is assigned to a variable we called _setFirstName_. Note that those names are completely arbitrary and not part of the React library. Choose whatever variables feel right for your code.

The array destructuring syntax used for useState is the same as the following code:

```js
let firstNameVariables = useState("Damien"); // This is an array with two values
let firstName = firstNameVariables[0]; // First item
let setFirstName = firstNameVariables[1]; // Second item
```

This way of accessing the values is a bit verbose and confusing. Therefore, the array destructuring feature is a nice way to write the _useState_ hook.

##### Read state

In a class component, you would read from `this.state.debateName`:

```jsx
<p>The debate name is {this.state.debateName}.</p>
```

With the state hook, we can now simply use `debateName`:

```jsx
<p>The debate name is {debateName}.</p>
```

Remember: This variable name is the one you give as the first item the _useState_ function returns.

##### Update state

To update state in a class component, you would use _setState_:

```jsx
<input
  value={debateName}
  onChange={e => this.setState({ debateName: e.target.value })}
/>
```

With a state hook, you will use the function provided by _useState_, the second item it returns:

```jsx
<input value={debateName} onChange={e => setDebateName(e.target.value)} />
```

In my example, I've called this function `setDebateName`. Remember that this name is not part of the React API. I've chosen the name of this function, so make them as clear as possible. Notice that we also don't need `this`, because we already declared `debateName` and `setDebateName`.

#### Recap

Let's recap how we can use a state hook:

```jsx
import React, { useState } from "react";

const DebateNameInput = () => {
  const [debateName, setDebateName] = useState("");

  return (
    <div>
      <input value={debateName} onChange={e => setDebateName(e.target.value)} />
      <p>The debate name is {debateName}.</p>
    </div>
  );
};
```

- On the first line, we make sure to import the _useState_ function from React.
- We create a function, using the arrow syntax, and give it the name `DebateNameInput`.
- We call the _useState_ function. It returns an array with two values, the current state and the function that acts as a setter. Thanks to the array destructuring syntax, we can assign those values in one line. We call the first one `debateName` and the second `setDebateName`. The _useState_ function takes one parameter, which represents the initial state. In our example, an empty string.
- Our function returns some JSX. The input takes the current state as its value. We gave it the name `debateName`. Whenever that input registers a change event, we call `setDebateName` with the input's new value as a parameter. This function will then replace the current `debateName` value with the new one.
- React re-renders the component with that new state value.

#### Using several state variables

So far, we've only worked with one state variable at a time. Of course, you will most likely have more than one state variable in your component. You can use several _useState_ functions if you want:

```jsx
function fruitBasket = () => {
  const [numberOfBananas, setNumberOfBananas] = useState(0)
  const [numberOfApples, setNumberOfApples] = useState(3)
  const [numberOfPeaches, setNumberOfPeaches] = useState(2)

  //... rest of your code
}
```

Here, we use three different _useState_ functions to declare three state variables, and their 3 different setters.

You don't _have to_ use several state variables. _useState_ can also hold objects and arrays, so this is entirely possible:

```jsx
function fruitBasket = () => {
  const [numberOfFruits, setNumberOfFruits] = useState({bananas: 0, apples: 3, peaches: 2})

  //... rest of your code
}
```

One thing to know: updating the state variable `numberOfFruits` is different from the `this.setState` in classes. In the state hook, the setter function **replaces** while the `setState` function **merges**. Which means, to properly updates `numberOfFruits`, you'll need to:

```jsx
setNumberOfFruits({ ...numberOfFruits, bananas: 2 });
setNumberOfFruits({ ...numberOfFruits, apples: 3 });
```

By using the spread operator (`...`), we keep the current state and only replaces the variables that needs to change. The first function call will replace the amount of bananas to 2, the second will replace the amount of apples to 3.
