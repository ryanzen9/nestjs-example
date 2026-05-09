import { getConnection } from "./connection.js";

const connect = await getConnection();
const channel = await connect.createChannel();

const { queue } = await channel.assertQueue("aaa");
channel.prefetch(3); // 每回最多取出三条进行处理

const currentTask = [];
channel.consume(
    queue,
    (msg) => {
        currentTask.push(msg);
        console.log("当前消息内容：", msg);
        console.log("收到消息：", msg.content.toString());
    },
    { noAck: false },
);

// 模拟每 2 s 处理取出一条进行处理， 处理完成后发送 ack 确认消息已处理完成
setInterval(() => {
    const curMsg = currentTask.pop();
    channel.ack(curMsg);
}, 2000);
