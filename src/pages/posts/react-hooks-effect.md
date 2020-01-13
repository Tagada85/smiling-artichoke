---
title: How to use the Effect Hook in React
subtitle: A look at how to use the Effect Hook
excerpt: >-
  Hooks have changed the way we use React. Let's explore how we would handle side effects with Hooks.
date: "2020-01-13"
thumb_img_path: images/react.png
content_img_path: images/react.png
tags: ["react", "hooks", "javascript", "state"]
template: post
---

### useEffect hook

The second hook we will explore is the Effect hook. You will use this hook to handle your components' side effects. Data fetching, subscriptions, DOM changes... these things will be handle in an Effect hook.

The Effect hook is used as follow:

```jsx
import React, {useEffect, useState} from 'react'

const ChangeColor = () => {
    const [debateName, setDebateName] = useState('')

    // If you are familiar with classes, this is the same as
    // componentDidMount and componentDidUpdate
    useEffect(() => {
        // Here, I'm updating the body's background color
        let currentColor = document.body.style.backgroundColor
        document.body.style.backgroundColor = currentColor == 'red' ? 'blue' : 'red'
    })

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

I've re-used the same logic from the _useState_ chapter, with an text input and the state Hook. I have added a side effect handled by the Effect hook. Everytime our component is done mounting, or is done being updated, we check the body's background color and change to blue or red depending on the body's current background.

Coming from classes and their lifecycles, the Effect hook is three different lifecycles in one:

- componentDidMount
- componentDidUpdate
- componentWillUnmount

There are two kinds of effects: Effects with cleanups and effects without cleanups.

#### Effects without cleanup

We might need to run some additional code after React has updated the DOM. You might need to fetch data, log something or change the DOM in some way for example. These side-effects need to run when after the DOM is updated, and that's it. You don't need to worry about anything else. The code runs, and we move on...

##### The classes way

If you are using classes with React, you would use the _componentDidMount_ and/or _componentDidUpdate_ lifecycles to run your side effects. The _render_ method is called too early because it happens before the DOM is fully rendered. It would look something like this:

```jsx
import React from "react";

class ChangeTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      debateName: ""
    };
  }

  componentDidMount() {
    document.title = `Current debate title is ${this.state.debateName}`;
  }

  componentDidUpdate() {
    document.title = `Current debate title is ${this.state.debateName}`;
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

In this example, whenever our component's DOM changes, we modify our document's title to display the current debate name. Can you see one problem with this seemingly very simple code?

**We have duplicate logic in componentDidMount and componentDidUpdate.**

In many cases, we don't really care if our component just mounted, or has been updated. The DOM changed, so we need to run the side effect anyway. Unfortunately, with classes, we can't regroup those things into one lifecycle. But, with Hooks, we can!

##### The Hook way

The example is similar to the one we've seen at the top:

```jsx
import React, { useEffect, useState } from "react";

const ChangeTitle = () => {
  const [debateName, setDebateName] = useState("");

  useEffect(() => {
    document.title = `Current debate title is ${debateName}`;
  });

  return (
    <div>
      <p>Enter a debate name:</p>
      <input
        type="text"
        value={debateName}
        onChange={e => setDebateName(e.target.value)}
      />
    </div>
  );
};
```

Let's go into detail how the _useEffect_ hook works.

- First, we create a state variable called _debateName_. If the state hook is still strange to you, I wrote something about the state hook.

- By using the _useEffect_ function, provided by the React API, we tell React we want to use an effect. Basically, we say: _I want to do something after my component is rendered_. The Effect hook takes a function as a parameter. That function is your effect! In this case, I'm using the browser API to modify the title of my document. You can do pretty much whatever you want in that function.

- Notice that because the _useEffect_ call is _inside_ the component, I have access to the state variables. By using the power of closures, Javascript can access the component's variables inside the effect. This isn't React _magic_, just regular Javascript stuff!

- Finally, the _useEffect_ hook will be called after _every_ render (we will customize this later below). The function called inside the effect Hook will be different on every render. This is crucial because, if that wasn't the case, our _debateName_ value would always be the same inside our effect. Your effect _is associated_ to a particular render. So, you can be sure that the state of your components will be up to date when you call your effects.

#### Effects with cleanup

Some side effects require some cleanup. Some effects, if not cleaned up after we're done with them, might introduce a memory leak. For example, in a application where we have debates and opinions, I might want to set up a subscription to listen to new opinions in a debate. When my component displaying my debate with its opinions unmounts, I **need** to make sure I unsubscribe.

##### The classes way

Let's see how that debates and opinions example would work with classes. Typically, you would set up your subscription inside the _componentDidMount_ lifecycle and unsubscribe inside the _componentWillUnmount_ lifecycle.

```jsx
mport React from "react";

class DebateSubscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscribed: null
    };
    this.handleSubscriptionChange.bind(this);
  }

  componentDidMount() {
    DebateAPI.subscribeToOpinions(
      this.props.debateId,
      this.handleSubscriptionChange
    );
  }

  componentDidUpdate(prevProps){
     DebateAPI.unsubscribeFromOpinions(
      prevProps.debateId,
      this.handleSubscriptionChange
    );
    DebateAPI.subscribeToOpinions(
      this.props.debateId,
      this.handleSubscriptionChange
    );
  }

  componentWillUnmount() {
    DebateAPI.unsubscribeFromOpinions(
      this.props.debateId,
      this.handleSubscriptionChange
    );
  }

  handleSubscriptionChange(isSubscribed) {
    this.setState({
      subscribed: isSubscribed
    });
  }

  render() {
    if (this.state.subscribed === null) {
      return "Loading...";
    } else if (this.state.subscribed) {
      return "Subscription online!";
    } else {
      return "Subscription offline!";
    }
  }
}
```

Whenever our component mounts, we set up our subscription to a debate's opinions by using its id. Then, when our component unmounts, in the _componentWillUnmount_ lifecycle, we run our unsubscribe logic.

The issue with classes is that our _componentDidMount_ logic and our _componentWillUnmount_ logic need to mirror each other. Notice how the functionality is the same, yet we have to look in two different lifecycles to get it all...

_Note: You'll see that I added a **componentDidUpdate** lifecycle. There is a reason for that, I'll get to it later ;)_

