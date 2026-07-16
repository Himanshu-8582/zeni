import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";
import {
  Annotation,
  MemorySaver,
  MessagesAnnotation,
  StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

// Web Search Tool
import { TavilySearch } from "@langchain/tavily";

dotenv.config();



const tool = new TavilySearch({
  maxResults: 5,
  topic: "general",
  includeDomains: [],
  excludeDomains: [],
});

const tools = [tool];
const toolNode = new ToolNode(tools);

const memorySaver = new MemorySaver();

const shouldContinue = async (state) => {
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage.tool_calls?.length) {
    return "tools";
  } else {
    return "__end__";
  }
};

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile", // It auto detects the api key from the environment variable GROQ_API_KEY
  temperature: 0.7, // Tone of the response if tem is low it will be more factual and if it is high it will be more creative
  maxTokens: 1000, // Maximum number of tokens in the response
  maxRetries: 3, // Maximum number of retries in case of failure
}).bindTools(tools);

const callLLM = async (state) => {
  // console.log("State : ", state);

  const response = await llm.invoke([
    {
      role: "system",
      content:
        "You are Zeni, a helpful AI assistant.You have access to tools.Whenever the user asks about current events, people, companies,or information that requires the internet, use the Tavily Search tool.Otherwise answer normally.",
    },
    ...state.messages,
  ]);

  return { messages: [response] };
};

// We use Message Annotation Instead of custom State
const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callLLM)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .compile({ checkpointer: memorySaver });




const getAPIresponse = async (prompt,threadId) => {
  try {
    const response = await graph.invoke(
      {
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        configurable: { thread_id: threadId },
      },
    );

    // console.log(response.messages);
    return response.messages[response.messages.length - 1].content;
  } catch (error) {
    console.error("Error connecting to API:", error);
    throw error; // let the caller handle it
  }
};

export default getAPIresponse;
