export type SettingsRequests = {
  getSettings: {
    params: { category?: string };
    response: Record<string, unknown>;
  };
  getSetting: {
    params: { key: string; category?: string };
    response: string | null;
  };
  saveSetting: {
    params: { key: string; value: unknown; category: string };
    response: { success: boolean };
  };
};
