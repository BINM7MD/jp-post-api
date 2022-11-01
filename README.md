

# JP Post Unoffical API

![](https://www.post.japanpost.jp/assets/img/common/img_siteid-bg_en.png)




### Introduction
                
----

```javascript
const JPost = require("./jp");
var api = new JPost("1xxxxxxxxxxx");
(async () => {
    try {
     var Tracking = await api.getTracking();
     console.log(Tracking);
    } catch (err) {
      console.error(err);
    }
 })();
```
### Data Filtering 
                
----
```javascript
var Tracking = await api.getTracking();
var Package = Tracking[0].split("|");
console.log(`Date ${Package[0]} : Shipping Tracking Record ${Package[1]} Office : ${Package[2]}`);
```
### Installation
                
----
`npm install jp-post`
