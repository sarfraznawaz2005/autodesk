export type DashboardRequests = {
  sendDashboardMessage: {
    params: {
      sessionId: string;
      content: string;
    };
    response: { messageId: string };
  };
  abortDashboardMessage: {
    params: { sessionId: string };
    response: { success: boolean };
  };
  clearDashboardSession: {
    params: { sessionId: string };
    response: { success: boolean };
  };
};
