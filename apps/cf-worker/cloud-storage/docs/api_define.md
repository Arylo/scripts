# API 定义

## POST /api/files/list

### 逻辑流程

1. 判断body 的pwd 是否存在, 不存在则返回400
2. 将pwd md5化后作为value, 转成key`key_<value>`, 使用key在KV 下搜索, 返回string, 若不在则返回404
3. 将string 转成JSON, 转化失败则返回400
4. JSON 的结构为
```
{
  actives: [
    {
      name: "playlist.m3u8",
      displayName: "合集.m3u8",
    },
    {
      name: "1_playlist.m3u8",
      displayName: "第一集.m3u8",
    },
    ...
  ],
}
```
5. 使用`<value>/`这个prefix 从R2 list 中获取列表

### Req

- Body需带上PWD, 结构为
```
{
  "pwd": <string>
}
```

### Res

- 返回header `set-cookie`
- 若正常时, 返回
```
{
  "code": 200,
  "size": <number>, // Data length
  "data": [
    {
      size: <number>,
      name: <string>,
      mime: <string>,
    },
    ...
  ]
}
```

## POST /api/files/file

### 逻辑流程

1. 判断header 的对应cookie 是否存在, 不存在则返回400
2. 将cookie value, 转成key`key_<value>`, 使用key在KV 下搜索, 返回string, 若不在则返回404
3. 将文件存入R2 下的文件夹`<value>/`下, 并补存metadata
```
{
  httpMetadata: {
    contentType: ... // 使用`mime-types`获取
  },
  customMetadata: {
    originalName: ..., // 文件原名
    createdAt: ...,
    updatedAt: ...
  },
}
```

### Req

- 需要附带上cookie
- 需要附带上文件名和文件

## GET /api/files/file/:filepath

### 逻辑流程

1. 判断header 的对应cookie 是否存在, 不存在则返回400
2. 将cookie value, 转成key`key_<value>`, 使用key在KV 下搜索, 返回string, 若不在则返回404
3. 将string 转成JSON, 转化失败则返回400
4. 使用`<value>/<:filepath>`这个prefix 从R2 中获取文件

### Req

- 需要附带上cookie

### Res

- 当没合法cookie 时, 返回403
- 若正常时, 返回从R2 取出的文件
