
export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  WEB_MASTER = 'WEB_MASTER',
  LOGIC_FIXER = 'LOGIC_FIXER',
  INTELLIGENCE_CHAT = 'INTELLIGENCE_CHAT',
  VISION = 'VISION',
  SENTINEL = 'SENTINEL',
  BRIDGE = 'BRIDGE',
  SANDBOX = 'SANDBOX',
  DIAGRAM = 'DIAGRAM'
}

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface AnalysisResult {
  severity: 'low' | 'medium' | 'high' | 'critical';
  findings: string[];
  recommendations: string[];
  summary: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  image?: string; // Optional base64 image data
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastModified: number;
}

export interface UserSession {
  isAuthenticated: boolean;
  username: string;
  email: string;
  loginTime: number;
  role: UserRole;
  isFirstLogin?: boolean;
}
