# 场景二十三：选择视频文件后可正常播放

**前置条件**：取件成功，分享盘中存在一个视频文件（mimetype 为 `video/*`），文件名已知。

**步骤**：
1. 在文件列表页（`/pan/:code`）点击该视频文件名，跳转至预览页（`/pan/:code/:hash`）。
2. 断言页面主区域渲染出 `<video>` 元素，`src` 指向 `/api/raw/:file_name`。
3. 断言视频元数据加载完成（`readyState >= HAVE_METADATA`，即 `readyState >= 1`）。
4. 断言视频 `duration > 0`（时长可读）。
5. 断言页面不显示「无法预览」之类的降级提示。