##### The Hook way

Using Hooks, here is how you would do it:

```jsx
import React, { useState, useEffect } from "react";

const DebateSubscription = ({ debateId }) => {
  const [subscribed, setSubscribed] = useState(null);

  useEffect(() => {
    function handleSubscriptionChange(isSubscribed) {
      setSubscribed(isSubscribed);
    }

    DebateAPI.subscribeToOpinions(debateId, handleSubscriptionChange);

    // Tell the component how to cleanup
    return () => {
      DebateAPI.unsubscribeFromOpinions(debateId, handleSubscriptionChange);
    };
  });
  if (subscribed === null) {
    return "Loading...";
  } else if (subscribed) {
    return "Subscription online!";
  } else {
    return "Subscription offline!";
  }
};
```

In this code above, you can see the optional cleanup mechanism with useEffect. Every effect can return a function that specify how to clean up that particular effect. This lets us keep our logic for subscribing/unsubscribing close to each other, instead of having it in several places...

If you remember what we said earlier about when the _useEffect_ function runs, you may have guesses when the cleanup function occurs. Because effects run for every render, cleanups also runs after every render.

##### Using several Effect Hooks

The motivation behing the Effect Hook was to avoid having the logic for the same side effect split into different part of your component. Just like you can use several State Hooks, if you have several effects in your component, you can use several Effect Hooks to separate the logic.

Let's examine how things would be done with classes:

```jsx
import React from "react";

class DebateSideEffects extends React.Component {
  constructor(props) {
    super(props);
    this.state = { debateName: "", userInfos: null };
    this.handleAPIresults = this.handleAPIresults.bind(this);
  }

  componentDidMount() {
    document.title = `Current debate name: ${this.state.debateName}`;
    UserAPI.subscribeToUser(this.props.userId, this.handleAPIresults);
  }

  componentDidUpdate() {
    document.title = `Current debate name: ${this.state.debateName}`;
  }

  componentWillUnmount() {
    UserAPI.unsubscribeFromUser(this.props.userId, this.handleAPIresults);
  }

  handleAPIresults = data => {
    this.setState({
      userInfos: data
    });
  };

  render() {
    return (
      <div>
        <input
          value={this.state.debateName}
          onChange={e => this.setState({ debateName: e.target.value })}
        />

        <div>
          <h3>User Infos</h3>
          {this.state.userInfos && <p>{this.state.userInfos.username}</p>}
        </div>
      </div>
    );
  }
}
```

Notice how the `document.title` logic is spread between the _componentDidMount_ and _componentDidUpdate_ lifecycles. The `UserAPI` subscriptions are spread between _componentDidMount_ and _componentWillUnmount_ lifecycles...

With the Effect Hook, we can now regroup the same functionality under the same hook:

```jsx
import React, {useState, useEffect} from 'react'

const DebateSideEffects = ({debateId, userId}) => {
  const [debateName, setDebateName] = useState('')
  useEffect(() => {
    document.title = `Current debate name: ${debateName}`;
  })

  const [userInfos, setUserInfos] = useState(null)
  useEffect(() => {
    const handleAPIresults = data => setUserInfos(data)
    UserAPI.subscribeToUser(userId, handleAPIresults)

    return () => {
      UserAPI.unsubscribeFromUser(userId, handleAPIresults)
    }
  })
  return (
    //...returns our markup
  )
}
```

With Hooks, we can split our side effects logics nicely. The code is more readable and clearer.

##### Why the Effect Hook runs on every render

Assuming that you have a subscription set up in your component to display a user's informations by using a _userId_ in the props. If your component is on the screen, and that _userId_ props changes, the subscription would not be up to date. That would introduce some bugs.

In a class, you would have to use a _componentDidUpdate_ lifecycle:

```jsx
componentDidUpdate(prevProps){
  //Unsubscribe from the last userId
  UserAPI.unsubcribeFromUser(prevProps.userId, this.handleAPIresults)

  UserAPI.subscribeToUser(this.props.userId, this.handleAPIresults)
}

```

Forgetting to handle the _componentDidUpdate_ lifecycle is the cause for a lot of bugs in React.

The Effect Hook doesn't have this sort of problem because it handles updates _by default_.

```jsx
useEffect(() => {
  UserAPI.subscribeToUser(userId, handleAPIresults);

  return () => {
    UserAPI.unsubcribeFromUser(userId, handleAPIresults);
  };
});
```

This would run after every update, so the bug we could introduce if we miss our _componentDidUpdate_ is no longer an issue. Using the Effect Hook increases the consistency of our code. We'll see later how to further optimize this sort of behavior.

#### Optimizing the Effect Hook

Having an effect run after every render might cause some performance issue. In classes, every _componentDidUpdate_ function took the previous props and state as arguments, so you could write your logic depending on the previous props and/or state.

```jsx
componentDidUpdate(prevProps, prevState){
  if(prevProps.user.id !== this.props.user.id){
    // Do something special
  }
}
```

This is a fairly common use case. And again, with classes, it forced us to have unrelated logic inside one big method. It is not rare to see a bunch of if statements inside there, depending on the props and state of the components. Not great...

With the Effect Hook, we can skip some effects to make sure they don't run when we don't need them. To do so, the _useEffect_ function takes an array as an optional second parameter:

```jsx
const UserProfile = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    fetchUserDataFromAPI(userId).then(data => {
      setUserData(data);
    });
  }, [userId]);

  if (!userData) {
    return "Loading...";
  } else {
    return (
      <div>
        <h3>{userData.username}</h3>
      </div>
    );
  }
};
```

For example, we gave here `[userId]` as our second parameter. Which means that the effect will only run when the _userId_ value changes.

- When our component starts its renders, the effect runs because our props are not set yet. So the component records a change in the _userId_ props, so our effect runs.

- Whenever our component renders again, React will compare the array's content we gave as the second argument with the new props values, here _userId_. So, `[userId] === [newProps.userId]`. If that is false, the effect will run on the new render. If it's true, the effect is skipped.

Notice that this logic also functions for the cleanup effects:

```jsx
const UserProfile = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    fetchUserDataFromAPI(userId).then(data => {
      setUserData(data);
    });
    subscribeToUserData(userId);
    return () => {
      unsubscribeFromUserData(userId);
    };
  }, [userId]);

  if (!userData) {
    return "Loading...";
  } else {
    return (
      <div>
        <h3>{userData.username}</h3>
      </div>
    );
  }
};
```

The cleanup effect would run only if the _userId_ props changes. Then, after the component finishes the next render, it would launch the subscribe with the new _userId_ value.

- If you want an effect that runs only on the first render, and cleans up only when the component unmounts, you could give an empty array `[]` as the second argument. That functionality resembles the classes _componentDidMount_ and _componentWillUnmount_ logic.
