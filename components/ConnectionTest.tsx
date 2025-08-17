import React, { useState, useCallback } from 'react';

// Use environment variable if available, but allow user override.
const initialUrl = import.meta.env?.VITE_BACKEND_URL || '';

const ConnectionTest: React.FC = () => {
    const [backendUrl, setBackendUrl] = useState<string>(initialUrl);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleFetch = useCallback(async () => {
        if (!backendUrl) {
            setResult({ type: 'error', message: 'Please enter your backend URL.' });
            return;
        }

        setIsLoading(true);
        setResult(null);

        // Ensure the URL has a protocol
        let urlToFetch = backendUrl.trim();
        if (!urlToFetch.startsWith('http://') && !urlToFetch.startsWith('https://')) {
            urlToFetch = `https://${urlToFetch}`;
        }
        
        // Append the API path
        const apiUrl = `${urlToFetch.replace(/\/$/, '')}/api/hello`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!response.ok) {
                 throw new Error(data.error || `Request failed with status ${response.status}`);
            }

            setResult({ type: 'success', message: data.message });

        } catch (error) {
            let errorMessage = 'An unknown error occurred. Check the browser console for more details.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            if(errorMessage.includes('Failed to fetch')) {
                errorMessage = `Failed to fetch. This could be a CORS issue, a network problem, or the server is not running at ${apiUrl}. See the Troubleshooting section above for help.`;
            }
            setResult({ type: 'error', message: errorMessage });
        } finally {
            setIsLoading(false);
        }

    }, [backendUrl]);

    return (
        <div className="max-w-2xl mx-auto">
            <p className="text-center text-gray-400 mb-4">
                Enter the base URL of your deployed Render service (e.g., `https://my-app.onrender.com`). We'll automatically try to connect to the `/api/hello` endpoint.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={backendUrl}
                    onChange={(e) => setBackendUrl(e.target.value)}
                    placeholder="https://your-backend-service.onrender.com"
                    className="flex-grow bg-base-300 text-white placeholder-gray-500 px-4 py-3 rounded-md border-2 border-base-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition"
                    disabled={isLoading}
                />
                <button
                    onClick={handleFetch}
                    disabled={isLoading}
                    className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-md transition-all duration-200 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Testing...
                        </>
                    ) : 'Fetch Message'}
                </button>
            </div>

            {result && (
                <div className={`mt-6 p-4 rounded-md text-center font-mono ${
                    result.type === 'success' 
                        ? 'bg-green-900/50 text-green-300 border border-green-500/50' 
                        : 'bg-red-900/50 text-red-300 border border-red-500/50'
                }`}>
                    <span className="font-bold uppercase text-sm block mb-2">{result.type}</span>
                    <p className="whitespace-pre-wrap break-words">{result.message}</p>
                </div>
            )}
        </div>
    );
};

export default ConnectionTest;