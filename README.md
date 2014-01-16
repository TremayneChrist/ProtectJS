#ProtectJS

Truely private methods on the prototype chain!

###Summary

Many complex objects require complex methods that need to be utilised by the object its self and not from any other external classes. To do this we usually use enclosed functions, blinding any outside classes from them. This works well, however, every time a new instance of the object is created, a new instance of those inclosed functions are also created, which in turn, increases the object's overall size, using more of the machine's memory.

To prevent this we add methods to the prototype chain so that only a single instance of each method is created for all objects. Unfortunately the problem with this is that all methods on the chain are public and can be seen and used by anything, potentially corrupting the object or distorting its values.

ProtectJS extends the object and installs protection checks on private methods. If a private method gets called from outside the object the check would fail and throw an error.

Protection does come at a cost though. On average the time taken to create a protected object is 4-5 times that of an unprotected one. This may seem a lot, however we're talking micro seconds, so creating 10,000 medium sized objects would take around 5ms compared to 1ms.

Although processing time is increased, the amount of memory saved is far greater. Going back to creating 10,000 objects... If you imagine that each object is a particle with physics applied, so each particle will need to check if it's colliding with another one, the direction it's traveling in and how fast it's going etc. These methods do not want to be used by anything but the object its self. If we enclose these methods we would have 10,000 instances of them whereas if we add them to the prototype chain and protect them, yes we use 5 times more compute time, but we've reduced the memory used by those private methods by 10,000 times!


###Pros

1. Enables private methods be be added onto the prototype, keeping object memory to a minimum.

2. Keeps code creation clean and easy to read.

###Cons

1. Creating protected objects is more expensive.

2. Object sizes are increased slightly due to the extra protection that has been added.
