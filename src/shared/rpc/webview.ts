import type { RPCSchema } from "electrobun/bun";

export type WebviewSchema = RPCSchema<{
  requests: {
    getViewState: {
      params: Record<string, never>;
      response: { route: string };
    };
  };
  messages: {
    navigateTo: { route: string };
    showToast: {
      type: "success" | "error" | "warning" | "info";
      message: string;
    };
    settingsChanged: { key: string; value: unknown };

    // Streaming
    streamToken: {
      conversationId: string;
      messageId: string;
      token: string;
      agentId: string | null;
    };
    streamComplete: {
      conversationId: string;
      messageId: string;
      content: string;
      metadata?: string | null;
      usage: { promptTokens: number; completionTokens: number };
    };
    streamReset: {
      conversationId: string;
      messageId: string;
    };
    streamError: {
      conversationId: string;
      error: string;
    };

    // Plan approval
    presentPlan: {
      projectId: string;
      conversationId: string;
      plan: { title: string; content: string };
    };

    // Provider test result (fire-and-forget — result pushed back from Bun)
    providerTestResult: {
      id: string;
      success: boolean;
      error?: string;
    };

    // Directory selected from native picker (fire-and-forget)
    directorySelected: {
      path: string | null;
    };

    // WhatsApp real-time events
    whatsappQR: {
      channelId: string;
      qr: string; // base64 PNG data URL
    };
    whatsappStatus: {
      channelId: string;
      status: "connected" | "connecting" | "disconnected" | "error";
      phoneNumber?: string;
    };

    // Inbox real-time updates
    inboxMessageReceived: {
      messageId: string;
      projectId: string | null;
      sender: string;
      platform: string;
    };

    // Kanban real-time updates
    kanbanTaskUpdated: {
      projectId: string;
      taskId: string;
      action: "created" | "updated" | "moved" | "deleted";
    };

    // Shell approval request (agent wants to run a command)
    shellApprovalRequest: {
      requestId: string;
      projectId: string;
      agentId: string;
      agentName: string;
      command: string;
      timestamp: string;
    };

    // User question request (PM asks user a question via modal dialog)
    userQuestionRequest: {
      requestId: string;
      question: string;
      inputType: "choice" | "text" | "confirm" | "multi_select";
      options?: string[];
      placeholder?: string;
      defaultValue?: string;
      context?: string;
      projectId: string;
      agentId: string;
      agentName: string;
      timestamp: string;
    };

    // Inline agent execution — message parts streaming
    partCreated: {
      conversationId: string;
      messageId: string;
      part: {
        id: string;
        type: "text" | "tool_call" | "tool_result" | "reasoning" | "agent_start" | "agent_end";
        content: string;
        toolName?: string;
        toolInput?: string;
        toolOutput?: string;
        toolState?: "pending" | "running" | "success" | "error";
        sortOrder: number;
        agentName?: string;
        timeStart?: string;
        timeEnd?: string;
      };
    };
    partUpdated: {
      conversationId: string;
      messageId: string;
      partId: string;
      updates: {
        content?: string;
        toolOutput?: string;
        toolState?: "pending" | "running" | "success" | "error";
        timeEnd?: string;
      };
    };
    agentInlineStart: {
      conversationId: string;
      messageId: string;
      agentName: string;
      agentDisplayName: string;
      task: string;
    };
    agentInlineComplete: {
      conversationId: string;
      messageId: string;
      agentName: string;
      status: string;
      summary: string;
      filesModified: string[];
      tokensUsed: { prompt: number; completion: number };
    };

    // Conversation title auto-generated
    conversationTitleChanged: {
      conversationId: string;
      title: string;
    };
    conversationUpdated: {
      conversationId: string;
      updatedAt: string;
      projectId?: string;
    };
    compactionStarted: {
      conversationId: string;
    };
    conversationCompacted: {
      conversationId: string;
    };
    newMessage: {
      conversationId: string;
      messageId: string;
      agentId: string;
      agentName: string;
      content: string;
      metadata: string;
    };

    // PM thinking/reasoning (streamed from PM engine)
    pmThinking: {
      conversationId: string;
      text: string;
      isPartial: boolean;
    };

    // Dashboard PM chat (floating widget)
    dashboardPMChunk: {
      sessionId: string;
      messageId: string;
      token: string;
    };
    dashboardPMComplete: {
      sessionId: string;
      messageId: string;
      content: string;
    };
    dashboardPMToolCall: {
      sessionId: string;
      toolName: string;
      args: Record<string, unknown>;
    };
    dashboardPMError: {
      sessionId: string;
      error: string;
    };
  };
}>;
