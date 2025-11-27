import crypto from "crypto";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const WEBHOOK_SECRET = "75hitjx828tr8kotpwon"; // <-- Your Webhook Secret Key

    const signature = req.headers["x-webhook-signature"];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(body)
        .digest("hex");

    // Check signature match
    if (signature !== expectedSignature) {
        return res.status(401).json({ error: "Invalid signature" });
    }

    const event = req.body;

    console.log("🔥 Webhook Received:", event);

    if (event?.data?.order?.order_status === "PAID") {
        console.log("✅ Payment SUCCESS:", event.data.order.order_id);
    } else {
        console.log("❌ Payment FAILED or PENDING");
    }

    return res.status(200).json({ status: "OK" });
}
