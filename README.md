<img src="https://www.sendcloud.fr/wp-content/uploads/2021/06/sendcloud-og-image.png" alt="sendcloud logo" />

SendCloud API Nodejs Wrapper
===

This wrapper helps you to easily connect to the SendCloud API.

https://www.sendcloud.fr/

### Documentation

You can check the documentation of sendcloud at [this url](https://docs.sendcloud.sc/ "sendcloud documentation").

### Installation
```bash
npm install @aquilacms/sendcloud
```

### Example

```js
const SendCloud = require('@aquilacms/sendcloud')

const sendCloud = new SendCloud({
    api_key: '<YOUR_API_KEY>',
    api_secret: '<YOUR_API_SECRET>'
})
try {
    const result = await sendCloud.parcels.getParcels()
    console.log(result)
} catch (err) {
    console.error(err)
}
```
