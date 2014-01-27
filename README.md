#ProtectJS

Truly private methods on the prototype chain!

###Summary

Many complex objects require complex methods that need to be utilised by the object its self and not from any other external classes. To do this we usually use enclosed functions, blinding any outside classes from them. This works well, however, every time a new instance of the object is created, a new instance of those enclosed functions are also created, which in turn, increases the object's overall size, using more of the machine's memory.

To prevent this we add methods to the prototype chain so that only a single instance of each method is created for all objects. Unfortunately the problem with this is that all methods on the chain are public and can be seen and used by anything, potentially corrupting the object or distorting its values.

ProtectJS extends the object and installs protection checks on private methods. If a private method gets called from outside the object the check would fail and throw an error.

Protection does come at a cost though. On average the time taken to create a protected object is 4-5 times that of an unprotected one. This may seem a lot, however we're talking microseconds, so creating 10,000 medium sized objects would take around 5ms compared to 1ms.

Although processing time is increased, the amount of memory saved is far greater. Going back to creating 10,000 objects... If you imagine that each object is a particle with physics applied, so each particle will need to check if it's colliding with another one, the direction it's traveling in and how fast it's going etc. These methods do not want to be used by anything but the object its self. If we enclose these methods we would have 10,000 instances of them whereas if we add them to the prototype chain and protect them, yes we use 5 times more compute time, but we've reduced the memory used by those private methods by 10,000 times!


###Pros

1. Enables private methods to be added onto the prototype, keeping object memory to a minimum.

2. Keeps code creation clean and easy to read.

###Cons

1. Creating protected objects is more expensive.

2. Object sizes are increased slightly due to the extra protection that has been added.


---

###Example

In many languages, it is custom to prepend private variables with an underscore (_), so we use this in JavaScript to show that an object should be considered as a private. Obviously this has absolutely no affect to whether it is actually private or not, it's more of a visual reference for a developer.

Let's create a basic object using this approach...

```javascript

// Create the object
function MyObject() {}

// Add methods to the prototype
MyObject.prototype = {

  // This is our public method
  public: function () {
    console.log('PUBLIC method has been called');
  },

  // This is our private method, using (_)
  _private: function () {
    console.log('PRIVATE method has been called');
  }
}

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

Now that ProtectJS is available, we need to use it on the object. To do this we need to change the way it is built by wrapping it in a function to return the protected result...

```javascript

var MyObject = (function () {

  // Create the object
  function MyObject() {}

  // Add methods to the prototype
  MyObject.prototype = {

    // This is our public method
    public: function () {
      console.log('PUBLIC method has been called');
    },

    // This is our private method, using (_)
    _private: function () {
      console.log('PRIVATE method has been called');
    }
  }

  return protect(MyObject);

})();

// Create an instance of the object
var mo = new MyObject();

// Call its methods
mo.public(); // Pass
mo._private(); // Fail

```

ProtectJS assumes that all methods starting with underscores in the prototype are private, and will add protection checks to prevent them from being called outside of the object.

Once protected, the only way to call a private method is by calling it through another method inside the same object.


---

ProtectJS is still in its early stages so please help out by logging any issues you find, and also any feature requests too.

Have fun!
