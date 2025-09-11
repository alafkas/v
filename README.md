# v
A minimalistic AJAX view engine.

Click [here](https://alafkas.github.io/v/?greeting=hello) for a live demo. 

Example 1 (HTML)
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>v</title>
    <link rel="stylesheet" href="v.css" />
    <script type="text/javascript" src="v.js"></script>
  </head>
  <body>
    <!-- a native american -->
    <div data-url="indian?name=Geronimo"></div>
    
    <!-- a horse -->
    <div data-url="horse"></div>
    
    <!-- a girl -->
    <div data-url="girl"></div>

    <script type="text/javascript">
      refreshAll(() => {
        console.log('Page loaded!');
      });
    </script>
  </body>
</html>
```
Example 2 (JavaScript)
```javascript
const div = document.createElement('div');
document.body.appendChild(div);
  
div.v('/users');
div.setParam('userId', 1);
div.refresh(() => {
  console.log('User loaded!');
});
```
To play around locally with v you can download it and run
```
python -m http.server
```
in the directory v lies in.
