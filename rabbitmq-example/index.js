import * as amqp from "amqplib";

const connect = await amqp.connect({
    protocol: "amqp",
    hostname: "10.0.5.134",
    port: "5672",
    username: "admin",
    password: "secret123",
});
const channel = await connect.createChannel();

// 生产者每 0.5 s 发送一条消息
let i = 1;
setInterval(async () => {
    const msg = "hello" + i;
    console.log("发送消息：", msg);
    await channel.sendToQueue("aaa", Buffer.from(msg));
    i++;
}, 500);
