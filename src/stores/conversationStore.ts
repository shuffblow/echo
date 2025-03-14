import { create } from 'zustand';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: number;
  audioUrl?: string;
}

interface ConversationState {
  messages: Message[];
  isRecording: boolean;
  isProcessing: boolean;
  currentTopic: string;
  addMessage: (role: MessageRole, content: string, audioUrl?: string) => void;
  clearMessages: () => void;
  setIsRecording: (isRecording: boolean) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setCurrentTopic: (topic: string) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  messages: [],
  isRecording: false,
  isProcessing: false,
  currentTopic: '日常对话',
  
  addMessage: (role, content, audioUrl) => set((state) => ({
    messages: [
      ...state.messages,
      {
        id: Math.random().toString(36).substring(7),
        content,
        role,
        timestamp: Date.now(),
        audioUrl,
      },
    ],
  })),
  
  clearMessages: () => set({ messages: [] }),
  
  setIsRecording: (isRecording) => set({ isRecording }),
  
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  
  setCurrentTopic: (topic) => set({ currentTopic: topic }),
}));
