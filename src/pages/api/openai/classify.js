// src/pages/api/openai/classify.js
import { ChatOpenAI } from "@langchain/openai";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { emails, apiKey } = req.body;

  if (!emails || !apiKey) {
    return res.status(400).json({ error: 'Missing emails or API key' });
  }

  // Define the function schema for the OpenAI model
  const classificationFunctionSchema = {
    name: "email_classifier",
    description: "Classifies an email into a single category.",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "The category of the email.",
          enum: ["Important", "Promotional", "Social", "Marketing", "Spam", "General"],
        },
      },
      required: ["category"],
    },
  };

  // Initialize the model and parser
  const model = new ChatOpenAI({ apiKey: apiKey, modelName: "gpt-4o" });
  const modelWithFunctions = model.bind({
    functions: [classificationFunctionSchema],
    function_call: { name: "email_classifier" },
  });
  const outputParser = new JsonOutputFunctionsParser();

  // Create the classification chain
  const prompt = ChatPromptTemplate.fromMessages([
    HumanMessagePromptTemplate.fromTemplate(
      `Please classify the following email based on its content.
      From: {from}
      Subject: {subject}
      Snippet: {snippet}

      Consider these categories:
      - Important: Personal or work-related, urgent, requires action.
      - Promotional: Sales, discounts, marketing campaigns.
      - Social: Notifications from social networks, friends, family.
      - Marketing: Newsletters, product announcements.
      - Spam: Unsolicited or unwanted junk mail.
      - General: If none of the above fit.`
    ),
  ]);
  const classificationChain = prompt.pipe(modelWithFunctions).pipe(outputParser);

  try {
    const classificationPromises = emails.map(email => 
      classificationChain.invoke({
        from: email.from,
        subject: email.subject,
        snippet: email.snippet,
      })
    );

    const classifications = await Promise.all(classificationPromises);

    const classifiedEmails = emails.map((email, index) => ({
      ...email,
      category: classifications[index].category || "General",
    }));

    res.status(200).json(classifiedEmails);
  } catch (error) {
    console.error("Error classifying emails:", error);
    res.status(500).json({ error: 'Failed to classify emails. Check your API key and network.' });
  }
}