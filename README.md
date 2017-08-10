# io

Promise based HTTP client for the browser and node.js wrapper axios and add jsonp support

## Installing

Using npm:

```bash
$ npm install @npm/io
```

## Test
```bash
//test in browser with karma
$ npm run test
//test in node with mocha
$ npm run node-test
```

## Build
```bash
$ npm run build
```

## Example

Performing a request

```js
io[method](url,data,success,fail,config)
io.get('/user',
  // optional request query data or request data
  {ID: 12345},
  function (data) {
    //handle business success
    console.log(data);
  }, function (error) {
    //handle business fail when code is not false value or server error
    console.log(error)
  })
  .then(function (data) {
    //handle success in promise
    console.log(data);
  })
  .catch(function (error) {
    //handle error in promise
    console.log(error);
    //error.$ is origin error throw by axios
    console.log(error.$);
  },{
    // use application/json with modern api
    emulateJSON:false
  });
```

## config
see <https://github.com/mzabriskie/axios#request-config>
```js
{
    // use application/json with modern api
    emulateJSON:false
}
```

## axios

```
//the axios instance is in io.fetch and origin axios is in io.axios
//if you want to use interceptors
// request interceptor
io.fetch.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// response interceptor
io.fetch.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });

```
## instance
create instance with config
```js
const instance = io.create({
  baseURL:"http://www.analysys.cn",
  emulateJSON:false
})
```
## defaults
set default config in all instance
```js
io.config.emulateJSON = false
```

for more detail see <http://git.analysys.cn/npm/io/tree/master/test>
