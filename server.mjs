import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to fetch Auth Token
app.post('/auth-token', async (req, res) => {
  const tenantId = "e97f9fc7-2bba-4957-bf26-f340d78414b7";
  const clientId = "6bdbbc6f-74d4-42ad-b23d-aa3403871290"; 
  const clientSecret = "2VA8Q~2n6zSi~udNXh_4Fdqm2EP7L27QPleGYb7A"; 

  const scope = "https://analysis.windows.net/powerbi/api/.default";
  const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: scope
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Auth Token');
    }

    const data = await response.json();
    res.json(data); // Send back the auth token to the frontend
  } catch (error) {
    console.error('Error fetching Auth Token:', error);
    res.status(500).json({ error: 'Failed to fetch Auth Token' });
  }
});

// Endpoint to fetch Embed Token
app.post('/embed-token', async (req, res) => {
  const groupId = "49d1c1dc-0da0-4f42-ad72-40543f62dff8";
  const reportId = "15a67320-0aed-4917-b7ce-5c09a3b8bb79";
  const powerBIUrl = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/GenerateToken`;

  // Auth token is sent from the frontend
  const authToken = req.body.authToken;

  try {
    const response = await fetch(powerBIUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ accessLevel: 'View' }) 
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Embed Token');
    }

    const data = await response.json();
    res.json(data); // Send back the embed token and embed URL to the frontend
  } catch (error) {
    console.error('Error fetching Embed Token:', error);
    res.status(500).json({ error: 'Failed to fetch Embed Token' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
