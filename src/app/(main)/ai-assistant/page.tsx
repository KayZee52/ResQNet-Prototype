
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Send, AlertTriangle, ShieldAlert, Loader2, Languages, UserCircle, Volume2, BookOpen, MessageSquare, RefreshCcw, Settings2 } from "lucide-react";
import { emergencyAssistance, EmergencyAssistanceInput, EmergencyAssistanceOutput } from "@/ai/flows/emergency-assistance";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  type: "user" | "ai";
  text?: string;
  steps?: string[];
  shouldIncludeFirstAid?: boolean;
  timestamp: Date;
}

const languages = [
  { value: "en", label: "English" },
  { value: "kpelle", label: "Kpelle" },
  { value: "bassa", label: "Bassa" },
  { value: "kru", label: "Kru" },
  { value: "vai", label: "Vai" },
];

const suggestionChips = [
  "Someone is bleeding",
  "There’s a fire",
  "Chest pain",
  "My friend fainted",
];

export default function AIAssistantPage() {
  const [inputValue, setInputValue] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [micStatus, setMicStatus] = useState<"Idle" | "Live" | "Processing">("Idle");
  const [isListening, setIsListening] = useState(false); // For voice input simulation

  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Scroll to bottom of chat on new message
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [conversation]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) {
      toast({ variant: "destructive", title: "Input Required", description: "Please describe your emergency or type a message." });
      return;
    }

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      toast({
        variant: "destructive",
        title: "Offline",
        description: "AI Assistant requires an internet connection. Please check your connection and try again."
      });
      return;
    }

    const newUserMessage: Message = {
      id: Date.now().toString() + "-user",
      type: "user",
      text: messageText,
      timestamp: new Date(),
    };
    setConversation(prev => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);
    setMicStatus("Processing");

    try {
      const input: EmergencyAssistanceInput = { symptoms: messageText };
      const response = await emergencyAssistance(input);
      
      const aiSteps = response.instructions.split('\n').filter(step => step.trim() !== '');

      const newAiMessage: Message = {
        id: Date.now().toString() + "-ai",
        type: "ai",
        steps: aiSteps.length > 0 ? aiSteps : [response.instructions], // Fallback if no newlines
        shouldIncludeFirstAid: response.shouldIncludeFirstAid,
        timestamp: new Date(),
      };
      setConversation(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      const errorAiMessage: Message = {
        id: Date.now().toString() + "-ai-error",
        type: "ai",
        text: "Sorry, I encountered an error. Please try again or use the SOS alert for critical emergencies.",
        timestamp: new Date(),
      };
      setConversation(prev => [...prev, errorAiMessage]);
      toast({ variant: "destructive", title: "AI Error", description: "Could not get a response. Please try again." });
    } finally {
      setIsLoading(false);
      setMicStatus("Idle");
      setIsListening(false); // Turn off listening after processing
      inputRef.current?.focus();
    }
  };

  const handleVoiceInputToggle = () => {
    setIsListening(prev => !prev);
    setMicStatus(isListening ? "Idle" : "Live");
    if (!isListening) {
      toast({ title: "Voice Input Active", description: "Speak now (simulated). Auto-processes after pause." });
      // Simulate voice input being processed after a delay if mic becomes active
      // In a real app, speech recognition would handle this.
      // For now, we can just set a placeholder or auto-send after a timeout if needed for demo.
    } else {
       toast({ title: "Voice Input Deactivated", description: "Microphone off." });
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    // Optionally auto-send:
    // handleSendMessage(suggestion); 
    // For now, user has to press send
    inputRef.current?.focus();
  };

  const handleResetChat = () => {
    setConversation([]);
    setInputValue("");
    setIsLoading(false);
    setMicStatus("Idle");
    setIsListening(false);
    toast({title: "Chat Reset", description: "Conversation cleared."});
  };

  const handleFeedback = () => {
     toast({title: "Feedback", description: "Feedback mechanism is under development. Thank you!"});
  };
  
  const handlePlayNarration = (stepText: string) => {
     toast({title: "Narration", description: `Playing: "${stepText.substring(0,30)}..." (Feature in development)`});
  };

  return (
    <div className="container mx-auto p-0 sm:p-4 flex flex-col h-[calc(100vh-4rem)] sm:h-auto sm:min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-100 via-indigo-100 to-violet-100 dark:from-blue-900/70 dark:via-indigo-900/70 dark:to-violet-900/70">
      <Card id="ai-assistant-card" className="w-full max-w-2xl mx-auto shadow-xl flex flex-col flex-grow my-0 sm:my-4 rounded-none sm:rounded-lg">
        <CardHeader className="border-b p-4">
          <CardTitle className="font-headline text-2xl text-primary text-center sm:text-left">Emergency Assistant</CardTitle>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-2 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Languages className="h-5 w-5 text-muted-foreground" />
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value} className="text-xs">
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Mic className={cn("h-4 w-4", micStatus === "Live" ? "text-red-500 animate-pulse" : micStatus === "Processing" ? "text-blue-500" : "")} />
              <span>Mic: {micStatus}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow p-0 overflow-hidden">
          {/* Adjust height as needed, using a fixed value for now for simplicity */}
          <ScrollArea className="h-[calc(100vh-320px)] sm:h-[400px]" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
              {conversation.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.type === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                      "max-w-[75%] p-3 rounded-xl shadow",
                      msg.type === "user" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card text-card-foreground border rounded-bl-none"
                    )}
                  >
                    {msg.type === "ai" && (
                       <UserCircle className="h-6 w-6 mb-1 text-primary float-left mr-2" />
                    )}
                    {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                    {msg.steps && (
                      <ul className="space-y-2">
                        {msg.steps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 mt-0.5 text-primary">&#8226;</span> {/* Bullet point */}
                            <span className="flex-grow whitespace-pre-wrap">{step}</span>
                            <Button variant="ghost" size="icon" className="ml-2 h-6 w-6 shrink-0" onClick={() => handlePlayNarration(step)}>
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {msg.shouldIncludeFirstAid && msg.type === "ai" && (
                      <p className="mt-2 text-xs text-green-600 dark:text-green-400 border-t border-green-200 dark:border-green-700 pt-1">
                        First aid protocols have been included in the instructions above.
                      </p>
                    )}
                     <p className="text-xs mt-1 opacity-70 text-right clear-both">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
              {isLoading && conversation.length > 0 && conversation[conversation.length - 1].type === "user" && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] p-3 rounded-lg shadow bg-card border rounded-bl-none flex items-center space-x-2">
                    <UserCircle className="h-6 w-6 text-primary" />
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        
        {/* Input Area */}
        <div className="border-t p-3 bg-background/80 backdrop-blur-sm">
           <div className="mb-2 flex flex-wrap gap-2">
            {suggestionChips.map(suggestion => (
              <Button key={suggestion} variant="outline" size="sm" className="text-xs h-auto py-1 px-2" onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </Button>
            ))}
          </div>
          <div className="flex items-end space-x-2">
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? "Listening..." : "Describe your emergency..."}
              rows={1}
              className="flex-grow resize-none min-h-[40px] max-h-[120px] leading-tight pt-2.5"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading || isListening}
            />
            <Button
              variant={isListening ? "destructive" : "default"}
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={handleVoiceInputToggle}
              disabled={isLoading}
              aria-label={isListening ? "Stop listening" : "Use voice input"}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button onClick={() => handleSendMessage()} disabled={isLoading || !inputValue.trim()} size="icon" className="h-10 w-10 shrink-0">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* SOS Escalation */}
        <CardFooter className="flex flex-col items-center p-3 border-t">
            <p className="text-sm text-muted-foreground mb-2">🚨 Need more help or critical emergency?</p>
            <Link href="/emergency-alert" className="w-full">
              <Button variant="destructive" className="w-full text-base py-2.5">
                <ShieldAlert className="mr-2 h-5 w-5" /> Activate SOS Alert Now
              </Button>
            </Link>
        </CardFooter>

        {/* Footer Tools */}
        <CardFooter className="p-2 border-t flex justify-around bg-secondary/30">
          <Button variant="ghost" size="sm" className="flex-col h-auto py-1 px-2 text-xs" onClick={() => router.push('/first-aid')}>
            <BookOpen className="h-4 w-4 mb-0.5"/> First Aid
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-1 px-2 text-xs" onClick={handleFeedback}>
            <MessageSquare className="h-4 w-4 mb-0.5"/> Feedback
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-1 px-2 text-xs" onClick={handleResetChat}>
            <RefreshCcw className="h-4 w-4 mb-0.5"/> Reset Chat
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-1 px-2 text-xs" onClick={handleVoiceInputToggle} disabled={isLoading}>
            <Mic className="h-4 w-4 mb-0.5"/> {isListening ? "Mic Off" : "Mic On"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
    
