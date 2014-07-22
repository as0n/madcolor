# madcolor

A psychedelic improvement for any webpage.

## How to

Include `madcolor.js` in your html :

```html
<script type="text/javascript" src="madcolor.js"></script>
```

And call `madcolor()` on any HTMLElement you want !

```javascript
madcolor(document.getElementById("myPsychedelicDiv"));
```

## Options

You can also specify various options using :

```javascript
madcolor(element, {
	colorPeriod : 10,
	[...]
});
```

 - `colorPeriod` (float/int) : how long (in seconds) between two random colors. The longest the smoothest. The shortest the **psychedelic-est** !
 - `displayPeriod` (float/int) : how long (in seconds) between two `background-color` transitions. This is kind of memory consumming.
 - `listSize` (int) : the bigger, the smoother transitions will be, but it'll also be more memory-consumming !
 - `showMap` (boolean) : whether to display a color map in the bottom right corner of the targeted element.
 - `showHexCode` (boolean) : whether to display the current color code (in hex) in the bottom left corner of the targeted element.
 - `colorRange` (int[0-255]) : the smaller, the darker the colors will be (useful for changing backgrounds without having to re-think your entire color design ...).