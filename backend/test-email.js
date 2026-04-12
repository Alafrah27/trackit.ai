import { MailWelcome } from "./lib/nodeEmail.js";
import dotenv from "dotenv";
dotenv.config();

const testMail = async () => {
    try {
        console.log("Testing MailWelcome...");
        await MailWelcome("lugya1717@gmail.com", "ali edris", "123456");
        console.log("Success!");
    } catch (e) {
        console.error("MAIL ERROR:", e.message);
    }
};

testMail();
