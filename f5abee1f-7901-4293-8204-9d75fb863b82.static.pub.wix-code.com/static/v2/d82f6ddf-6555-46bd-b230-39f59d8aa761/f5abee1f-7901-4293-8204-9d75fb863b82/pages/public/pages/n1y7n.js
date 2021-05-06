// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world

$w.onReady(function() {
    // Write your JavaScript here

    // To select an element by ID use: $w("#elementID")

    // Click "Preview" to run your code
});

/**
*	Adds an event handler that runs when the mouse pointer is moved
 onto the element.

> **Deprecation note:** The $w parameter of event handlers is being deprecated. To get
 a scoped selector for working with elements in repeater items, use the [$w.at()]($w.html#at) function
 and pass it the context property of the event parameter: `$item = $w.at(event.context)`. To learn more, see
 [here](https://www.wix.com/velo/forum/wix-tips-and-updates/removal-of-the-w-parameter-from-event-handlers).

 You can also [define an event handler using the Properties and Events panel](https://support.wix.com/en/article/velo-reacting-to-user-actions-using-events).
*	 @param {$w.MouseEvent} event
*/
export function b1_mouseIn(event) {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    $w('#c1').show()
}

/**
*	Adds an event handler that runs when the mouse pointer is moved
 off of the element.

 > **Deprecation note:** The $w parameter of event handlers is being deprecated. To get
 a scoped selector for working with elements in repeater items, use the [$w.at()]($w.html#at) function
 and pass it the context property of the event parameter: `$item = $w.at(event.context)`. To learn more, see
 [here](https://www.wix.com/velo/forum/tips-tutorials-examples/removal-of-the-w-parameter-from-event-handlers).

 You can also [define an event handler using the Properties and Events panel](https://support.wix.com/en/article/velo-reacting-to-user-actions-using-events).
*	 @param {$w.MouseEvent} event
*/
export function b1_mouseOut(event) {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    $w('#c1').hide()
}



/**
*	Adds an event handler that runs when the mouse pointer is moved
 onto the element.

> **Deprecation note:** The $w parameter of event handlers is being deprecated. To get
 a scoped selector for working with elements in repeater items, use the [$w.at()]($w.html#at) function
 and pass it the context property of the event parameter: `$item = $w.at(event.context)`. To learn more, see
 [here](https://www.wix.com/velo/forum/wix-tips-and-updates/removal-of-the-w-parameter-from-event-handlers).

 You can also [define an event handler using the Properties and Events panel](https://support.wix.com/en/article/velo-reacting-to-user-actions-using-events).
*	 @param {$w.MouseEvent} event
*/
export function b2_mouseIn(event) {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    $w('#c2').show()
}

/**
*	Adds an event handler that runs when the mouse pointer is moved
 off of the element.

 > **Deprecation note:** The $w parameter of event handlers is being deprecated. To get
 a scoped selector for working with elements in repeater items, use the [$w.at()]($w.html#at) function
 and pass it the context property of the event parameter: `$item = $w.at(event.context)`. To learn more, see
 [here](https://www.wix.com/velo/forum/tips-tutorials-examples/removal-of-the-w-parameter-from-event-handlers).

 You can also [define an event handler using the Properties and Events panel](https://support.wix.com/en/article/velo-reacting-to-user-actions-using-events).
*	 @param {$w.MouseEvent} event
*/
export function b2_mouseOut(event) {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    $w('#c2').hide()
}

/**
*	Adds an event handler that runs when the mouse pointer is moved
 onto the element.

> **Deprecation note:** The $w parameter of event handlers is being deprecated. To get
 a scoped selector for working with elements in repeater items, use the [$w.at()]($w.html#at) function
 and pass it the context property of the event parameter: `$item = $w.at(event.context)`. To learn more, see
 [here](https://www.wix.com/velo/forum/wix-tips-and-updates/removal-of-the-w-parameter-from-event-handlers).

 You can also [define an event handler using the Properties and Events panel](https://support.wix.com/en/article/velo-reacting-to-user-actions-using-events).
*	 @param {$w.MouseEvent} event
*/
export function b3_mouseIn(event) {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    $w('#c3').show()
}

/**
*	Adds an event handler that runs when the mouse pointer is moved
 off of the element.

 > **Deprecation note:** The $w parameter of event handlers is being deprecated. To get
 a scoped selector for working with elements in repeater items, use the [$w.at()]($w.html#at) function
 and pass it the context property of the event parameter: `$item = $w.at(event.context)`. To learn more, see
 [here](https://www.wix.com/velo/forum/tips-tutorials-examples/removal-of-the-w-parameter-from-event-handlers).

 You can also [define an event handler using the Properties and Events panel](https://support.wix.com/en/article/velo-reacting-to-user-actions-using-events).
*	 @param {$w.MouseEvent} event
*/
export function b3_mouseOut(event) {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    $w('#c3').hide()
}