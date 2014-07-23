# madcolor

A psychedelic improvement for any webpage.

## How to

### Easy way (html)

Tell madcolor what element you want to target with the `mc` class :

```html
<div class="mc" id="myPsychedelicDiv"></div>
```

Include `madcolor.js` in your html :

```html
<script type="text/javascript" src="madcolor.js"></script>
```

And you're done !

### Programmatic way (javascript)

You can also use `madcolor(el, options)` to active the madcolor effect on that element.
Argument `el` is an HTMLElement and `options` is an object described below.

## Options

It's also possible to pass options to madcolor, either via element attributes (html way) or via an object (javascript way).

Examples :

```html
<div class="mc" mc-color-period="0.5" mc-color-range="180"></div>
```

```javascript
madcolor(myPsychedelicElement, {
	colorPeriod : 0.5,
	colorRange : 180
});
```

### Options list

Attribute name | Object Name | Type | Description
-------------- | ----------- | ---- | -----------
mc-color-period | `colorPeriod` | float / int | how long (in seconds) between two random colors. The longest the smoothest. The shortest the **psychedelic-est** !
mc-display-period | `displayPeriod` | float / int | how long (in seconds) between two `background-color` transitions. This is kind of memory consumming.
mc-list-size | `listSize` | int | the bigger, the smoother transitions will be, but it'll also be more memory-consumming !
mc-show-map | `showMap` | boolean | whether to display a color map in the bottom right corner of the targeted element.
mc-show-hexcode | `showHexCode` | boolean | whether to display the current color code (in hex) in the bottom left corner of the targeted element.
mc-color-range | `colorRange` | int[0-255] | the smaller, the darker the colors will be (useful for changing backgrounds without having to re-think your entire color design ...).