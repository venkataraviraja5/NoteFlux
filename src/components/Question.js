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
    <div className="flex flex-col items-center justify-center w-full mt-11 p-4 ">
      <div className="w-full max-w-lg bg-black shadow-md rounded-2xl p-6 border border-[#dafa53] ">
        <h1 className="text-xl font-semibold mb-4 text-center ">Ask a Question</h1>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question based on your notes..."
          className="px-2 py-1 border rounded-xl mb-4 w-full text-black"
        />
        <button
          onClick={handleAskQuestion}
          className="bg-sky-400 text-black text-semibold p-1 rounded-xl w-full"
          disabled={loading}
        >
          {loading ? 'Asking...' : 'Ask Question'}
        </button>
        {answer && (
          <div className="mt-4 p-4 border rounded-xl bg-gray-100 w-full text-black ">
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
