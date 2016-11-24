在electron上录音,通过websocket发送流到服务器,服务器分出子进程调用ffmepg生成hls的小demo.

准备:
- `npm install` 安装依赖
- 安装 ffmepg

运行:
- `npm start`

生成app:
- `npm run build-darwin`  macOS
- `npm run build-win`  win

运行服务器:
- cd server
- node index
