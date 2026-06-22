import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  app.get('/api/auth/facebook/url', (req, res) => {
    const redirectUri = `${req.protocol}://${req.get('host')}/auth/callback`;
    if (!process.env.FACEBOOK_CLIENT_ID) {
      // Return a simulated oauth page for preview purposes when no client ID is set
      return res.json({ url: `${req.protocol}://${req.get('host')}/api/auth/facebook/mock?redirect_uri=${encodeURIComponent(redirectUri)}` });
    }
    const params = new URLSearchParams({
      client_id: process.env.FACEBOOK_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'public_profile',
    });
    res.json({ url: `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}` });
  });

  app.get('/api/auth/facebook/mock', (req, res) => {
    const redirectUri = req.query.redirect_uri as string;
    res.send(`
      <html>
        <head>
          <style>
            body { font-family: sans-serif; background: #f0f2f5; display: flex; align-items: center; justify-center: center; height: 100vh; margin: 0; }
            .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); width: 400px; max-width: 90%; margin: auto; text-align: center; }
            .btn { background: #0866ff; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px; cursor: pointer; margin-top: 20px; width: 100%; }
            .btn:hover { background: #005ce6; }
            h2 { color: #1c1e21; margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Simulate Facebook Login</h2>
            <p>Because no <b>FACEBOOK_CLIENT_ID</b> is set in your environment variables, we are intercepting the login flow to simulate success.</p>
            <button class="btn" onclick="window.location.href='${redirectUri}?code=mock_oauth_code'">Continue as User</button>
          </div>
        </body>
      </html>
    `);
  });

  app.get('/auth/callback', (req, res) => {
    const { code } = req.query;
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', code: '${code}' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  });

  app.post('/api/analyze-owner', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json({ analysis: "Analysis requires a Gemini API key to be set up." });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const { animalTraits } = req.body;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Based on a playful analysis of a Facebook profile, compare the owner to their pet whose traits are: ${JSON.stringify(animalTraits)}. Provide a 2-sentence fun comparison. Note who needs more improvement: the owner or the animal?`,
      });

      res.json({ analysis: response.text });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to analyze owner data." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
