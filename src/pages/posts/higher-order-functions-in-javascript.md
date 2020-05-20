---
title: Higher-Order Functions in Javascript
subtitle: HOF, or Higher-Order Functions simply explained
tags: ["javascript", "hof", "higher-order functions"]
content_img_path: images/carbon-hof.png
thumb_img_path: images/carbon-hof.png
template: post
date: "2020-05-20"
excerpt: >-
  In this article, we will explain what the Higher-Order Functions in Javascript are all about. We will also start to explore composition.
---

## Introduction

In Javascript, functions are values (first-class citizens). This means that they can be assigned to a variable and/or passed as a value.

```javascript
// Assigning a function to the variable random
let random = function () {
  return Math.random();
};
```

This single piece of knowledge allows us to write functional programming in this language. In functional programming, we heavily use higher-order functions.

## Higher-order functions?

Higher-order functions are functions that take other functions as arguments _or_ return functions as their results.

Taking an other function as an argument is often referred to as a _callback function_, because it is called back by the higher-order function. This is a concept that Javascript uses a lot.

For example, the _map_ function on arrays is a higher order function. The _map_ function takes a function as an argument.

```javascript
const double = (n) => n * 2;

[(1, 2, 3, 4)].map(double); // [ 2, 4, 6, 8 ]
```

Or, with an anonymous function:

```javascript
[1, 2, 3, 4].map(function (n) {
  return n * 2;
}); // [ 2, 4, 6, 8 ]
```

The _map_ function is one of the many higher-order functions built into the language. _sort_, _reduce_, _filter_, _forEach_ are other examples of higher-order functions built into the language.

Higher-order functions allows you to write simpler and more elegant code. Let's look at what the code above would look like without such an abstraction. Let's replace the _map_ function by a loop:

```javascript
let array = [1, 2, 3, 4];
let newArray = [];

for (let i = 0; n < array.length; i++) {
  newArray[i] = array[i] * 2;
}

newArray; // [ 2, 4, 6, 8 ]
```

## The power of composition

One of the great advantages of using higher order functions when we can is composition.

We can create smaller functions that only take care of one piece of logic. Then, we compose more complex functions by using different smaller functions.

This technique reduces bugs and makes our code easier to read and understand.

By learning to use higher-order functions, you can start writing better code.

## Higher-order functions and composition example

Lets try with an example. Assume we have a list of grades from a classroom. Our classroom has 5 girls, 5 boys and each of them has a grade between 0 and 20.

```javascript
var grades = [
  { name: "John", grade: 8, sex: "M" },
  { name: "Sarah", grade: 12, sex: "F" },
  { name: "Bob", grade: 16, sex: "M" },
  { name: "Johnny", grade: 2, sex: "M" },
  { name: "Ethan", grade: 4, sex: "M" },
  { name: "Paula", grade: 18, sex: "F" },
  { name: "Donald", grade: 5, sex: "M" },
  { name: "Jennifer", grade: 13, sex: "F" },
  { name: "Courtney", grade: 15, sex: "F" },
  { name: "Jane", grade: 9, sex: "F" },
];
```

I want to know a few things about this:

- The average grade of this classroom
- The average grade of the boys
- The average grade of the girls
- The higher note among the boys
- The higher note among the girls

We will try to use higher-order functions to get a program that is simple and easy to read. Let's start by writing simple functions that can work together:

```javascript
let isBoy = (student) => student.sex === "M";

let isGirl = (student) => student.sex === "F";

let getBoys = (grades) => grades.filter(isBoy);

let getGirls = (grades) => grades.filter(isGirl);

let average = (grades) =>
  grades.reduce((acc, curr) => acc + curr.grade, 0) / grades.length;

let maxGrade = (grades) => Math.max(...grades.map((student) => student.grade));

let minGrade = (grades) => Math.min(...grades.map((student) => student.grade));
```

I wrote 7 functions, and each of them has one job, and one job only.

_isBoy_ and _isGirl_ are responsible for checking if one student is a boy or a girl.

_getBoys_ and _getGirls_ are responsible for getting all the boys or girls from the classroom.

_maxGrade_ and _minGrade_ are responsible for getting the greatest and lowest grade in some data.

Finally, _average_ is responsible to calculate the average grade of some data.

Notice that the _average_ function doesn't know anything about the type of data it's suppose to process yet. That's the beauty of composition. We can re-use our code in different places. I can just plug this function with others.

Now, we have what we need to write higher-order functions:

```javascript
let classroomAverage = average(grades); // 10.2
let boysAverage = average(getBoys(grades)); // 7
let girlsAverage = average(getGirls(grades)); // 13.4
let highestGrade = maxGrade(grades); // 18
let lowestGrade = minGrade(grades); // 2
let highestBoysGrade = maxGrade(getBoys(grades)); // 16
let lowestBoysGrade = minGrade(getBoys(grades)); // 2
let highestGirlsGrade = maxGrade(getGirls(grades)); // 18
let lowestGirlsGrade = minGrade(getGirls(grades)); // 9
```

Notice that the outer functions, _average_ for example, always take as an input the output from the inner functions. Therefore, the only condition to composition is to make sure that the output and input match.

And because each function is responsible for only one thing, it makes our code that much easier to debug and to test.

Have fun :heart:
