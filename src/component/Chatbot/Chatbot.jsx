import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Chat as ChatIcon, Send as SendIcon, Close as CloseIcon } from '@mui/icons-material';

const Chatbot = ({ job }) => {
  const [showChatbot, setShowChatbot] = useState(true);
  const [messages, setMessages] = useState([
    {
      text: `Hi! Ask me anything related to the ${job?.title || 'this'} job.`,
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
    setError(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const detectIntent = async (text) => {
    if (!job?.id) {
      setError('Job information is missing.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(
        'http://localhost:8080/api/dialogflow/query',
        {
          message: text,
          sessionId: `job-${job.id}-${Math.random().toString(36).substr(2, 9)}`,
          parameters: {
            jobId: String(job.id),
          },
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      return response.data.response;
    } catch (err) {
      console.error('Dialogflow error:', err);
      setError("I'm having trouble connecting to the assistant.");
      return "Sorry, I couldn't process that. Please try again.";
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const botResponse = await detectIntent(input);
    setMessages((prev) => [...prev, { text: botResponse, sender: 'bot' }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) sendMessage();
  };

  const suggestedQuestions = [
    'What is the salary for this position?',
    'What skills are required?',
    'Where is this job located?',
    'How do I apply?',
    'What are the job requirements?',
    'What is the interview process?',
    'Am I eligible for this role?',
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {showChatbot ? (
        <div className="fixed bottom-6 right-6 flex flex-col w-96 max-w-full bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 shadow-2xl rounded-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="flex justify-between items-center bg-gradient-to-r from-purple-700 to-pink-600 p-4">
            <h2 className="text-white text-lg font-semibold tracking-wide select-none">Job Assistant</h2>
            <button
              onClick={toggleChatbot}
              className="hover:text-gray-200 transition-colors duration-300"
              aria-label="Close Chatbot"
            >
              <CloseIcon className="text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 max-w-xs whitespace-pre-wrap break-words ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  } shadow-sm`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start space-x-4 items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="text-gray-500 italic">Typing...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-200 text-red-900 text-center py-2 text-sm">
              {error}
            </div>
          )}

          {/* Suggestions & Input */}
          <div className="bg-gray-50 p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(q)}
                  disabled={isLoading}
                  className="bg-purple-200 hover:bg-purple-300 text-purple-800 px-3 py-1 rounded-full text-xs font-medium transition"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask about the job..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-grow rounded-l-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent px-4 py-2 text-gray-700"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed rounded-r-xl px-4 flex items-center justify-center text-white transition"
                aria-label="Send Message"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChatbot}
          aria-label="Open Chatbot"
          className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg text-white hover:brightness-110 transition"
        >
          <ChatIcon className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

Chatbot.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    company: PropTypes.string,
    salary: PropTypes.string,
    location: PropTypes.string,
    skillsRequired: PropTypes.string,
    experienceRequired: PropTypes.string,
    employmentType: PropTypes.string,
  }),
};

export default Chatbot;
