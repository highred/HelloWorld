
import React from 'react';
import type { Step } from './types';
import CodeBlock from './components/CodeBlock';
import { DatabaseIcon } from './components/icons/DatabaseIcon';
import { ServerIcon } from './components/icons/ServerIcon';
import { BrowserIcon } from './components/icons/BrowserIcon';
import { RocketIcon } from './components/icons/RocketIcon';

const backendPackageJson = `{
  "name": "hello-world-backend",
  "version": "1.0.0",
  "description": "Simple backend for the full-stack tutorial",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.43.4",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  }
}`;

const backendIndexJs = `import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Initialize Express app
const app = express();
const port = process.env.PORT || 10000; // Render sets the PORT env var

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Crucial check for credentials
if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Supabase URL and Key must be provided in environment variables.");
  // We don't exit here in a serverless env, but we log the critical error.
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// API endpoint to get the message
app.get('/api/hello', async (req, res) => {
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Server configuration error: Supabase credentials are missing.' });
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('text')
      .eq('id', 1)
      .single(); 

    if (error) {
      console.error('Supabase error:', error.message);
      return res.status(500).json({ error: 'Failed to fetch from database.', details: error.message });
    }

    if (data) {
      res.json({ message: data.text });
    } else {
      res.status(404).json({ error: 'Message with ID 1 not found.' });
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
    console.error('Server error:', errorMessage);
    res.status(500).json({ error: 'An unexpected server error occurred.', details: errorMessage });
  }
});

// A root endpoint to confirm the server is running
app.get('/', (req, res) => {
  res.send('Backend server is alive!');
});

// Start the server
app.listen(port, () => {
  console.log(\`Server is running on port \${port}\`);
});
`;

const createTableSql = `CREATE TABLE messages (
  id BIGINT PRIMARY KEY,
  text TEXT
);`;

const insertDataSql = `INSERT INTO messages (id, text)
VALUES (1, 'Hello World');`;


