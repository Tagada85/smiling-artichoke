---
title: Understanding prototypes and inheritance in Javascript
subtitle: Trying to explain simply a confusing concept.
excerpt: >-
  In this article, we will explain a concept that got me confused for a long time: Prototypes and Inheritance in Javascript. What are prototypes? How do they work?
date: "2020-05-27"
thumb_img_path: images/js-logo.png
content_img_path: images/js-logo.png
tags: ["prototypes", "javascript", "inheritance"]
template: post
---

## Introduction

Aaaaah, prototypes... How many blog posts did you read where prototypes are listed as a must-know characteristic of the language? How many times senior developers told you about prototypal inheritance? I've spent quite some time avoiding to learn more deeply about this thing. I got tired of procrastinating, so I wrote this thing.

## Simple words please... with examples?

Objects in Javascript have an internal property ( in the specification called [[Prototype]] ). This internal property is a reference to another object. Quick example:

```javascript
// A simple object
const myObject = {
  a: 2,
};
console.log(myObject.a); // 2

// We link newObject to myObject with Object.create
const newObject = Object.create(myObject);

console.log(newObject); // {}
console.log(newObject.a); // 2 ??? Why?
```

_Object.create_ creates a new object. It takes another object as an argument. The common way to think about what is happening is ( the _classical_ way ) : I made a copy of this object. Well, no.

As you can see, _newObject_ is empty. _Object.create_ takes a prototype as its argument. Which means, we didn't copy, we linked _newObject_ to _myObject_. _myObject_ becomes a prototype of _newObject_. To know what is inside the prototype of an object, you can use \***\*proto\*\***.

```javascript
console.log(newObject.__proto__); // { a: 2 }
console.log(myObject.isPrototypeOf(newObject)); // true
```

Chains have links, [[Prototype]] is a chain. So how does Javascript uses prototypes to retrieve values?

#### Up the chain... one link at a time.

```javascript
const original = {
  a: 2,
};

const secondComing = Object.create(original);

const thirdLink = Object.create(secondComing);

console.log(thirdLink); // {}
console.log(secondComing); // {}

console.log(secondComing.isPrototypeOf(thirdLink)); // true
console.log(original.isPrototypeOf(thirdLink)); // true
console.log(thirdLink.isPrototypeOf(original)); // false

console.log(thirdLink.a); // 2
```

Here is how your favourite language works: it tries to get the property _a_ in the _thirdLink_ object. Can't find it. Does it return undefined or a error? Nope, it looks in the prototype chain for a link. It finds out that _secondComing_ is a prototype of _thirdLink_. It looks for _a_, still can't find it. It moves on to another link, called _original_. Finds a = 2 !!

## What if I change something in the bottom of the chain?

- How will it affect the top of the chain? Such a great question.

I decide to change the value _a_ in _thirdLink_ directly:

```javascript
thirdLink.a = 3;

console.log(thirdLink); //{ a: 3 }
console.log(thirdLink.a); // 3
console.log(original.a); // 2
```

This is what we call a shadowed property. The new _a_ value shadows the other _a_ values present in the higher prototypes.

### What if I want some ice on it?

What if the property in the top link can't be overwritten?

```javascript
// Freeze the original, properties can't be changed
Object.freeze(original);
original.a = 3;
// a is still equal to 2
console.log(original); // { a: 2 }

// That will NOT change the value, or shadow it.
thirdLink.a = 3;
console.log(thirdLink); // {}
console.log(thirdLink.a); // 2
```

Nothing changed because the prototype's property _a_ is read-only.

However, if you need to change the property value anyway when it is read-only. You must use _Object.defineProperty_:

```javascript
// Freeze the original, properties can't be changed
Object.freeze(original);

// Ok, this will work.
Object.defineProperty(thirdLink, "a", { value: 5 });

console.log(thirdLink.a); // 5
```

So, whenever you think you are changing a value in a object, you must account for the prototypes up the chain. They may have properties with the same name that cant be overwritten in a certain way.

## What does it mean for functions?

In a class oriented language, you can create different instances of a class. You copy the class behavior into an object. And this is done again every time you instantiate a class.

In Javascript, however, there are no classes, just objects. The **class** keyword is only a syntax thing, it doesn't bring anything class-y to the table. Whatever you can do with the **class** keyword in ES6, you could do without a problem in ES5.

