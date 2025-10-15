

// const getAPIresponse = async (prompt) => {
//     try {
//     // const { prompt } = req.body; // get prompt from client
//     // if (!prompt) {
//     //   return res.status(400).json({ error: "Prompt is required" });
//     // }

//     const response = await fetch("http://localhost:11434/api/generate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//           model: "llama2",
//           messages: [{
//               role: "user",
//               message: prompt
//           }],
//           stream: true, // streaming mode
//       }),
//     });

//     let finalResponse = "";

//     // Node.js readable stream
//     response.body.on("data", chunk => {
//       const lines = chunk.toString().split("\n");
//       lines.forEach(line => {
//         if (line.trim()) {
//           try {
//             const parsed = JSON.parse(line);
//             if (parsed.response) finalResponse += parsed.response;
//           } catch (e) {
//             // ignore non-JSON lines
//           }
//         }
//       });
//     });

//     response.body.on("end", () => {
//     //   console.log(finalResponse);
//       res.json({ prompt, reply: finalResponse }); // send full string after stream ends
//     });

//     response.body.on("error", err => {
//       console.error("Stream error:", err);
//       res.status(500).send("Error reading stream from Ollama API");
//     });
//     return finalResponse;

//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Error connecting to Ollama API");
//   }


// }

// export default getAPIresponse;



const getAPIresponse = async (prompt) => {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama2",
        messages: [{ role: "user", message: prompt }],
        stream: true, // streaming mode
      }),
    });

    // ---- FIXED PART ----
    const reader = response.body.getReader(); // ✅ use getReader()
    const decoder = new TextDecoder();
    let finalResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) finalResponse += parsed.response;
          } catch (e) {
            // ignore invalid JSON
          }
        }
      }
    }

    return finalResponse; // ✅ return the data

  } catch (error) {
    console.error("Error connecting to Ollama API:", error);
    throw error; // let the caller handle it
  }
};

export default getAPIresponse;