export const TUTORIAL_STEPS: Step[] = [
  {
    title: 'Part 1: The Database (Supabase)',
    icon: <DatabaseIcon />,
    content: (
      <div className="space-y-4">
        <p>First, we'll set up a powerful, free PostgreSQL database with Supabase.</p>
        <ol className="list-decimal list-inside space-y-3 pl-4">
          <li>Navigate to <a href="https://database.new" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">database.new</a> to create a new Supabase project.</li>
          <li>Give your project a name and a strong password. Save this password somewhere safe!</li>
          <li>Once your project is ready, go to the <span className="font-semibold text-white">SQL Editor</span> in the left sidebar.</li>
          <li>Copy and run the following SQL to create our `messages` table:</li>
        </ol>
        <CodeBlock code={createTableSql} language="sql" />
        <ol className="list-decimal list-inside space-y-3 pl-4" start={5}>
          <li>Now, run this SQL to insert our "Hello World" message into the table:</li>
        </ol>
        <CodeBlock code={insertDataSql} language="sql" />
        <ol className="list-decimal list-inside space-y-3 pl-4" start={6}>
            <li>
                Finally, let's get your API credentials. This is a common place to get tripped up, so follow carefully!
                <ol className="list-[lower-alpha] list-inside space-y-2 mt-2 pl-4">
                    <li>In the Supabase dashboard, click on <span className="font-semibold text-white">Project Settings</span> (the gear icon ⚙️ in the bottom-left sidebar).</li>
                    <li>In the settings menu, click on <span className="font-semibold text-white">Data API</span>. This is the correct page!</li>
                </ol>
                 <div className="p-3 my-2 rounded-lg bg-red-900/30 border border-red-500/50">
                    <p className="font-bold text-red-300">Important!</p>
                    <p className="text-red-200">You are on the correct page. Do <span className="font-bold">not</span> go to the "Database" settings page; the connection strings there (starting with <code className="font-mono text-sm">postgresql://</code>) are incorrect for this tutorial.</p>
                </div>
                On the <span className="font-semibold text-white">Data API</span> page, you'll find and copy two values for your backend. The page has two main sections:
                <div className="space-y-3 mt-3">
                  <div className="bg-base-300 p-3 rounded-md">
                    <p className="font-semibold text-white">1. Project URL</p>
                    <p className="text-sm text-content">Located at the <span className="font-bold">top of the page</span>. Copy this value.</p>
                  </div>
                  <div className="bg-base-300 p-3 rounded-md">
                    <p className="font-semibold text-white">2. Project API Key</p>
                    <p className="text-sm text-content">Below the URL, find the "Project API keys" section and copy the key labeled `anon` and `public`.</p>
                  </div>
                </div>
                Keep this browser tab open. You'll need to copy these in the next part.
            </li>
        </ol>
      </div>
    ),
  },
  {
    title: 'Part 2: The Backend (Node.js & Render)',
    icon: <ServerIcon />,
    content: (
      <div className="space-y-4">
        <p>Now, let's create a simple server to communicate with our database and serve the data to our frontend.</p>
        <ol className="list-decimal list-inside space-y-3 pl-4">
          <li>Create a new folder on your computer named `hello-world-backend`.</li>
          <li>Inside that folder, create a file named `package.json` and paste this content:</li>
        </ol>
        <CodeBlock code={backendPackageJson} language="json" />
        <ol className="list-decimal list-inside space-y-3 pl-4" start={3}>
          <li>Create another file named `index.js` and paste this server code:</li>
        </ol>
        <CodeBlock code={backendIndexJs} language="javascript" />
        <ol className="list-decimal list-inside space-y-3 pl-4" start={4}>
            <li>Create a new, empty repository on your <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">GitHub</a> account.</li>
            <li>
                Push your new folder to GitHub using the command line. This is a crucial developer skill!
                <div className="p-3 my-2 rounded-lg bg-yellow-900/30 border border-yellow-500/50">
                    <p className="font-bold text-yellow-300">Prerequisite:</p>
                    <p className="text-yellow-200">You must have <a href="https://git-scm.com/downloads" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Git</a> installed on your computer for these commands to work.</p>
                </div>
                <p className="mt-2">Open your terminal (e.g., Command Prompt, PowerShell, or Terminal on Mac) and run the following commands one by one inside your `hello-world-backend` folder.</p>
                <ol className="list-disc list-inside space-y-2 mt-4 pl-4">
                    <li>
                        <p>Initialize a new Git repository. This turns your folder into a Git project.</p>
                        <CodeBlock code={'git init'} language="bash" />
                    </li>
                    <li>
                        <p>Add all your files to be tracked by Git.</p>
                        <CodeBlock code={'git add .'} language="bash" />
                    </li>
                    <li>
                        <p>Create your first "commit" (a snapshot or save-point of your code).</p>
                        <CodeBlock code={'git commit -m "Initial backend setup"'} language="bash" />
                    </li>
                    <li>
                        <p>Rename the default branch to `main`. Older versions of Git used `master`, but `main` is the new standard.</p>
                        <CodeBlock code={'git branch -M main'} language="bash" />
                    </li>
                    <li>
                        <p>Connect your local folder to the empty repository you created on GitHub. Get the URL by going to your GitHub repo page, clicking the green "&lt;&gt; Code" button, and copying the HTTPS URL.</p>
                        <CodeBlock code={'git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git'} language="bash" />
                    </li>
                    <li>
                        <p>Push your code up to GitHub.</p>
                        <CodeBlock code={'git push -u origin main'} language="bash" />
                    </li>
                </ol>
                 <p className="mt-2">After running these commands, refresh your GitHub page. Your files will be there!</p>
              </li>
            <li>Sign in to <a href="https://render.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Render</a> and create a <span className="font-semibold text-white">New Web Service</span>.</li>
            <li>Connect the GitHub repository you just created.</li>
            <li>Render will auto-detect most settings. Ensure the <span className="font-semibold text-white">Start Command</span> is `node index.js`.</li>
            <li>
                Before deploying, go to the <span className="font-semibold text-white">Environment</span> tab. This is critical!
                <br/>
                Add two <span className="font-semibold text-white">Environment Variables</span>:
                <ul className="list-disc list-inside mt-2 pl-6 bg-base-300 p-3 rounded-md">
                    <li>Key: `SUPABASE_URL`, Value: Your Project URL from Supabase.</li>
                    <li>Key: `SUPABASE_KEY`, Value: Your `anon` public Project API Key from Supabase.</li>
                </ul>
            </li>
            <li>Click <span className="font-semibold text-white">Create Web Service</span>. Wait for it to deploy.</li>
            <li>Once it's live, copy your new Render service URL. It will look something like `https://your-app-name.onrender.com`. Save this for the final step!</li>
        </ol>
      </div>
    ),
  },
  {
    title: 'Part 3: The Frontend (React & Vercel)',
    icon: <BrowserIcon />,
    content: (
      <div className="space-y-4">
        <p>This is the application you are currently viewing! The final step is to connect it to the backend you just deployed.</p>
        <ol className="list-decimal list-inside space-y-3 pl-4">
            <li>Scroll down to the <span className="font-semibold text-white">"Test Your Connection"</span> section below.</li>
            <li>
                Paste your full backend URL from Render into the input field (e.g., `https://your-app-name.onrender.com`).
            </li>
            <li>Click the "Fetch Message" button.</li>
            <li>
                If everything is set up correctly, you will see a success message: <span className="font-mono text-brand-primary bg-base-300 px-2 py-1 rounded">"Hello World"</span>.
            </li>
        </ol>
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-500/50 mt-6">
            <h4 className="font-bold text-red-300 text-lg mb-2">Troubleshooting Common Errors:</h4>
            <ul className="list-disc list-inside space-y-2 text-red-200">
                <li><span className="font-semibold">CORS Error:</span> This means your backend isn't allowing your frontend to talk to it. The provided `index.js` code includes `app.use(cors())` to prevent this. Ensure your backend code has this line.</li>
                <li><span className="font-semibold">404 Not Found:</span> You are hitting the wrong endpoint. Make sure you are testing the connection to `[Your Render URL]/api/hello`. The test box below adds this for you, so just provide the base URL.</li>
                <li><span className="font-semibold">500 Internal Server Error:</span> This means your backend server crashed. The most common cause is that the `SUPABASE_URL` or `SUPABASE_KEY` environment variables on Render are incorrect or missing. Double-check them!</li>
                 <li><span className="font-semibold">Failed to Fetch / Network Error:</span> Your browser can't reach the server. Check that your Render URL is correct, your internet is working, and that your Render service is not asleep (it may take 30s to wake up on the free plan).</li>
            </ul>
        </div>
      </div>
    ),
  },
   {
    title: 'Part 4: Deploy Your Own Frontend',
    icon: <RocketIcon />,
    content: (
      <div className="space-y-4">
        <p>To complete the journey, deploy your own version of this frontend application on Vercel.</p>
        <ol className="list-decimal list-inside space-y-3 pl-4">
          <li>
            Create a new React application or fork the repository for this tutorial app.
          </li>
          <li>
            Push your React project code to a new GitHub repository.
          </li>
          <li>
            Sign in to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Vercel</a> and create a new project, importing the GitHub repo you just made.
          </li>
          <li>Vercel will auto-detect the settings. Before deploying, go to the project's <span className="font-semibold text-white">Settings &gt; Environment Variables</span>.</li>
          <li>
            Add a variable with the key `VITE_BACKEND_URL` and set its value to your Render backend URL (e.g., `https://your-app-name.onrender.com`). The `VITE_` prefix is important for React apps using Vite to expose it to the browser.
          </li>
          <li>Deploy! You now have a live, full-stack application that you built from scratch. Congratulations!</li>
        </ol>
      </div>
    ),
  },
];