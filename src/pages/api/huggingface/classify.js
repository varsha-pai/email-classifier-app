// src/pages/api/huggingface/classify.js

async function queryHuggingFace(data, apiKey) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Hugging Face API Error:", errorBody);
    // Handle specific Hugging Face errors, like model loading
    if (response.status === 503) {
      throw new Error("The classification model is currently loading. Please try again in a few moments.");
    }
    throw new Error(`Hugging Face API responded with status ${response.status}`);
  }

  const result = await response.json();
  return result;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { emails, apiKey } = req.body;

  if (!emails || !Array.isArray(emails) || !apiKey) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const categories = ["Important", "Promotional", "Social", "Marketing", "Spam", "General"];

  try {
    const classifiedEmails = await Promise.all(
      emails.map(async (email) => {
        const inputText = `Subject: ${email.subject}\n\n${email.snippet}`;
        const hfResponse = await queryHuggingFace(
          {
            inputs: inputText,
            parameters: { candidate_labels: categories },
            options: { wait_for_model: true } // Ask API to wait if model is loading
          },
          apiKey
        );

        const bestCategory = hfResponse.labels[0];
        return { ...email, category: bestCategory };
      })
    );
    res.status(200).json(classifiedEmails);
  } catch (error) {
    console.error("Error in /api/huggingface/classify:", error);
    res.status(500).json({ message: error.message || "An unknown error occurred during classification." });
  }
}