// src/pages/api/gmail/fetch.js
import { getToken } from 'next-auth/jwt';
import { google } from 'googleapis';

function decodeBase64Url(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString('utf8');
}

function getEmailBody(payload) {
  let bodyData = '';
  if (payload.parts) {
    const plainPart = payload.parts.find(p => p.mimeType === 'text/plain');
    if (plainPart && plainPart.body && plainPart.body.data) {
      bodyData = plainPart.body.data;
    } else {
      const htmlPart = payload.parts.find(p => p.mimeType === 'text/html');
      if (htmlPart && htmlPart.body && htmlPart.body.data) {
        bodyData = htmlPart.body.data;
      }
    }
  } else if (payload.body && payload.body.data) {
    bodyData = payload.body.data;
  }
  return bodyData ? decodeBase64Url(bodyData) : '';
}

export default async function handler(req, res) {
  try {
    const emailCount = parseInt(req.query.count, 10) || 15;

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.accessToken) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token.accessToken });
    const gmail = google.gmail({ version: 'v1', auth });

    const listResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults: emailCount,
    });

    const messages = listResponse.data.messages || [];
    if (messages.length === 0) {
      return res.status(200).json([]);
    }

    const emailPromises = messages.map((message) =>
      gmail.users.messages.get({ userId: 'me', id: message.id })
    );
    const emailResponses = await Promise.all(emailPromises);

    const emails = emailResponses.map((response) => {
      const { id, snippet, payload } = response.data;
      const headers = payload.headers;
      const subject = headers.find((h) => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find((h) => h.name === 'From')?.value || 'Unknown Sender';
      const body = getEmailBody(payload);

      return { id, subject, from, snippet, body };
    });

    res.status(200).json(emails);
  } catch (error) {
    console.log("--- GMAIL FETCH API ERROR ---");
    console.log(error);
    console.log("-----------------------------");
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
}