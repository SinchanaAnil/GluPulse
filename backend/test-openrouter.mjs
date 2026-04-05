import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const base64 = "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==";

async function test() {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen/qwen3.6-plus:free",
                messages: [{
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Respond with exactly: OK.' },
                        { type: 'image_url', image_url: { url: `data:image/webp;base64,${base64}` } }
                    ]
                }]
            })
        });
        const data = await response.json();
        fs.writeFileSync('out.json', JSON.stringify(data, null, 2), 'utf8');
        console.log("WROTE TO out.json");
    } catch (e) {
        console.error("Fetch err:", e);
    }
}
test();
