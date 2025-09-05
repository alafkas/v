# v
A minimalistic AJAX view engine.

Click [here](https://alafkas.github.io/v/) for a live demo. 

Example 1 (html)
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>v</title>
    <script type="text/javascript" src="v.js"></script>
  </head>
  <body>
    <!-- a native american -->
    <div data-url="/indian"></div>
    
    <!-- a horse -->
    <div data-url="/horse"></div>
    
    <!-- a girl -->
    <div data-url="/girl"></div>

    <script type="text/javascript">
      refreshAll();
    </script>
  </body>
</html>
```
Example 2 (javascript)
```javascript
const div = document.createElement('div');
document.body.appendChild(div);
  
div.v('/users/1');
div.refresh();
```
