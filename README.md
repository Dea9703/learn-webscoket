# WebSocket

## 一. 概览

WebSocket的出现，使得浏览器具备了实时双向通信的能力。本文由浅入深，介绍了WebSocket如何建立连接、交换数据的细节，以及数据帧的格式。此外，还简要介绍了针对WebSocket的安全攻击，以及协议是如何抵御类似攻击的。

## 二. 什么是WebScoket

HTML5开始提供的一种浏览器与服务器进行全双工通讯的网络技术，属于应用层协议。它基于TCP传输协议，并复用HTTP的握

对大部分web开发者来说，上面这段描述有点枯燥，其实只要记住几点：

1. WebSocket可以在浏览器里使用
2. 支持双向通信
3. 使用很简单

### **1. 有哪些优点**

说到优点，这里的对比参照物是HTTP协议，概括地说就是：支持双向通信，更灵活，更高效，可扩展性更好。

1. 支持双向通信，实时性更强。

2. 更好的二进制支持。

3. 较少的控制开销。连接创建后，ws客户端、服务端进行数据交换时，协议控制的数据包头部较小。在不包含头部的情况下，服务端到客户端的包头只有2~10字节（取决于数据包长度），客户端到服务端的的话，需要加上额外的4字节的掩码。而HTTP协议每次通信都需要携带完整的头部。

4. 支持扩展。ws协议定义了扩展，用户可以扩展协议，或者实现自定义的子协议。（比如支持自定义压缩算法等）

对于后面两点，没有研究过WebSocket协议规范的同学可能理解起来不够直观，但不影响对WebSocket的学习和使用。

### 2. 需要学习哪些东西

对网络应用层协议的学习来说，最重要的往往就是连接建立过程、数据交换教程。当然，数据的格式是逃不掉的，因为它直接决定了协议本身的能力。好的数据格式能让协议更高效、扩展性更好。

下文主要围绕下面几点展开：

1. 如何建立连接
2. 如何交换数据
3. 数据帧格式
4. 如何维持连接

## 三. 入门例子

在正式介绍协议细节前，先来看一个简单的例子，有个直观感受。例子包括了WebSocket服务端、WebSocket客户端（网页端）。完整代码可以在 这里 找到。

这里服务端用了ws这个库。相比大家熟悉的socket.io，ws实现更轻量，更适合学习的目的。

### 1. 服务端

代码如下，监听8080端口。当有新的连接请求到达时，打印日志，同时向客户端发送消息。当收到到来自客户端的消息时，同样打印日志。

~~~javascript
var app = require('express')();
var server = require('http').Server(app);
var WebSocket = require('ws');

var wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('server: receive connection.');
    
    ws.on('message', function incoming(message) {
        console.log('server: received: %s', message);
    });

    ws.send('world');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000);
~~~

### 2. 客户端

代码如下，向8080端口发起WebSocket连接。连接建立后，打印日志，同时向服务端发送消息。接收到来自服务端的消息后，同样打印日志。

~~~javascript
<script>
  var ws = new WebSocket('ws://localhost:8080');
  ws.onopen = function () {
    console.log('ws onopen');
    ws.send('from client: hello');
  };
  ws.onmessage = function (e) {
    console.log('ws onmessage');
    console.log('from server: ' + e.data);
  };
</script>
~~~

### 3. 运行结果

可分别查看服务端、客户端的日志，这里不展开。

服务端输出：

```bash
server: receive connection.
server: received hello
```

客户端输出：

```bash
client: ws connection is open
client: received world
```