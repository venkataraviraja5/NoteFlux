"use client";

import { useState } from "react";
import { useSession } from 'next-auth/react';

export default function AskQuestion() {
  const { data: session } = useSession();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!session) {
      alert('You must be logged in to ask a question');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/queryOpenAI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
      });

      const data = await response.json();

      if (data.success) {
        setAnswer(data.answer);
      } else {
        alert('Failed to get answer: ' + data.message);
      }
    } catch (error) {
      console.error('Error asking question:', error);
      alert('Failed to ask question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question based on your notes..."
        className="p-2 border rounded mb-4 w-full text-black"
      />
      <button
        onClick={handleAskQuestion}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? 'Asking...' : 'Ask Question'}
      </button>
      {answer && (
        <div className="mt-4 p-4 border rounded bg-gray-100 w-full">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
