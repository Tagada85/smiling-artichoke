## Object.assign

Is it weird to love a object method? I have to admit that this is one of my favorite to use.

Object.assign takes a target object, and one or several source objects. The method takes all the values from the source objects and copies them into the source object.

```javascript
let target = {};
let source1 = {
  name: "Damien",
};
let source2 = {
  age: 28,
};

Object.assign(target, source1, source2);

// target => { name: 'Damien', age: 28 }
```

Note that Object.assign modifies the target object. It only copies enumerable and own properties.

TODO: Explain copying only enumerable and own properties, DEEP clone warning

TODO: SHow merging objects when all obejcts have properties

TODO: Show when properties override each other

TODO: Not supported in IE

## Object.create

Object.create creates a _new_ object. It takes a prototype as its first argument. The second argument, optional, can be used to add properties to the newly created object.

_Note: I've written an article about prototypes in Javascript if you are not familiar with them._

```javascript
let newObj = Object.create(Object.prototype);
// newObj => {}
```

We created above a new object and we gave it _Object.prototype_ as a its prototype. Every object has this prototype. The code above is similar to this:

```javascript
let newObject = Object.create(null);
// newObj => {}
```

Let's see how you could use _Object.create_ with another prototype:

```javascript
//TODO: Create with a prototype
```
