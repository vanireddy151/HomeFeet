import React, { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { API_BASE } from '../lib/api';

const ChatPage: React.FC = () => {
  const { interestId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [interest, setInterest] = useState<any>(null);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  const loadChat = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/chat/${interestId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      setInterest(data.interest);
      setMessages(data.messages);
      setError('');
    } else {
      setError(data.error || 'Unable to open chat');
    }
  };

  useEffect(() => {
    loadChat();
  }, [interestId]);

  const send = async (event: FormEvent) => {
    event.preventDefault();
    if (!body.trim()) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/chat/${interestId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ body: body.trim() })
    });
    if (res.ok) {
      setBody('');
      loadChat();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-950 p-5 text-white">
          <Link to="/interest-shown" className="mb-4 inline-flex items-center gap-2 text-sm text-teal-200">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <h1 className="text-2xl font-bold">Builder Owner Chat</h1>
          <p className="text-sm text-slate-300">{interest?.propertyId?.locality || 'Property conversation'}</p>
        </div>

        {error ? (
          <div className="p-10 text-center text-red-600">{error}</div>
        ) : (
          <>
            <div className="h-[55vh] space-y-3 overflow-y-auto bg-slate-50 p-5">
              {messages.length === 0 ? (
                <p className="text-center text-slate-500">No messages yet.</p>
              ) : messages.map((message) => {
                const mine = message.senderId === userId;
                return (
                  <div key={message._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-lg px-4 py-3 shadow-sm ${mine ? 'bg-teal-600 text-white' : 'bg-white text-slate-800'}`}>
                      <p>{message.body}</p>
                      <p className={`mt-1 text-xs ${mine ? 'text-teal-100' : 'text-slate-400'}`}>
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <form onSubmit={send} className="flex gap-3 border-t border-slate-200 p-4">
              <input
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type a message"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-teal-500"
              />
              <button className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700">
                <Send className="h-4 w-4" /> Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