By default, every function gets a _prototype_ property.

```javascript
function hello() {
  return "Hello World";
}

function goodBye() {
  return "Goodbye";
}

console.log(hello.prototype); // hello {}
console.log(goodBye.prototype); // goodBye {}
```

Ok, so what happens if you don't copy like class-oriented languages? You create multiple objects with a [[Prototype]] link. Like so:

```javascript
const a = new hello();
const b = new hello();
const c = new goodBye();
const d = new goodBye();

console.log(Object.getPrototypeOf(a) === hello.prototype); // true
console.log(Object.getPrototypeOf(b) === hello.prototype); // true
console.log(Object.getPrototypeOf(c) === goodBye.prototype); // true
console.log(Object.getPrototypeOf(d) === goodBye.prototype); // true
```

All our objects link to the same _hello.prototype_ or _goodBye.prototype_ origin. So, our objects ( a, b, c and d ) are not completely separated from one another, but linked to the same origin. So, if I add a method in _hello.prototype_, _a_ and _b_ will have access to it, because Javascript will go up the chain to find it. But, I didn't change anything about _a_ and _b_:

```javascript
// I'm not touching a or b
hello.prototype.sayHowDoYouDo = () => {
  console.log("How do you do?");
};

a.sayHowDoYouDo(); // How do you do?
b.sayHowDoYouDo(); // How do you do?
```

By **NOT** copying objects but linking them, Javascript doesn't need to have the entire object environment carried in each object. It just goes up the chain.

Let's now make the _goodBye.prototype_ a prototype of _hello.prototype_:

```javascript
// Objects not linked yet => Errors
c.sayHowDoYouDo(); // Error: not a function
d.sayHowDoYouDo(); // Error: not a function

// This is a ES6 method. First argument will be the link at the bottom of the prototype chain, the second is the top link.
Object.setPrototypeOf(goodBye.prototype, hello.prototype);

// Now, c and d will look up the chain!
c.sayHowDoYouDo(); // How do you do?
d.sayHowDoYouDo(); // How do you do?
```

## Prototypal inheritance

And that, my dear friends, is the concept of prototypal inheritance. Now, I am not a huge fan of the word _inheritance_ here. It would imply some sort of copying, or parent-child relationship, and Javascript doesn't do that. I have seen the word _delegation_ to describe this, I like it better. Again, Javascript doesn't natively copy objects, it links them to one another.

I see you waiting for some examples:

```javascript
function Mammal(type) {
  this.type = type;
  this.talk = () => {
    console.log("Hello friend");
  };
}

Mammal.prototype.myType = function () {
  return this.type;
};

function Dog(name, type) {
  // This next line makes Mammal a prototype of the Dog object
  Mammal.call(this, type);
  this.name = name;
  this.woof = () => {
    console.log("Woof!");
  };
}

// Link the Dog prototype to the Mammal prototype
Object.setPrototypeOf(Dog.prototype, Mammal.prototype);
//OR
// Dog.prototype = Object.create(Mammal.prototype)

Dog.prototype.myName = function () {
  return this.name;
};

const Joe = new Dog("Joe", "Labrador");

Joe.woof(); // Woof!

// myName() function is in the Dog prototype.
console.log(Joe.myName()); // Joe

// myType is in the Mammal prototype.
// Joe is a Dog instance, and Mammap is a prototype of Dog.
console.log(Joe.myType()); // Labrador

// talk() is a method in the Mammal function, which is a prototype of the Joe object.
Joe.talk(); // Hello friend
```

It also works with objects, obviously. Quick example:

```javascript
const SuperHero = {
  statement: function () {
    return "I am an anonymous superhero";
  },
};

// SuperHero becomes a prototype of Batman.
const Batman = Object.create(SuperHero);

Batman.statement(); // 'I am an anonymous superhero'
```

## Conclusion

Classical inheritance is a parent-child relationship. It goes from top to bottom. Javascript has _prototypal delegation_. Although it _resembles_ the classical inheritance, it's quite different. Objects are linked together, not copied. The references are more from bottom to top.

Prototypes also helps with memory management because you don't need to carry the whole object environment every time you create a new _child_ object. Everything that needs to be in common can exist in a prototype, therefore being referenced only once.

Tell me what you think about this, I hope I've been clear enough.
