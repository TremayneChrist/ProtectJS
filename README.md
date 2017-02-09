#ProtectJS / Protect JS

[![Build Status](https://travis-ci.org/TremayneChrist/ProtectJS.svg?branch=master)](https://travis-ci.org/TremayneChrist/ProtectJS)

#### Methods/Functions
Adding private methods to an object in JavaScript has always been an awkward thing to do, as JavaScript doesn't exactly support it. Instead, we either place enclosed functions in the constructor, which consumes more memory per object, or, we enclose both the object definition and our private methods inside of a closure.

The latter is a good way to accomplish private methods in JavaScript as it creates truly private methods and doesn't add to the memory consumption. The problem with it is, is that your private methods are separate from the object and your coding style is different compared to public definitions on the prototype.

**ProtectJS** is a library that extends objects you define, to allow you to add all your private methods to the prototype chain. It does this by adding protection checks to all of your methods, any marked with a prepending underscore (_) is treated as a private method.

#### Other properties

As well as methods, JavaScript doesn't exactly support any type of private property. This becomes a problem when dangerous modifications to these properties occur.

Think of complex algorithms - If these could be modified by external sources, their output would be completely invalidated, potentially causing huge implications.


### Examples

In many languages, it is custom to prepend private variables with an underscore (_), so we use this in JavaScript to show that an object should be considered as a private. Obviously this has absolutely no affect to whether it is actually private or not, it's more of a visual reference for a developer.

Let's create a basic object using this approach...

```javascript

// Create the object
function MyObject() {}

// This is our public method
MyObject.prototype.public = function () {
  console.log('PUBLIC method has been called');
};

// This is our private method, using (_)
MyObject.prototype._private = function () {
  console.log('PRIVATE method has been called');
};

// Create an instance of the object
var mo = new MyObject();

// Call its methods
mo.public(); // Pass
mo._private(); // Pass

```
As I stated previously, there is no protection here, so I could easily call the **_private()** method and get a message saying "PRIVATE method has been called".

**Now let's protect the object with ProtectJS!..**

Add ProtectJS into your source, making sure it loads before the code you want to protect.

```html
<head>
    <title>PrivateJS</title>
    <script type="text/javascript" src="ProtectJS/protect.min.js"></script>
    <script type="text/javascript" src="app.js"></script>
</head>
```

Now that ProtectJS is available, we need to use it on the object

```javascript

// Create the object
function MyObject() {}

// This is our public method
MyObject.prototype.public = function () {
  console.log('PUBLIC method has been called');
};

// This is our private method, using (_)
MyObject.prototype._private = function () {
  console.log('PRIVATE method has been called');
};

protect(MyObject); // Protect the object prototype

// Create an instance of the object
var mo = new MyObject();

// Call its methods
mo.public(); // Pass
mo._private(); // Fail

```

ProtectJS assumes that all methods starting with underscores in the prototype are private, and will add protection checks to prevent them from being called outside of the object.

Once protected, the only way to call a private method is by calling it through another method inside the same object.


---

### Pros

1. Enables private methods to be added onto the prototype, keeping object memory to a minimum.

2. Protects your other properties from being modified by external sources.

3. Keeps code creation clean and easy to read.

4. Allows you to define objects in a natural way.

5. Doesn't change your coding style.

6. Protects properties you don't want to be used.


### Cons

1. You have to include the ProtectJS library in your project.
2. Marginal overheads to be considered (Performance tests to come)

---
