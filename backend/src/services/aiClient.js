import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL_URL =
  "https://router.huggingface.co/models/mistralai/Ministral-3-3B-Instruct-2512";

// Article topics for variety
const topics = [
  "The Future of Artificial Intelligence",
  "Sustainable Technology and Green Computing",
  "Cybersecurity Best Practices",
  "Cloud Computing Trends",
  "Web Development Modern Practices",
  "Machine Learning in Healthcare",
  "Blockchain Technology Applications",
  "Internet of Things (IoT) Revolution",
  "Quantum Computing Explained",
  "DevOps and CI/CD Pipelines",
  "Mobile App Development Trends",
  "Data Science and Analytics",
  "Virtual Reality and Augmented Reality",
  "Software Architecture Patterns",
  "API Design Best Practices",
];

async function generateWithHuggingFace(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(
        MODEL_URL,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 60000, // 60 second timeout
        }
      );

      if (
        response.data &&
        response.data[0] &&
        response.data[0].generated_text
      ) {
        return response.data[0].generated_text;
      }
    } catch (error) {
      console.error(
        `Attempt ${i + 1} failed:`,
        error.response?.data || error.message
      );

      if (error.response?.status === 503 && i < retries - 1) {
        // Model is loading, wait and retry
        console.log(`Model is loading, waiting 20 seconds before retry...`);
        await new Promise((resolve) => setTimeout(resolve, 20000));
        continue;
      }

      if (i === retries - 1) {
        throw error;
      }
    }
  }
}

export async function generateArticle() {
  if (!HUGGINGFACE_API_KEY) {
    throw new Error("HUGGINGFACE_API_KEY is not set in environment variables");
  }

  // Pick a random topic
  const topic = topics[Math.floor(Math.random() * topics.length)];

  console.log(`📝 Generating article about: "${topic}"`);

  const prompt = `Write a detailed, informative blog article about "${topic}". 

The article should be well-structured with an introduction, main body with key points, and a conclusion. Make it engaging and educational for tech enthusiasts.

Article:`;

  try {
    const content = await generateWithHuggingFace(prompt);

    // Clean up the content
    const cleanContent = content.trim();

    return {
      title: topic,
      content: cleanContent,
      author: "AI Blog Generator",
    };
  } catch (error) {
    console.error("Error generating article:", error.message);

    // Fallback content if API fails
    return {
      title: topic,
      content: `This is an automatically generated article about ${topic}.\n\nDue to API limitations, this is a placeholder article. In production, this would contain AI-generated content about ${topic}, discussing its importance, current trends, and future implications in the technology industry.\n\nKey points would include:\n- Overview and background\n- Current state and trends\n- Challenges and opportunities\n- Future outlook\n- Practical applications\n\nThis article serves as a demonstration of the auto-generation system.`,
      author: "AI Blog Generator (Fallback)",
    };
  }
}

export default { generateArticle };
