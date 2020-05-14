---
title: Create a calendar plugin with vanilla Javascript
subtitle: Moving away from all the frameworks and libraries
excerpt: >-
  In this article, we will build a very simple plugin with vanilla Javascript. This plugin will render a Calendar.
date: "2020-05-14"
thumb_img_path: images/plugin.png
content_img_path: images/plugin.png
tags: ["javascript", "html", "css", "plugin"]
template: post
---

## Introduction

When we hear about Javascript, we often hear about libraries and frameworks. There are about five gazillion choices today on how to use Javascript. Yet, we often forget that we can still use good old classic Javascript, without frameworks or libraries. In this article, we'll build a plugin using nothing but vanilla Javascript. This plugin, quite simple, will allow us to include a calendar in an HTML page.

## Setting up

We need three files, one HTML file, one CSS file and one Javascript file. Let's start with our Javascript file, because this will be where we have the most work to do.

## Plugin Skeleton

```javascript
(function (root, factory) {
  root.myCalendar = factory(root);
})(this, (root) => {
  let privateVar = "No, No, No...";
  let init = () => {
    console.log("Init the calendar");
  };
  return {
    init,
  };
});
```

The first thing we need to do is to make our plugin available for our environment. We do this by using an IIFE (Immediately Invoked Function Expression). As you can see, we wrap our first function into parentheses, turning it into an expression that we call right away.

IIFE are useful to encapsulate code. My plugin's code won't be accessible from outside the plugin. But we'll see that later.

Let's break the code above a little bit:

In the main body of our function we do:

`root.myCalendar = factory(root);`

What is _root_? This is the first parameter of our IIFE, _this_. So, in a browser, this is the _window_ object. We set _window.myCalendar_ to `factory(root)`. _factory_, the second parameter of our IIFE, is a function. This is, in fact, our plugin content.

The beauty of this approach is that _window.myCalendar_ will only contain whatever my function returns. So, I'll be able to call _window.myCalendar.init()_, but _window.myCalendar.privateVar_ will be undefined, because it's not returned by our IIFE.

### Importing in our index.html

We already have a plugin! It doesn't do much, but it works. Let's create a HTML file and test it out.

```html
<html>
  <head>
    <script src="simple-calendar.js"></script>
    <script>
      window.onload = function () {
        myCalendar.init();
        console.log(myCalendar.privateVar);
      };
    </script>
  </head>
  <body></body>
</html>
```

We load our Javascript file. I called it _simple-calendar.js_ but name it whatever you wish. Then, after the window is done loading, inside the _onload_ event listener, I'm called _myCalendar.init()_ and console.log the _myCalendar.privateVar_ variable.

_Note:_ _window.myCalendar_ and _myCalendar_ is the same here ;)

So, here's what I see in my console:

