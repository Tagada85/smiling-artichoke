---
title: Refactor a form with React Hooks
subtitle:
excerpt: >-
  Lately, React gave us a new toy with Hooks. Let's see how we could refactor a form.
date: "2019-03-02"
thumb_img_path: images/react.png
content_img_path: images/react.png
tags: ["javascript", "react", "hooks"]
template: post
---

## Introduction

React Hooks are one of those things I decided I would look at _later_. I've read and heard great things about it, so I later is now. I had a component with a form that I thought could be refactored using hooks, so I started with that. Always easier to begin with small steps.

## Before React hooks

Nothing fancy, we use the _material-ui_ framework to create a Dialog component. Then we have three TextFields ( text inputs ) inside of it:

```javascript
export default class AddItemPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      quantity: 0,
      unitCost: 0
    };
  }

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  addItem = () => {
    const { name, quantity, unitCost } = this.state;

    if (!name || !quantity || !unitCost) return;

    this.props.saveItem(this.state);
  };

  render() {
    const { open, closePopup } = this.props;
    const { name, quantity, unitCost } = this.state;
    return (
      <Dialog open={open} onClose={closePopup}>
        <DialogTitle>Add new item</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Item name/Description"
            onChange={this.handleInputChange}
            value={name}
          />
          <TextField
            name="quantity"
            label="Quantity"
            onChange={this.handleInputChange}
            value={quantity}
          />
          <TextField
            name="unitCost"
            label="Unit Cost"
            onChange={this.handleInputChange}
            value={unitCost}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup} color="secondary" variant="contained">
            Cancel
          </Button>
          <Button onClick={this.addItem} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
```

I saved you the imports at the top of the file, but you got the idea. A class component with a form and a state to keep track of the form inputs' values. Now, let's rewrite this component by using the useState hook.

## With React Hooks

```javascript
// Import the hook first
import React, { useState } from "react";

const AddItemPopup = ({ open, closePopup, saveItem }) => {
  const handleInputChange = e => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const addItem = () => {
    const { name, quantity, unitCost } = values;

    if (!name || !quantity || !unitCost) return;

    saveItem(values);
  };
  // Declare our state variable called values
  // Initialize with our default values

  const [values, setValues] = useState({ name: "", quantity: 0, unitCost: 0 });
  return (
    <Dialog open={open} onClose={closePopup}>
      <DialogTitle>Add new item</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Item name/Description"
          onChange={handleInputChange}
          value={values.name}
        />
        <TextField
          name="quantity"
          label="Quantity"
          onChange={handleInputChange}
          value={values.quantity}
        />
        <TextField
          name="unitCost"
          label="Unit Cost"
          onChange={handleInputChange}
          value={values.unitCost}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closePopup} color="secondary" variant="contained">
          Cancel
        </Button>
        <Button onClick={addItem} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemPopup;
```

BOOM! Our component became a function now. What did we do:

- _useState_ returns two things: the current state ( here as _values_ ) and a function that lets you update it ( here as _setValues_ )
- _useState_ takes one argument: the initial state.
- The onChange handler function now uses this _setValues_ function to modify the internal state of the component. As you can see, the _values_ variable is accessible everywhere is the component.

_Note_: We could have used three different hooks to update each input separately, whatever you think might be more readable to you ;)
