export type UpdaterRequests = {
  checkForUpdate: {
    params: {};
    response: {
      version: string;
      hash: string;
      updateAvailable: boolean;
      updateReady: boolean;
      error: string;
      /** True when running in dev channel — updates are disabled. */
      devMode?: boolean;
    };
  };
  downloadUpdate: {
    params: {};
    /** Resolves when the download + decompression is complete. Progress arrives via updateStatus webview messages. */
    response: { success: boolean; error?: string };
  };
  applyUpdate: {
    params: {};
    /** Triggers app restart. The process exits — this promise may never resolve. */
    response: { success: boolean };
  };
};
