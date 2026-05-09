import * as amqp from "amqplib";
let connect = null;
export const getConnection = async () => {
    if (!connect) {
        connect = await amqp.connect({
            protocol: "amqp",
            hostname: "10.0.5.134",
            port: "5672",
            username: "admin",
            password: "secret123",
        });
    }

    return connect;
};
