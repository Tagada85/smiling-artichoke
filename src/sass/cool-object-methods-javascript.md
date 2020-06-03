## Introduction

Objects are everywhere in Javascript. EVERYWHERE. In this article, I'll go through some cool methods that you can use on objects. Maybe you'll even learn a thing or two!

## Object.assign

Ok, this one is my favorite. Might be a bit weird to have a favorite object method, but I _love_ it.

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
