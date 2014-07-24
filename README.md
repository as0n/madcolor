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

Attribute name | Object Name | Type | Default | Description
-------------- | ----------- | ---- | ------- | -----------
mc-color-period | `colorPeriod` | float / int | 2 | Time (in seconds) between two random colors. The longest the smoothest.
mc-display-period | `displayPeriod` | float / int | 0.2 | Time (in seconds) between two display ticks (`background-color` transition). This should always be smaller than `displayPeriod` (by a factor of 2 or 3 at least), but it can be increased to reduce lag.
mc-list-size | `listSize` | int | 5 | Number of point for which to compute the color path (degree of the lagrange polynomial). It can be reduced to increase efficiency. Prefer odd numbers.
mc-show-map | `showMap` | boolean | true | Wether to display a color map in the bottom right corner of the targeted element.
mc-show-hexcode | `showHexCode` | boolean | true | Whether to display the current color code (in hex) in the bottom left corner of the targeted element.
mc-color-range-max | `colorRangeMax` | int[0-255] | 255 | The maximum value for the 3 components (RGB) of the colors. You can adjust this option and the next to generate colors within a certain range of lightness. Can be useful if you want to stick to a pre-existing webdesign.
mc-color-range-min | `colorRangeMin` | int[0-255] | 0 | The minimum value for the 3 components (RGB) of the colors.