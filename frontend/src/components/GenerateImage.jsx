import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { IoSend } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./Chatbot.css";

const sendMessageAPI = async (message) => {
  const response = await fetch("https://ai-chatbot-mern-app-backend.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return await response.json();
};

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [isAITyping, setIsAITyping] = useState(false);
  const [conversation, setConversation] = useState([
    {
      role: "assistant",
      content: "Hello! How can I assist you today?",
    },
  ]);

  const mutation = useMutation({
    mutationFn: sendMessageAPI,
    onSuccess: (data) => {
      setIsAITyping(false);
      setConversation((prevConversation) => [
        ...prevConversation,
        { role: "assistant", content: data.message },
      ]);
    },
    onError: (err) => {
      setIsAITyping(false);
      alert("Something went wrong: " + err.message);
    },
  });

  const handleSendMessage = () => {
    const currentMessage = message.trim();
    if (!currentMessage) {
      alert("Please enter a message.");
      return;
    }

    setConversation((prev) => [...prev, { role: "user", content: currentMessage }]);
    setIsAITyping(true);
    mutation.mutate(currentMessage);
    setMessage("");
  };

  return (
    <div className="main-container">
      <motion.div
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="title">Cognify AI</h1>
        <p className="description">Your thoughts here – the AI is listening.</p>
      </motion.div>

      <motion.div
        className="chat-container glass"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="conversation">
          <AnimatePresence>
            {conversation.map((entry, index) => (
              <motion.div
                key={index}
                className={`message ${entry.role}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <strong>{entry.role === "user" ? "You: " : <FaRobot />}</strong>{" "}
                {entry.content}
              </motion.div>
            ))}
          </AnimatePresence>

          {isAITyping && (
            <motion.div
              className="message assistant typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.8,
              }}
            >
              <FaRobot /> <strong>AI is typing...</strong>
            </motion.div>
          )}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-message"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={mutation.isPending}
            className="send-btn"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <IoSend />
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="footer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Developed by{" "}
        <a
          href="https://tejanaik15.github.io/personal-portfolio/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Teja
        </a>
      </motion.div>
    </div>
  );
};

export default Chatbot;
