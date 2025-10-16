import express from 'express';
import Thread from '../models/thread.js';
import getAPIresponse from '../utils/ollama.js';

const router = express.Router();

//Test Route
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Test Thread",
        });
        const response = await thread.save();
        res.send(response);
    } catch (error) {
        console.error("Error creating thread:", error);
        res.status(500).json({error: "Server error"});
    }
});



router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find().sort({ updatedAt: -1 });
        res.json(threads);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});



router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId });
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.message);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});



router.delete("/delete/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread=await Thread.findOneAndDelete({ threadId });
        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.status(200).json({ message: "Thread deleted successfully" }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
})

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "threadId and message are required" });
    }

    try {
        // Find existing thread
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            // Create new thread instance without overwriting the model
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: 'user', content: message }]  // Make sure 'content' matches schema
            });
        } else {
            // Add user message to existing thread
            thread.messages.push({ role: 'user', content: message });
        }

        // Get assistant reply
        const assistantReply = await getAPIresponse(message);
        console.log("Assistant Reply:", assistantReply);

        // Add assistant reply to thread
        thread.messages.push({ role: 'assistant', content: assistantReply });
        thread.updatedAt = Date.now();

        // Save the thread
        await thread.save();

        // Respond to client
        res.json({ reply: assistantReply });

    } catch (error) {
        console.error("Error in /chat route:", error);
        res.status(500).json({ error: error.message || "Server error" });
    }
});


export default router;