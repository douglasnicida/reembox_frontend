import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChatBubble, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { CornerDownLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type MessageProps = {
  message: string;
  role: string;
  avatar: string;
};

function ContextPage() {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  const getMessageVariant = (role: string) => (role === "ai" ? "received" : "sent");

  const connectWebSocket = () => {
    const ws = new WebSocket("ws://localhost:8000/query/"); // Substitua pelo endpoint correto
    websocketRef.current = ws;

    ws.onopen = () => {
      console.log("Conectado ao WebSocket");
    };

    ws.onmessage = (event) => {
      const data = event.data;
      console.log("Mensagem recebida:", data);

      // Substitui o "pensando..." pela resposta da IA
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.role === "ai" && message.message === "Pensando..."
            ? { ...message, message: data }
            : message
        )
      );

      setIsLoading(false);
    };

    ws.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
    };

    ws.onclose = () => {
      console.log("Conexão WebSocket fechada");
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const sendMessage = (query: string) => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      const folderId = user?.rag.folderId;
      const llmModel = user?.rag.llmModel;
      const embeddingModel = user?.rag.embeddingModel;

      const payload = JSON.stringify({ query, folderId, llmModel, embeddingModel });
      websocketRef.current.send(payload);
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;

    const userMessage = {
      message: input,
      avatar: `https://ui-avatars.com/api/?name=${user?.name}&background=random&rounded=true&size=40`,
      role: "user",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Adiciona a mensagem temporária da IA
    const aiThinkingMessage = {
      message: "Pensando...",
      avatar: "",
      role: "ai",
    };

    setMessages((prevMessages) => [...prevMessages, aiThinkingMessage]);
    setInput("");
    setIsLoading(true);

    // Envia a mensagem pelo WebSocket
    sendMessage(input);
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-[99%] h-[calc(100vh-125px)]">
        <div className="relative flex h-full flex-col rounded-xl bg-zinc-800 p-4 lg:col-span-2">
          <ChatMessageList ref={messagesContainerRef}>
            <AnimatePresence>
              {messages.map((message: MessageProps, index: number) => {
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
                    className="flex flex-col gap-2 p-4"
                  >
                    <ChatBubble key={index} variant={variant}>
                      <Avatar>
                        <AvatarImage
                          src={message.role === "ai" ? "" : message.avatar}
                          alt="Avatar"
                          className={message.role === "ai" ? "dark:invert" : ""}
                        />
                        <AvatarFallback>{message.role === "ai" && "🤖"}</AvatarFallback>
                      </Avatar>
                      <ChatBubbleMessage isLoading={message.message === "Pensando..."}>
                        {message.message}
                      </ChatBubbleMessage>
                    </ChatBubble>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </ChatMessageList>
          <form
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite aqui sua mensagem..."
              className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center p-3 pt-0">
              <Button
                disabled={!input || isLoading}
                type="submit"
                size="sm"
                className="ml-auto gap-1.5"
              >
                Enviar mensagem
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContextPage;
