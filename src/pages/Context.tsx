"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { AnimatePresence, motion } from "framer-motion";
import {
  CopyIcon,
  CornerDownLeft,
  Mic,
  Paperclip,
  RefreshCcw,
  Volume2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ChatAiIcons = [
  {
    icon: CopyIcon,
    label: "Copy",
  },
  {
    icon: RefreshCcw,
    label: "Refresh",
  },
  {
    icon: Volume2,
    label: "Volume",
  },
];

export default function Page() {
  // Local state management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialAIResponse, setHasInitialAIResponse] = useState(false);
  const selectedUser = {
    name: "User",
    avatar: "https://via.placeholder.com/150",
  };

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Determine the message variant
  const getMessageVariant = (role: string) => (role === "ai" ? "received" : "sent");

  // Scroll to the latest message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  // Handle message submission
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;

    const userMessage = {
      id: messages.length + 1,
      avatar: selectedUser.avatar,
      name: selectedUser.name,
      role: "user",
      message: input,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    formRef.current?.reset();

    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        avatar: "",
        name: "ChatBot",
        role: "ai",
        message: "Sure! If you have any more questions, feel free to ask.",
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setIsLoading(false);
    }, 2500);
  };

  // Focus input on initial render
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();

    if (!hasInitialAIResponse) {
      setIsLoading(true);
      setTimeout(() => {
        const initialAIMessage = {
          id: 1,
          avatar: "",
          name: "ChatBot",
          role: "ai",
          message: "Hi there! How can I assist you today?",
        };

        setMessages([initialAIMessage]);
        setIsLoading(false);
        setHasInitialAIResponse(true);
      }, 2500);
    }
  }, []);

  return (    
  <div className="flex items-center justify-center w-full h-full -mt-14">
    <div className="h-[85%] w-[98%]">
      <div className="relative flex h-full flex-col rounded-xl bg-zinc-800 p-4 lg:col-span-2">
        <ChatMessageList ref={messagesContainerRef}>
          {/* Chat messages */}
          <AnimatePresence>
            {messages.map((message, index) => {
              const variant = getMessageVariant(message.role!);
              return (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                  transition={{
                    opacity: { duration: 0.1 },
                    layout: {
                      type: "spring",
                      bounce: 0.3,
                      duration: index * 0.05 + 0.2,
                    },
                  }}
                  style={{ originX: 0.5, originY: 0.5 }}
                  className="flex flex-col gap-2 p-4"
                >
                  <ChatBubble key={index} variant={variant}>
                    <Avatar>
                      <AvatarImage
                        src={message.role === "ai" ? "" : message.avatar}
                        alt="Avatar"
                        className={message.role === "ai" ? "dark:invert" : ""}
                      />
                      <AvatarFallback>
                        {message.role === "ai" ? "🤖" : "GG"}
                      </AvatarFallback>
                    </Avatar>
                    <ChatBubbleMessage isLoading={message.isLoading}>
                      {message.message}
                    </ChatBubbleMessage>
                  </ChatBubble>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </ChatMessageList>
        <div className="flex-1" />
        <form
          ref={formRef}
          onSubmit={handleSendMessage}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <ChatInput
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSendMessage(e as unknown as React.FormEvent<HTMLFormElement>);
              }
            }}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Button
              disabled={!input || isLoading}
              type="submit"
              size="sm"
              className="ml-auto gap-1.5"
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}