![Console private variables](https://dev-to-uploads.s3.amazonaws.com/i/noyskjv28ey0jrr83jug.png)

Great! The _init_ function prints what we expected and privateVar is indeed _undefined_ because it is not returned from our IIFE, so our plugin doesn't know what you are talking about!

## The CSS

Let's get that out of the way, because this is not the point of the article. Create a CSS file and put the following styles inside it:

```css
#calendar {
  background: #fff;
  border-radius: 4px;
  color: #222629;
  overflow: hidden;
  margin-top: 20px;
  max-width: 400px;
}

#calendar.hidden {
  display: none;
}

button {
  border: none;
}

#calendar .header {
  background: #ddd;
  height: 40px;
  line-height: 40px;
  text-align: center;
}

#calendar .header + div {
  border: 1px solid black;
}

#calendar .month {
  display: inline-block;
  font-weight: bold;
}

#calendar button {
  background: none;
  color: inherit;
  cursor: pointer;
  font-size: 23px;
  font-weight: bold;
  height: 100%;
  padding: 0 15px;
}

#calendar button:first-child {
  float: left;
}

#calendar button:last-child {
  float: right;
}

#calendar .cell {
  background: #fff;
  color: #5d5d5d;
  box-sizing: border-box;
  display: inline-block;
  padding: 10px 0;
  text-align: center;
  width: calc(100% / 7);
  cursor: pointer;
}

#calendar .cell:hover {
  color: white;
  background-color: blue;
}

#calendar .day {
  font-size: 0.8rem;
  padding: 8px 0;
}

#calendar .cell.today {
  background-color: blue;
  color: white;
}

#calendar .day {
  color: black;
}
```

Don't forget to import it in our HTML file. In the `<head>` of our page, add the following line:

`<link rel="stylesheet" href="calendar.css" />`

Of course, replace the _calendar.css_ with the name of your file.

## Adding functionality

Ok, it's very cute, but my plugin still doesn't do anything here... Let's begin.

##### Months, Days and Today

I'll first need to get the months list, days list and today's date. I want my calendar to focus on today's date by default. So, in our plugin, above the private variable, let's add those:

```javascript
// Beginning of the file cut for brevity
    let monthList = new Array(
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december"
    );
    let dayList = new Array(
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    );
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let privateVar = "No, No, No...";

  let init = () => {
    console.log("Init the calendar");
  };
  return {
    init,
  };
});
```

Good, everything is setup. Now, we can start to modify the DOM to implement our calendar. Obviously, this step needs to be done inside the _init_ function. We want the calendar to appear when we initialize our plugin.

There are a few things we need to do:

- Create a header with the name of the current month and the current year. This header will also have next and previous buttons to navigate between months.

- Below the header, we will have the list of days, from Sunday to Monday.

- Finally, we will have the days in the current month.

### The header

```javascript
// Our variables are up there
let init = () => {
  let element = document.getElementById("calendar");

  let currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Creating the div for our calendar's header
  let header = document.createElement("div");
  header.classList.add("header");
  element.appendChild(header);

  // Our "previous" button
  let previousButton = document.createElement("button");
  previousButton.setAttribute("data-action", "-1");
  previousButton.textContent = "\u003c";
  header.appendChild(previousButton);

  // Creating the div that will contain the actual month/year
  let monthDiv = document.createElement("div");
  monthDiv.classList.add("month");
  header.appendChild(monthDiv);

  // Our "next" button
  let nextButton = document.createElement("button");
  nextButton.setAttribute("data-action", "1");
  nextButton.textContent = "\u003e";
  header.appendChild(nextButton);
};
```

We have here just a few elements added with Javascript. We don't use anything fancy, just the classic Javascript API with _createElement_, _appendChild_ and _setAttribute_. We created our div element for our header, that will contain the current's month name. We also created our previous and next buttons.

Notice this line:

`let element = document.getElementById("calendar");`

This element is what will contain our calendar. We put it inside an element with the id _calendar_. This is a choice I made, but we'll make it customizable later. But that means we need to add an element with the proper id in our HTML:

```html
<!-- The <head> tag is up there-->
<body>
  <div id="calendar"></div>
</body>
```

That's it for the HTML. And sure enough, we can see the header in our page.

![Header Calendar](https://dev-to-uploads.s3.amazonaws.com/i/bsy59tagps1djn25ip0k.png)

Let's keep going!

### Add the list of days and the month's cells

Now, let's add the cells that will contain the days of our current month. One thing we'll need to be careful about: the "empty" days at the beginning of a month. Our week starts on Sunday, but if our month begins on a Wednesday, we'll need to fill some empty cells.

For clarity, I'll put this logic inside its own method.

```javascript
// This is inside the init function, right before the end of the function

 // Creating the div that will contain the days of our calendar
    let content = document.createElement("div");
    element.appendChild(content);

    // Load current month
    // monthDiv is the element in the header that will contain the month's name
    // content is the element that will contain our days' cells
    // We created those variables earlier in the function
    loadMonth(currentMonth, content, monthDiv);
    } // <- this is the end of the init function

  let loadMonth = (date, content, monthDiv) => {
    // Empty the calendar
    content.textContent = "";

    // Adding the month/year displayed
    monthDiv.textContent =
      monthList[date.getMonth()].toUpperCase() + " " + date.getFullYear();

    // Creating the cells containing the days of the week
    // I've created a separate method for this
    createDaysNamesCells(content);

    // Creating empty cells if necessary
    createEmptyCellsIfNecessary(content, date);


    // Number of days in the current month
    let monthLength = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    // Creating the cells containing current's month's days
    for (let i = 1; i <= monthLength; i++) {
      let cell = document.createElement("span");
      cell.classList.add("cell");
      cell.textContent = `${i}`;
      content.appendChild(cell);

      // Cell's timestamp
      let timestamp = new Date(
        date.getFullYear(),
        date.getMonth(),
        i
      ).getTime();
      cell.addEventListener("click", () => {
        console.log(timestamp);
        console.log(new Date(timestamp))
      });

      // Add a special class for today
      if (timestamp === today.getTime()) {
        cell.classList.add("today");
      }
    }
  }

  let createDaysNamesCells = (content) => {
    for (let i = 0; i < dayList.length; i++) {
      let cell = document.createElement("span");
      cell.classList.add("cell");
      cell.classList.add("day");
      cell.textContent = dayList[i].substring(0, 3).toUpperCase();
      content.appendChild(cell);
    }
  };

  let createEmptyCellsIfNecessary = content => {
    for (let i = 0; i < date.getDay(); i++) {
      let cell = document.createElement("span");
      cell.classList.add("cell");
      cell.classList.add("empty");
      content.appendChild(cell);
    }
  }

  // The rest of the plugin down here, cut for brevity
```

A lot is going on here!

- We first call _loadMonth_. This function is responsible to display the name of the current month and the current year in the header.

- We then call _createDaysNamesCells_, to display our Sunday to Saturday list of days.

- We call _createEmptyCellsIfNecessary_ to display the empty cells if necessary. We give that function the _date_ variable, which is the first day of the current month. By calling _getDay()_ on this variable, we get the index of the day. Because it starts on a Sunday, like our week in our calendar, we can do a simple loop to render the number of empty cells we need.

- Finally, we get the number of days in that month and render each cell with the correct day displayed. We've added a event listener on each cell to print in the console the timestamp and the date of the chosen day. We also added a class for the current day that will styled with CSS.

And this is the result so far!

![Complete Calendar](https://dev-to-uploads.s3.amazonaws.com/i/pieyg54cor3af4x3kumi.png)

The calendar is properly rendered, and when we click on a date, we see the timestamp and the date of the cell we clicked in the console.

### Adding interactivity

We need to add three things:

- When I click on a date, it becomes the selected day.
- When I click on the previous button, we go to the previous month.
- When I click on the next button, we go to the next month.

For the first item, we need to add the class _today_ to the correct cell. We also need to remove the _today_ class to the previously selected cell. _today_ is the class name I chose, but you can call it whatever you want. You just need to update your code appropriately. Navigate to where we print to the console the timestamp and the date and change the code to this:

```javascript
cell.addEventListener("click", () => {
  console.log(timestamp);
  console.log(new Date(timestamp));
  document.querySelector(".cell.today")?.classList.remove("today");
  cell.classList.add("today");
});
```

This will properly style the cell you selected.

Finally, we'll add the next/previous month feature:

```javascript
//Inside the init function

// Next/previous button functionality
element.querySelectorAll("button").forEach((element) => {
  element.addEventListener("click", () => {
    currentMonth.setMonth(
      currentMonth.getMonth() * 1 +
        parseInt(element.getAttribute("data-action")) * 1
    );
    loadMonth(currentMonth, content, monthDiv);
  });
});
```

We add a event listener for each button. We will use the _data-action_ attribute we created to know if we clicked the next or the previous button. _data-action_ is either equal to 1 or -1. We modify the currentMonth variable and call _loadMonth_ again because we need to update the calendar's content.

And it works!

`youtube: https://youtu.be/TFGhmPdxtBY`

Congratulations, you just created a Javascript plugin!

Here the full Javascript code:

```javascript
(function (root, factory) {
  root.myCalendar = factory(root);
})(this, (root) => {
  let monthList = new Array(
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december"
  );
  let dayList = new Array(
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  );
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let privateVar = "No, No, No...";

  let init = () => {
    let element = document.getElementById("calendar");

    let currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Creating the div for our calendar's header
    let header = document.createElement("div");
    header.classList.add("header");
    element.appendChild(header);

    // Creating the div that will contain the days of our calendar
    let content = document.createElement("div");
    element.appendChild(content);

    // Our "previous" button
    let previousButton = document.createElement("button");
    previousButton.setAttribute("data-action", "-1");
    previousButton.textContent = "\u003c";
    header.appendChild(previousButton);

    // Creating the div that will contain the actual month/year
    let monthDiv = document.createElement("div");
    monthDiv.classList.add("month");
    header.appendChild(monthDiv);

    // Our "next" button
    let nextButton = document.createElement("button");
    nextButton.setAttribute("data-action", "1");
    nextButton.textContent = "\u003e";
    header.appendChild(nextButton);

    // Next/previous button functionality
    element.querySelectorAll("button").forEach((element) => {
      element.addEventListener("click", () => {
        console.log(element.getAttribute("data-action"));
        currentMonth.setMonth(
          currentMonth.getMonth() * 1 +
            parseInt(element.getAttribute("data-action")) * 1
        );
        loadMonth(currentMonth, content, monthDiv);
      });
    });

    // Load current month
    loadMonth(currentMonth, content, monthDiv);
  };

  let createDaysNamesCells = (content) => {
    for (let i = 0; i < dayList.length; i++) {
      let cell = document.createElement("span");
      cell.classList.add("cell");
      cell.classList.add("day");
      cell.textContent = dayList[i].substring(0, 3).toUpperCase();
      content.appendChild(cell);
    }
  };

  let createEmptyCellsIfNecessary = (content, date) => {
    for (let i = 0; i < date.getDay(); i++) {
      let cell = document.createElement("span");
      cell.classList.add("cell");
      cell.classList.add("empty");
      content.appendChild(cell);
    }
  };

  let loadMonth = (date, content, monthDiv) => {
    // Empty the calendar
    content.textContent = "";

    // Adding the month/year displayed
    monthDiv.textContent =
      monthList[date.getMonth()].toUpperCase() + " " + date.getFullYear();

    // Creating the cells containing the days of the week
    createDaysNamesCells(content);

    // Creating empty cells if necessary
    createEmptyCellsIfNecessary(content, date);

    // Number of days in the current month
    let monthLength = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    // Creating the cells containing current's month's days
    for (let i = 1; i <= monthLength; i++) {
      let cell = document.createElement("span");
      cell.classList.add("cell");
      cell.textContent = `${i}`;
      content.appendChild(cell);

      // Cell's timestamp
      let timestamp = new Date(
        date.getFullYear(),
        date.getMonth(),
        i
      ).getTime();
      cell.addEventListener("click", () => {
        console.log(timestamp);
        console.log(new Date(timestamp));

        document.querySelector(".cell.today")?.classList.remove("today");
        cell.classList.add("today");
      });

      // Add a special class for today
      if (timestamp === today.getTime()) {
        cell.classList.add("today");
      }
    }
  };
  return {
    init,
  };
});
```

Have fun :heart:
