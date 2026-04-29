# Domain: bun

**Directory:** `src/bun`
**Files:** 143
**Symbols:** 1053

## Files

### `src/bun/agents/agent-loop.ts`

**Interfaces:**
- `MessagePart` (line 53)
- `InlineAgentCallbacks` (line 68)
- `InlineAgentOptions` (line 78)
- `InlineAgentResult` (line 101)

**Functions:**
- `logAgent` (line 38)
- `buildThinkingOptions` (line 119)
- `filterReadOnlyTools` (line 168)
- `pruneToolOutput` (line 184)
- `pruneAgentToolResults` (line 242)
- `compactToolResultsInMessages` (line 299)
- `stripOldAssistantText` (line 334)
- `buildRuleBasedCompaction` (line 369)
- `aiCompactConversation` (line 507)
- `getHookCommand` (line 585)
- `wrapToolsWithHooks` (line 601)
- `shortPath` (line 669)
- `truncate` (line 675)
- `describeToolCall` (line 679)
- `runInlineAgent` (line 707)
- `wrapDirTool` (line 805)
- `onAbort` (line 924)
- `hashToolCall` (line 936)

**Exports:**
- `READ_ONLY_AGENTS` (line 162)


### `src/bun/agents/context-notes.ts`

**Functions:**
- `syncContextFilesAsNotes` (line 29)


### `src/bun/agents/context.ts`

**Interfaces:**
- `ContextOptions` (line 7)
- `BuiltContext` (line 15)

**Functions:**
- `estimateTokens` (line 24)
- `buildContext` (line 28)
- `shouldSummarize` (line 89)


### `src/bun/agents/engine-types.ts`

**Interfaces:**
- `MessageMetadata` (line 127)
- `AgentEngineCallbacks` (line 142)
- `PreviousFailureContext` (line 198)
- `QueueEntry` (line 204)

**Functions:**
- `getPluginTools` (line 10)
- `buildPMThinkingOptions` (line 34)
- `extractPMReasoning` (line 66)
- `applyAnthropicCaching` (line 100)

**Exports:**
- `THINKING_BUDGET_TOKENS` (line 28)
- `DEFAULT_METADATA` (line 136)


### `src/bun/agents/engine.ts`

**Classes:**
- `AgentEngine` (line 91)

**Functions:**
- `emit` (line 337)
- `emitActivity` (line 588)
- `emitThinking` (line 628)

**Methods:**
- `sendMessage` (line 127)
- `_runPMProcessing` (line 222)
- `stopAll` (line 930)
- `stopAllAndReset` (line 939)
- `isStopped` (line 945)
- `setAbortAgentsFn` (line 950)
- `getProjectId` (line 955)
- `isProcessing` (line 960)
- `getActiveConversationId` (line 965)
- `getActiveMetadata` (line 970)
- `getQueuedAgentsSnapshot` (line 975)
- `presentPlan` (line 982)
- `moveKanbanTask` (line 989)
- `postDeterministicMessage` (line 994)
- `invokePMWithEvent` (line 1005)
- `_handleStatusCommand` (line 1020)
- `getDefaultProviderRow` (line 1032)
- `_loadSummarizationThreshold` (line 1083)
- `triggerSummarization` (line 1095)
- `_touchConversation` (line 1132)
- `autoTitleConversation` (line 1141)

**Exports:**
- `MessageMetadata` (line 84)
- `AgentEngineCallbacks` (line 84)
- `QueueEntry` (line 84)


### `src/bun/agents/handoff.ts`

**Functions:**
- `generateHandoffSummary` (line 14)
- `buildDeterministicSummary` (line 69)


### `src/bun/agents/kanban-integration.ts`

**Classes:**
- `KanbanIntegration` (line 29)

**Interfaces:**
- `KanbanIntegrationCallbacks` (line 10)

**Methods:**
- `handleHumanMove` (line 48)
- `handleAgentMove` (line 104)
- `checkBlocked` (line 134)
- `logActivity` (line 195)
- `getProjectId` (line 222)


### `src/bun/agents/project-snapshot.ts`

**Functions:**
- `clearProjectSnapshotCache` (line 8)
- `getProjectSnapshot` (line 17)


### `src/bun/agents/prompt-logger.ts`

**Types:**
- `PromptLogEntry` (line 137)
- `PromptLogEntryFull` (line 183)

**Functions:**
- `refreshEnabled` (line 29)
- `isPromptLoggingEnabled` (line 38)
- `invalidatePromptLogCache` (line 44)
- `getPromptLogPath` (line 49)
- `rotateIfNeeded` (line 57)
- `estimateTokens` (line 70)
- `logPrompt` (line 82)
- `clearPromptLog` (line 124)
- `getPromptLogStats` (line 150)
- `getPromptLogEntry` (line 193)
- `openPromptLog` (line 239)


### `src/bun/agents/prompts.ts`

**Functions:**
- `loadConstitution` (line 13)
- `loadUserProfile` (line 28)
- `buildUserSection` (line 48)
- `loadAgentKnowledgeListing` (line 64)
- `isAgentKnowledgeUpdateEnabled` (line 96)
- `filterConstitution` (line 120)
- `clearWorkspaceInstructionsCache` (line 358)
- `loadWorkspaceInstructions` (line 366)
- `loadDecisionsFile` (line 401)
- `buildGitContext` (line 419)
- `buildProjectContextSection` (line 456)
- `buildProjectContext` (line 489)
- `buildDirectToolsSection` (line 520)
- `buildSkillsDescriptionSection` (line 550)
- `buildPMMcpSection` (line 594)
- `buildAgentMcpSection` (line 620)
- `isFeatureBranchWorkflowEnabled` (line 639)
- `getPMSystemPrompt` (line 687)
- `loadPluginPrompts` (line 903)
- `getAgentSystemPrompt` (line 928)


### `src/bun/agents/review-cycle.ts`

**Functions:**
- `getMaxReviewRounds` (line 57)
- `getSubmitReviewDetails` (line 80)
- `reviewSummaryHasIssues` (line 118)
- `isAgentCancelled` (line 141)
- `triggerPMAutoContinue` (line 151)
- `spawnReviewAgent` (line 224)
- `ensureGitInit` (line 332)
- `autoCommitTask` (line 349)
- `notifyTaskInReview` (line 460)
- `isReviewActive` (line 637)
- `getActiveReviewCount` (line 645)


### `src/bun/agents/safety.ts`

**Interfaces:**
- `ActionRecord` (line 10)
- `SafetyConfig` (line 16)

**Functions:**
- `hashArgs` (line 48)
- `recordAction` (line 64)
- `clearAgentHistory` (line 104)
- `createActionTimeout` (line 118)
- `getBackoffDelay` (line 143)
- `isTransientError` (line 155)
- `loadSafetyConfig` (line 193)

**Exports:**
- `DEFAULT_CONFIG` (line 27)
- `agentWindows` (line 39)


### `src/bun/agents/summarizer.ts`

**Interfaces:**
- `PartRow` (line 216)

**Functions:**
- `summarizeConversation` (line 50)
- `chunkTranscript` (line 195)
- `buildPrunedContent` (line 224)
- `pruneToolResult` (line 242)
- `truncate` (line 309)
- `safeParseJson` (line 313)


### `src/bun/agents/tools/communication.ts`

**Exports:**
- `communicationTools` (line 5)


### `src/bun/agents/tools/file-ops.ts`

**Interfaces:**
- `PatchHunk` (line 555)

**Types:**
- `FileConflictCallback` (line 905)

**Functions:**
- `writeAndNotify` (line 15)
- `formatDiagnosticsSuffix` (line 25)
- `validatePath` (line 42)
- `sliceFileContent` (line 126)
- `applyEditReplace` (line 193)
- `parseUnifiedDiff` (line 567)
- `findHunkOffset` (line 607)
- `createTrackedFileTools` (line 930)
- `vp` (line 937)
- `buildTree` (line 1160)

**Exports:**
- `fileOpsTools` (line 1621)


### `src/bun/agents/tools/file-tracker.ts`

**Classes:**
- `FileTracker` (line 31)

**Interfaces:**
- `TrackedFile` (line 14)

**Types:**
- `FreshnessResult` (line 18)

**Functions:**
- `getMtimeMs` (line 23)

**Methods:**
- `track` (line 39)
- `checkFreshness` (line 53)
- `trackWrite` (line 75)
- `getModifiedFiles` (line 81)
- `remove` (line 86)
- `clear` (line 91)


### `src/bun/agents/tools/git.ts`

**Functions:**
- `getGitSetting` (line 13)
- `formatCommitMessage` (line 26)

**Exports:**
- `gitTools` (line 720)


### `src/bun/agents/tools/ignore.ts`

**Interfaces:**
- `IgnoreFilter` (line 47)

**Functions:**
- `clearIgnoreCache` (line 63)
- `createIgnoreFilter` (line 78)
- `extendIgnoreFilter` (line 102)
- `isPathIgnored` (line 125)
- `loadDirGitignore` (line 161)
- `parseGitignore` (line 177)

**Methods:**
- `isIgnored` (line 85)
- `isIgnored` (line 110)


### `src/bun/agents/tools/index.ts`

**Interfaces:**
- `ToolDefinition` (line 24)
- `ToolRegistryEntry` (line 30)

**Types:**
- `ToolCategory` (line 22)

**Functions:**
- `registerTools` (line 58)
- `clearToolCache` (line 79)
- `getToolsForAgent` (line 100)
- `getAllTools` (line 158)
- `getToolDefinitions` (line 169)


### `src/bun/agents/tools/kanban.ts`

**Types:**
- `CriteriaCheckResult` (line 74)

**Functions:**
- `notifyKanban` (line 8)
- `notifyTaskInReviewHandler` (line 21)
- `parseCriteria` (line 40)
- `normalizeTaskCriteria` (line 63)
- `checkAllCriteriaMet` (line 80)
- `createKanbanTools` (line 96)
- `createKanbanToolsImpl` (line 104)
- `resolve` (line 384)
- `resolve` (line 458)

**Exports:**
- `kanbanTools` (line 102)


### `src/bun/agents/tools/lsp.ts`

**Functions:**
- `ensureOpen` (line 16)
- `formatDiagnostics` (line 42)
- `severityLabel` (line 249)
- `symbolKindLabel` (line 259)

**Exports:**
- `lspTools` (line 275)


### `src/bun/agents/tools/notes.ts`

**Functions:**
- `resolveProjectId` (line 18)
- `createDecisionsTool` (line 171)

**Exports:**
- `notesTools` (line 42)


### `src/bun/agents/tools/planning.ts`

**Interfaces:**
- `TaskDefinition` (line 12)

**Functions:**
- `resolveProjectId` (line 35)
- `peekTaskDefinitions` (line 67)
- `drainTaskDefinitions` (line 72)
- `restoreTaskDefinitions` (line 79)

**Exports:**
- `taskDefinitionSchema` (line 22)
- `planningTools` (line 87)


### `src/bun/agents/tools/pm-tools.ts`

**Interfaces:**
- `PMToolsDeps` (line 40)

**Types:**
- `TodoItem` (line 114)

**Functions:**
- `getTodoItems` (line 117)
- `setTodoItems` (line 127)
- `getActiveListId` (line 138)
- `setActiveListId` (line 148)
- `autoMarkTodoDone` (line 163)
- `autoAdvanceTodo` (line 201)
- `getActiveTodoStatus` (line 213)
- `createPMTools` (line 245)
- `checkFile` (line 865)


### `src/bun/agents/tools/process.ts`

**Interfaces:**
- `BackgroundJob` (line 14)

**Functions:**
- `pruneOldJobs` (line 28)
- `formatElapsed` (line 260)

**Exports:**
- `processTools` (line 271)


### `src/bun/agents/tools/scheduler.ts`

**Functions:**
- `buildConfig` (line 180)

**Exports:**
- `schedulerTools` (line 42)


### `src/bun/agents/tools/screenshot.ts`

**Functions:**
- `findChrome` (line 32)
- `captureScreenshot` (line 47)
- `getDevServerUrl` (line 112)
- `resizeToFit` (line 210)

**Exports:**
- `screenshotTools` (line 294)


### `src/bun/agents/tools/shell.ts`

**Types:**
- `ShellApprovalHandler` (line 109)

**Functions:**
- `isBlockedCommand` (line 21)
- `which` (line 34)
- `resolveShell` (line 49)
- `setShellApprovalHandler` (line 118)
- `resetShellAutoApprove` (line 122)
- `killProcessTree` (line 130)
- `killProc` (line 209)

**Exports:**
- `shellTools` (line 273)


### `src/bun/agents/tools/skills.ts`

**Functions:**
- `extractMandatoryFiles` (line 14)

**Exports:**
- `skillTools` (line 38)


### `src/bun/agents/tools/system.ts`

**Exports:**
- `systemTools` (line 179)


### `src/bun/agents/tools/truncation.ts`

**Interfaces:**
- `TruncateOptions` (line 26)
- `TruncateResult` (line 33)

**Functions:**
- `initTruncationDir` (line 48)
- `getTruncationDir` (line 59)
- `truncateOutput` (line 84)
- `truncateReadFile` (line 161)
- `truncateShellOutput` (line 166)
- `truncateSearchResults` (line 171)
- `truncateTree` (line 176)
- `cleanupTruncationFiles` (line 188)


### `src/bun/agents/tools/web.ts`

**Functions:**
- `getIntegrationKey` (line 13)
- `stripHtml` (line 26)
- `ddgSearch` (line 37)
- `tavilySearch` (line 86)

**Exports:**
- `webTools` (line 371)


### `src/bun/agents/types.ts`

**Interfaces:**
- `AgentConfig` (line 26)
- `AgentTask` (line 38)
- `AgentResult` (line 46)
- `AgentActivityEvent` (line 60)
- `RunningAgent` (line 86)

**Types:**
- `AgentRole` (line 1)
- `AgentStatus` (line 17)


### `src/bun/channels/chunker.ts`

**Functions:**
- `chunkMessage` (line 7)


### `src/bun/channels/discord-adapter.ts`

**Classes:**
- `DiscordAdapter` (line 10)

**Methods:**
- `getStatus` (line 15)
- `onMessage` (line 22)
- `connect` (line 26)
- `disconnect` (line 46)
- `sendMessage` (line 53)


### `src/bun/channels/email-adapter.ts`

**Classes:**
- `EmailAdapter` (line 18)

**Interfaces:**
- `EmailChannelConfig` (line 5)

**Methods:**
- `onMessage` (line 30)
- `getStatus` (line 31)
- `connect` (line 33)
- `startIdleLoop` (line 64)
- `processEmail` (line 137)
- `disconnect` (line 190)
- `sendMessage` (line 197)


### `src/bun/channels/index.ts`

**Exports:**
- `registerAdapter` (line 2)
- `initChannelManager` (line 2)
- `sendChannelMessage` (line 2)
- `getChannelStatuses` (line 2)
- `shutdownChannelManager` (line 2)


### `src/bun/channels/manager.ts`

**Interfaces:**
- `ChannelStatus` (line 43)

**Types:**
- `AdapterFactory` (line 34)
- `GetOrCreateEngine` (line 40)

**Functions:**
- `registerAdapter` (line 79)
- `initChannelManager` (line 93)
- `sendChannelMessage` (line 165)
- `broadcastTaskDoneNotification` (line 209)
- `broadcastSchedulerResult` (line 250)
- `getChannelStatuses` (line 282)
- `getAdapterStatus` (line 301)
- `getChannelPlatform` (line 309)
- `getOrCreateProjectChannelConversation` (line 322)
- `disconnectChannel` (line 355)
- `connectSingleChannel` (line 371)
- `_connectSingleChannel` (line 385)
- `shutdownChannelManager` (line 435)
- `broadcastQR` (line 464)
- `handleIncomingMessage` (line 480)
- `getOrCreateChannelConversation` (line 585)
- `parseJsonConfig` (line 644)


### `src/bun/channels/types.ts`

**Interfaces:**
- `IncomingMessage` (line 6)
- `SendOptions` (line 16)
- `ChannelConfig` (line 22)
- `ChannelAdapter` (line 30)

**Types:**
- `ChannelPlatform` (line 3)
- `ConnectionStatus` (line 4)


### `src/bun/channels/whatsapp-adapter.ts`

**Classes:**
- `WhatsAppAdapter` (line 9)

**Methods:**
- `onMessage` (line 21)
- `onQR` (line 22)
- `getStatus` (line 23)
- `getDefaultRecipient` (line 24)
- `connect` (line 31)
- `disconnect` (line 135)
- `sendMessage` (line 141)


### `src/bun/channels/whatsapp-auth-store.ts`

**Functions:**
- `useSQLiteAuthState` (line 5)
- `saveCreds` (line 24)


### `src/bun/db/audit.ts`

**Interfaces:**
- `AuditEntry` (line 10)

**Functions:**
- `getInsertStmt` (line 22)
- `logAudit` (line 35)


### `src/bun/db/connection.ts`

**Functions:**
- `logDbError` (line 14)
- `wrapStatement` (line 32)
- `wrapDatabase` (line 55)
- `openDatabase` (line 103)
- `closeDatabase` (line 141)
- `runWalCheckpoint` (line 152)
- `startWalCheckpointTimer` (line 158)

**Methods:**
- `get` (line 34)
- `get` (line 57)

**Exports:**
- `sqlite` (line 139)


### `src/bun/db/error-logger.ts`

**Functions:**
- `getLogsDir` (line 18)
- `getLogPath` (line 28)
- `rotateIfNeeded` (line 32)
- `logErrorToAudit` (line 61)
- `logError` (line 81)
- `initGlobalErrorHandlers` (line 121)


### `src/bun/db/index.ts`

**Exports:**
- `db` (line 7)
- `closeDatabase` (line 10)


### `src/bun/db/maintenance.ts`

**Functions:**
- `runIncrementalMaintenance` (line 12)
- `runFullVacuum` (line 19)
- `checkpointWal` (line 27)
- `maybeRunStartupMaintenance` (line 33)
- `pruneOldLogData` (line 52)
- `getLastVacuumTimestamp` (line 78)
- `recordVacuumTimestamp` (line 90)


### `src/bun/db/migrate.ts`

**Interfaces:**
- `Migration` (line 30)

**Functions:**
- `runMigrations` (line 51)


### `src/bun/db/migrations/v10_disable-db-viewer-plugin.ts`

**Functions:**
- `run` (line 11)

**Exports:**
- `name` (line 3)


### `src/bun/db/migrations/v1_initial-schema.ts`

**Functions:**
- `run` (line 5)

**Exports:**
- `name` (line 3)


### `src/bun/db/migrations/v2_plugin-prompt.ts`

**Functions:**
- `run` (line 5)

**Exports:**
- `name` (line 3)


### `src/bun/db/migrations/v3_agent-sessions.ts`

**Functions:**
- `run` (line 5)

**Exports:**
- `name` (line 3)


### `src/bun/db/migrations/v4_inline-agents.ts`

**Functions:**
- `run` (line 5)

**Exports:**
- `name` (line 3)


### `src/bun/db/migrations/v5_message-parts-agent-name.ts`

**Functions:**
- `run` (line 5)

**Exports:**
- `name` (line 3)


### `src/bun/db/migrations/v6_verification-status.ts`

**Functions:**
- `run` (line 5)

**Exports:**
- `name` (line 3)


### `src/bun/db/migrations/v7_reviewer-tools.ts`

**Functions:**
- `run` (line 10)

**Exports:**
- `name` (line 3)


### `src/bun/db/migrations/v8_perf-indexes.ts`

**Functions:**
- `run` (line 11)

**Exports:**
- `name` (line 3)


### `src/bun/db/migrations/v9_fix-mcp-config-encoding.ts`

**Functions:**
- `run` (line 18)

**Exports:**
- `name` (line 3)


### `src/bun/db/schema.ts`

**Exports:**
- `settings` (line 9)
- `aiProviders` (line 29)
- `projects` (line 59)
- `agents` (line 83)
- `agentTools` (line 117)
- `conversations` (line 132)
- `messages` (line 143)
- `conversationSummaries` (line 157)
- `notes` (line 169)
- `kanbanTasks` (line 191)
- `kanbanTaskActivity` (line 229)
- `plugins` (line 250)
- `channels` (line 265)
- `deployEnvironments` (line 279)
- `deployHistory` (line 290)
- `prompts` (line 305)
- `inboxMessages` (line 318)
- `whatsappSessions` (line 338)
- `notificationPreferences` (line 346)
- `inboxRules` (line 357)
- `cronJobs` (line 371)
- `cronJobHistory` (line 390)
- `automationRules` (line 404)
- `pullRequests` (line 419)
- `prComments` (line 440)
- `webhookConfigs` (line 454)
- `webhookEvents` (line 469)
- `githubIssues` (line 488)
- `branchStrategies` (line 505)
- `costBudgets` (line 526)
- `auditLog` (line 541)
- `messageParts` (line 555)


### `src/bun/db/seed.ts`

**Functions:**
- `getDefaultAgentTools` (line 1198)
- `seedDatabase` (line 1213)
- `seedAgentTools` (line 1355)


### `src/bun/db/summaries.ts`

**Functions:**
- `createSummary` (line 9)
- `getLatestSummary` (line 28)
- `deleteSummariesForConversation` (line 50)


### `src/bun/discord/bot.ts`

**Classes:**
- `DiscordBot` (line 5)

**Types:**
- `BotStatus` (line 3)

**Methods:**
- `createClient` (line 20)
- `connect` (line 57)
- `scheduleReconnect` (line 68)
- `sendToChannel` (line 89)
- `getStatus` (line 100)
- `shutdown` (line 104)


### `src/bun/engine-manager.ts`

**Interfaces:**
- `AgentControllerEntry` (line 25)

**Functions:**
- `registerAgentController` (line 31)
- `unregisterAgentController` (line 37)
- `abortAllAgents` (line 42)
- `abortAgentByName` (line 55)
- `getRunningAgentCount` (line 70)
- `getRunningAgentNames` (line 75)
- `getAllRunningAgents` (line 82)
- `getSystemActivity` (line 96)
- `setAppFocused` (line 118)
- `getStatusReport` (line 126)
- `removeEngine` (line 199)
- `evictOldestIdleEngine` (line 214)
- `setMainWindowRef` (line 236)
- `broadcastToWebview` (line 246)
- `linkAgentResponseToInbox` (line 262)
- `resolveShellApproval` (line 293)
- `getShellApprovalMode` (line 309)
- `installShellApprovalHandler` (line 327)
- `resolveUserQuestion` (line 382)
- `askUserQuestion` (line 398)
- `getOrCreateEngine` (line 427)

**Methods:**
- `onAgentActivity` (line 573)

**Exports:**
- `engines` (line 18)


### `src/bun/index.ts`

**Interfaces:**
- `WindowState` (line 34)

**Functions:**
- `getWindowStateFilePath` (line 44)
- `loadWindowState` (line 48)
- `saveWindowState` (line 82)
- `debounce` (line 98)
- `getMainViewUrl` (line 107)
- `attachWindowListeners` (line 273)
- `setWindowTitlebarIcon` (line 345)
- `toWide` (line 354)
- `showOrRestoreWindow` (line 397)


### `src/bun/lib/git-runner.ts`

**Functions:**
- `runGit` (line 4)
- `killProcess` (line 11)


### `src/bun/lsp/client.ts`

**Classes:**
- `LSPClient` (line 48)

**Interfaces:**
- `OpenDocument` (line 31)

**Types:**
- `ClientState` (line 29)

**Functions:**
- `onDiags` (line 235)
- `pathToUri` (line 385)
- `uriToPath` (line 396)
- `normalizeLocations` (line 405)

**Methods:**
- `initialize` (line 70)
- `shutdown` (line 126)
- `openDocument` (line 158)
- `notifyDocumentChanged` (line 171)
- `closeDocument` (line 188)
- `getDiagnostics` (line 202)
- `getAllDiagnostics` (line 217)
- `waitForDiagnostics` (line 226)
- `resolveWaiters` (line 249)
- `removeWaiter` (line 268)
- `hover` (line 279)
- `definition` (line 299)
- `references` (line 316)
- `documentSymbols` (line 334)
- `handleNotification` (line 362)


### `src/bun/lsp/installer.ts`

**Types:**
- `InstallStatus` (line 27)

**Functions:**
- `getManagedDir` (line 13)
- `getManagedBinDir` (line 18)
- `getManagedBinaryDir` (line 23)
- `resolveServerBinary` (line 39)
- `getManagedBinaryPath` (line 74)
- `getInstallStatus` (line 93)
- `installServer` (line 111)
- `uninstallServer` (line 139)
- `installViaBun` (line 172)
- `installViaGo` (line 196)
- `installViaGitHub` (line 213)
- `getPlatformString` (line 263)


### `src/bun/lsp/jsonrpc.ts`

**Classes:**
- `JsonRpcTransport` (line 32)

**Interfaces:**
- `StdioProcess` (line 8)
- `PendingRequest` (line 17)

**Types:**
- `NotificationHandler` (line 23)

**Methods:**
- `setNotificationHandler` (line 44)
- `sendRequest` (line 49)
- `sendNotification` (line 67)
- `dispose` (line 74)
- `writeMessage` (line 85)
- `startReading` (line 95)
- `processBuffer` (line 116)
- `handleMessage` (line 149)


### `src/bun/lsp/servers.ts`

**Interfaces:**
- `InstallDef` (line 5)
- `ServerDef` (line 17)

**Functions:**
- `getServerForExtension` (line 181)
- `getAllServerDefs` (line 186)

**Exports:**
- `SERVER_DEFS` (line 38)


### `src/bun/lsp/types.ts`

**Interfaces:**
- `JsonRpcRequest` (line 7)
- `JsonRpcResponse` (line 14)
- `JsonRpcNotification` (line 21)
- `Position` (line 33)
- `Range` (line 38)
- `Location` (line 43)
- `TextDocumentIdentifier` (line 48)
- `TextDocumentPositionParams` (line 52)
- `TextDocumentItem` (line 57)
- `VersionedTextDocumentIdentifier` (line 64)
- `TextDocumentContentChangeEvent` (line 68)
- `Diagnostic` (line 84)
- `DiagnosticRelatedInformation` (line 93)
- `PublishDiagnosticsParams` (line 98)
- `Hover` (line 107)
- `MarkupContent` (line 112)
- `DocumentSymbol` (line 130)
- `SymbolInformation` (line 139)
- `InitializeParams` (line 150)
- `WorkspaceFolder` (line 158)
- `ClientCapabilities` (line 163)
- `InitializeResult` (line 177)
- `ServerCapabilities` (line 182)
- `TextDocumentSyncOptions` (line 190)
- `ReferenceParams` (line 199)

**Types:**
- `JsonRpcMessage` (line 27)
- `LSPServerState` (line 207)


### `src/bun/mcp/client.ts`

**Interfaces:**
- `McpServerConfig` (line 16)
- `McpEntry` (line 38)

**Types:**
- `McpServerStatus` (line 36)

**Functions:**
- `loadMcpServers` (line 23)
- `initMcpClients` (line 59)
- `reloadMcpClients` (line 78)
- `shutdownMcpClients` (line 86)
- `disconnectMcpServer` (line 101)
- `reconnectMcpServer` (line 115)
- `getMcpTools` (line 158)
- `getMcpStatus` (line 171)
- `sanitize` (line 177)
- `connectServer` (line 179)
- `scheduleRetry` (line 253)
- `connectLocal` (line 270)
- `connectRemote` (line 294)


### `src/bun/notifications/desktop.ts`

**Functions:**
- `sendDesktopNotification` (line 16)
- `sendWindowsToast` (line 28)
- `esc` (line 30)


### `src/bun/notifications/native.ts`

**Functions:**
- `sendNativeNotification` (line 8)


### `src/bun/plugins/api.ts`

**Functions:**
- `createPluginAPI` (line 20)

**Methods:**
- `registerTool` (line 31)
- `registerHook` (line 37)
- `getSettings` (line 40)
- `setSettings` (line 54)
- `getProjectContext` (line 61)
- `log` (line 64)
- `onFileChange` (line 68)
- `registerSidebarItem` (line 71)
- `registerProjectTab` (line 74)
- `registerSettingsSection` (line 77)
- `registerChatCommand` (line 80)
- `registerTheme` (line 83)


### `src/bun/plugins/extensions.ts`

**Interfaces:**
- `PluginSidebarItem` (line 6)
- `PluginProjectTab` (line 13)
- `PluginSettingsField` (line 19)
- `PluginSettingsSection` (line 27)
- `PluginChatCommand` (line 34)
- `PluginTheme` (line 40)

**Functions:**
- `extRegisterSidebarItem` (line 55)
- `extRegisterProjectTab` (line 59)
- `extRegisterSettingsSection` (line 63)
- `extRegisterChatCommand` (line 67)
- `extRegisterTheme` (line 71)
- `clearPluginExtensions` (line 76)
- `getAllExtensions` (line 86)


### `src/bun/plugins/index.ts`

**Functions:**
- `initPlugins` (line 15)

**Exports:**
- `getPluginInstances` (line 11)
- `enablePlugin` (line 11)
- `disablePlugin` (line 11)
- `uninstallPlugin` (line 11)
- `notifyFileChange` (line 11)
- `PluginManifest` (line 12)
- `PluginInstance` (line 12)
- `PluginAPI` (line 12)


### `src/bun/plugins/loader.ts`

**Interfaces:**
- `LoadedPlugin` (line 7)

**Functions:**
- `scanPluginDirectory` (line 13)


### `src/bun/plugins/lsp-manager/index.ts`

**Types:**
- `SpawnResult` (line 25)

**Functions:**
- `poolKey` (line 21)
- `getOrSpawnServer` (line 30)
- `getServerForFile` (line 79)
- `shutdownAll` (line 94)
- `activate` (line 107)
- `deactivate` (line 368)
- `symbolKindLabel` (line 375)
- `severityLabel` (line 387)

**Exports:**
- `openDocs` (line 19)
- `pluginSettings` (line 105)


### `src/bun/plugins/manifest.ts`

**Functions:**
- `validateManifest` (line 22)


### `src/bun/plugins/registry.ts`

**Functions:**
- `activatePlugin` (line 14)
- `deactivatePlugin` (line 80)
- `uninstallPlugin` (line 98)
- `enablePlugin` (line 115)
- `disablePlugin` (line 125)
- `getPluginInstances` (line 130)
- `getPluginInstance` (line 134)
- `notifyFileChange` (line 139)


### `src/bun/plugins/types.ts`

**Interfaces:**
- `PluginHooks` (line 17)
- `PluginSettingDef` (line 25)
- `PluginManifest` (line 32)
- `PluginModule` (line 48)
- `PluginAPI` (line 61)
- `PluginInstance` (line 79)

**Types:**
- `PluginPermission` (line 14)
- `FileChangeCallback` (line 58)

**Exports:**
- `PluginSidebarItem` (line 11)
- `PluginProjectTab` (line 11)
- `PluginSettingsSection` (line 11)
- `PluginChatCommand` (line 11)
- `PluginTheme` (line 11)


### `src/bun/providers/anthropic.ts`

**Classes:**
- `AnthropicAdapter` (line 20)

**Methods:**
- `createModel` (line 32)
- `listModels` (line 38)
- `testConnection` (line 56)


### `src/bun/providers/deepseek.ts`

**Classes:**
- `DeepSeekAdapter` (line 13)

**Methods:**
- `createModel` (line 25)
- `listModels` (line 29)
- `testConnection` (line 44)


### `src/bun/providers/google.ts`

**Classes:**
- `GoogleAdapter` (line 16)

**Methods:**
- `createModel` (line 28)
- `listModels` (line 32)
- `testConnection` (line 51)


### `src/bun/providers/groq.ts`

**Classes:**
- `GroqAdapter` (line 16)

**Methods:**
- `createModel` (line 28)
- `listModels` (line 32)
- `testConnection` (line 50)


### `src/bun/providers/headers.ts`

**Exports:**
- `PROVIDER_HEADERS` (line 7)


### `src/bun/providers/index.ts`

**Functions:**
- `createProviderAdapter` (line 29)
- `createProviderAdapterWithFallback` (line 65)

**Exports:**
- `ProviderAdapter` (line 12)
- `ProviderConfig` (line 12)
- `getContextLimit` (line 13)
- `getDefaultModel` (line 13)


### `src/bun/providers/models.ts`

**Functions:**
- `getContextLimit` (line 28)
- `clearContextLimitCache` (line 62)
- `getDefaultModel` (line 70)


### `src/bun/providers/ollama.ts`

**Classes:**
- `OllamaAdapter` (line 23)

**Interfaces:**
- `OllamaTagsResponse` (line 19)

**Methods:**
- `createModel` (line 37)
- `listModels` (line 46)
- `testConnection` (line 68)


### `src/bun/providers/openai.ts`

**Classes:**
- `OpenAIAdapter` (line 41)

**Functions:**
- `normalizeBaseUrl` (line 12)
- `joinUrl` (line 21)
- `naturalSort` (line 27)
- `interceptFetch` (line 61)

**Methods:**
- `createModel` (line 53)
- `listModels` (line 97)
- `testConnection` (line 127)


### `src/bun/providers/openrouter.ts`

**Classes:**
- `OpenRouterAdapter` (line 25)

**Methods:**
- `createModel` (line 39)
- `listModels` (line 43)
- `testConnection` (line 47)


### `src/bun/providers/types.ts`

**Interfaces:**
- `ProviderConfig` (line 3)
- `ProviderAdapter` (line 12)


### `src/bun/providers/xai.ts`

**Classes:**
- `XaiAdapter` (line 15)

**Methods:**
- `createModel` (line 27)
- `listModels` (line 31)
- `testConnection` (line 49)


### `src/bun/providers/zai.ts`

**Classes:**
- `ZaiAdapter` (line 18)

**Methods:**
- `createModel` (line 31)
- `listModels` (line 35)
- `testConnection` (line 39)


### `src/bun/rpc-registration.ts`

**Functions:**
- `getLastKnownRoute` (line 56)
- `onSettingChange` (line 60)
- `withErrorToast` (line 69)
- `walk` (line 540)

**Exports:**
- `rpc` (line 86)


### `src/bun/rpc/agents.ts`

**Interfaces:**
- `AgentListItem` (line 7)

**Functions:**
- `getAgentsList` (line 26)
- `updateAgent` (line 48)
- `resetAgent` (line 73)
- `createAgent` (line 96)
- `deleteAgent` (line 122)
- `getAgentToolsList` (line 140)
- `setAgentToolsList` (line 152)
- `getAllToolDefinitions` (line 182)
- `resetAgentToolsToDefaults` (line 189)


### `src/bun/rpc/analytics.ts`

**Interfaces:**
- `DayRow` (line 14)
- `ColRow` (line 23)
- `PriRow` (line 28)
- `AvgRow` (line 33)
- `SummaryRow` (line 56)

**Functions:**
- `getProjectStats` (line 10)
- `getAnalyticsSummary` (line 55)


### `src/bun/rpc/audit.ts`

**Interfaces:**
- `AuditLogEntry` (line 6)

**Functions:**
- `getAuditLog` (line 18)
- `clearAuditLog` (line 86)


### `src/bun/rpc/automation.ts`

**Functions:**
- `getAutomationRules` (line 6)
- `createAutomationRule` (line 15)
- `updateAutomationRule` (line 34)
- `deleteAutomationRule` (line 53)
- `getAutomationTemplates` (line 59)


### `src/bun/rpc/backup.ts`

**Functions:**
- `getBackupsDir` (line 10)
- `getDbPath` (line 18)
- `createBackup` (line 25)
- `listBackups` (line 41)
- `deleteBackup` (line 58)
- `restoreBackup` (line 71)


### `src/bun/rpc/branch-strategy.ts`

**Functions:**
- `getBranchStrategy` (line 8)
- `saveBranchStrategy` (line 30)
- `createFeatureBranch` (line 90)
- `getMergedBranches` (line 122)
- `cleanupMergedBranches` (line 126)


### `src/bun/rpc/conversations.ts`

**Interfaces:**
- `ConversationListItem` (line 7)
- `MessageListItem` (line 238)

**Functions:**
- `getConversations` (line 20)
- `getArchivedConversations` (line 40)
- `createConversation` (line 62)
- `deleteMessage` (line 114)
- `clearConversationMessages` (line 122)
- `deleteConversation` (line 135)
- `renameConversation` (line 172)
- `pinConversation` (line 186)
- `archiveConversation` (line 200)
- `restoreConversation` (line 213)
- `archiveOldConversations` (line 226)
- `getMessages` (line 257)
- `branchConversation` (line 298)
- `getMessageParts` (line 369)
- `mapConversation` (line 407)
- `mapMessage` (line 419)


### `src/bun/rpc/council.ts`

**Interfaces:**
- `CouncilSession` (line 54)
- `RoundResponse` (line 158)

**Types:**
- `AgentEntry` (line 156)

**Functions:**
- `emit` (line 66)
- `resolveProvider` (line 70)
- `truncate` (line 92)
- `startCouncilSession` (line 102)
- `stopCouncilSession` (line 130)
- `answerCouncilQuestion` (line 138)
- `runParallelRound` (line 169)
- `runBordaRanking` (line 245)
- `runSession` (line 305)


### `src/bun/rpc/cron.ts`

**Functions:**
- `getGlobalTimezone` (line 11)
- `getCronJobs` (line 26)
- `createCronJob` (line 38)
- `updateCronJob` (line 67)
- `deleteCronJob` (line 91)
- `getCronJobHistory` (line 98)
- `clearCronJobHistory` (line 107)
- `previewCronSchedule` (line 116)
- `triggerCronJob` (line 120)


### `src/bun/rpc/dashboard.ts`

**Functions:**
- `buildDashboardSystemPrompt` (line 51)
- `createDashboardTools` (line 114)
- `checkFile` (line 507)
- `getDefaultProviderRow` (line 549)
- `sendDashboardMessage` (line 563)
- `abortDashboardMessage` (line 670)
- `clearDashboardSession` (line 680)


### `src/bun/rpc/db-viewer.ts`

**Functions:**
- `dbViewerGetTables` (line 38)
- `dbViewerGetRows` (line 44)
- `dbViewerDeleteRow` (line 76)


### `src/bun/rpc/deploy.ts`

**Functions:**
- `getEnvironments` (line 7)
- `saveEnvironment` (line 11)
- `deleteEnvironment` (line 41)
- `getDeployHistory` (line 46)
- `executeDeploy` (line 54)


### `src/bun/rpc/discord.ts`

**Functions:**
- `setDiscordStatusGetter` (line 9)
- `getDiscordConfigs` (line 13)
- `saveDiscordConfig` (line 17)
- `deleteDiscordConfig` (line 65)
- `testDiscordConnection` (line 70)
- `getDiscordStatus` (line 94)


### `src/bun/rpc/email.ts`

**Functions:**
- `getEmailConfigs` (line 5)
- `saveEmailConfig` (line 9)
- `deleteEmailConfig` (line 58)
- `testEmailConnection` (line 63)


### `src/bun/rpc/export-import.ts`

**Functions:**
- `exportProjectData` (line 12)
- `importProjectData` (line 68)
- `insertRows` (line 121)


### `src/bun/rpc/git.ts`

**Functions:**
- `getProject` (line 6)
- `getWorkspacePath` (line 12)
- `ensureRemote` (line 17)
- `getGitStatus` (line 26)
- `getGitBranches` (line 36)
- `getGitLog` (line 47)
- `getGitDiff` (line 57)
- `getCommitFiles` (line 64)
- `gitCheckout` (line 74)
- `gitCreateBranch` (line 80)
- `gitStageFiles` (line 86)
- `gitCommit` (line 92)
- `gitPush` (line 98)
- `gitPull` (line 108)
- `getConflicts` (line 137)
- `getConflictDiff` (line 144)
- `gitDeleteBranch` (line 150)
- `gitMergeBranch` (line 161)
- `gitRebaseBranch` (line 199)
- `gitAbortMerge` (line 205)
- `getMergedBranches` (line 214)
- `cleanupMergedBranches` (line 226)


### `src/bun/rpc/github-api.ts`

**Functions:**
- `getGitHubPAT` (line 9)
- `githubFetch` (line 20)
- `parseGithubUrl` (line 49)
- `getProjectGithubRepo` (line 58)
- `validateGithubToken` (line 76)
- `getGithubConfigError` (line 93)


### `src/bun/rpc/github-issues.ts`

**Functions:**
- `getGithubIssues` (line 19)
- `syncGithubIssues` (line 40)
- `createGithubIssueFromTask` (line 131)
- `linkIssueToTask` (line 190)
- `closeGithubIssueForTask` (line 200)


### `src/bun/rpc/health.ts`

**Interfaces:**
- `HealthStatus` (line 63)

**Functions:**
- `setSchedulerRunning` (line 55)
- `checkDatabaseSubsystem` (line 109)
- `checkAiProviderSubsystem` (line 164)
- `checkWorkspaceSubsystem` (line 205)
- `checkSchedulerSubsystem` (line 238)
- `checkIntegrationsSubsystem` (line 256)
- `checkEnginesSubsystem` (line 291)
- `checkBackendSubsystem` (line 320)
- `getHealthStatus` (line 336)
- `checkDatabase` (line 365)
- `restartScheduler` (line 390)
- `cleanupEngines` (line 408)


### `src/bun/rpc/inbox-rules.ts`

**Interfaces:**
- `RuleCondition` (line 5)
- `RuleAction` (line 11)
- `InboxMessageParams` (line 16)

**Functions:**
- `matchesCondition` (line 27)
- `applyInboxRules` (line 39)
- `getInboxRulesList` (line 78)
- `createInboxRule` (line 83)
- `updateInboxRule` (line 94)
- `deleteInboxRule` (line 107)


### `src/bun/rpc/inbox.ts`

**Functions:**
- `getInboxMessages` (line 9)
- `markAsRead` (line 38)
- `markAsUnread` (line 43)
- `markAllAsRead` (line 48)
- `getUnreadCount` (line 59)
- `deleteInboxMessage` (line 66)
- `searchInboxMessages` (line 71)
- `archiveInboxMessage` (line 101)
- `unarchiveInboxMessage` (line 106)
- `bulkArchiveInboxMessages` (line 111)
- `bulkDeleteInboxMessages` (line 117)
- `bulkMarkAsReadInboxMessages` (line 123)
- `replyToInboxMessage` (line 129)
- `updateAgentResponse` (line 154)
- `writeInboxMessage` (line 158)


### `src/bun/rpc/kanban.ts`

**Interfaces:**
- `KanbanTask` (line 14)
- `CreateKanbanTaskParams` (line 33)
- `UpdateKanbanTaskParams` (line 46)

**Functions:**
- `getKanbanTasks` (line 70)
- `getKanbanTask` (line 83)
- `createKanbanTask` (line 96)
- `updateKanbanTask` (line 145)
- `moveKanbanTask` (line 178)
- `deleteKanbanTask` (line 229)
- `getTaskActivity` (line 241)
- `getProjectTaskStats` (line 252)
- `mapTask` (line 267)
- `logActivity` (line 288)


### `src/bun/rpc/lsp.ts`

**Functions:**
- `getLspSettings` (line 16)
- `getLspStatus` (line 29)
- `installLspServerHandler` (line 63)
- `uninstallLspServerHandler` (line 78)


### `src/bun/rpc/maintenance.ts`

**Functions:**
- `optimizeDatabase` (line 13)
- `vacuumDatabase` (line 18)
- `pruneDatabase` (line 23)


### `src/bun/rpc/mcp.ts`

**Interfaces:**
- `McpServerConfig` (line 4)

**Functions:**
- `getMcpConfig` (line 12)
- `getMcpStatusRpc` (line 46)
- `reconnectMcpServerRpc` (line 51)
- `disconnectMcpServerRpc` (line 57)
- `saveMcpConfig` (line 63)


### `src/bun/rpc/notes.ts`

**Functions:**
- `getProjectNotes` (line 8)
- `getNote` (line 16)
- `createNote` (line 26)
- `updateNote` (line 43)
- `deleteNote` (line 55)
- `getWorkspacePlans` (line 60)
- `deleteWorkspacePlan` (line 105)
- `searchNotes` (line 114)


### `src/bun/rpc/notifications.ts`

**Functions:**
- `getNotificationPreferences` (line 5)
- `saveNotificationPreference` (line 12)
- `shouldNotify` (line 41)


### `src/bun/rpc/plugin-extensions.ts`

**Functions:**
- `getPluginExtensions` (line 4)


### `src/bun/rpc/plugins.ts`

**Functions:**
- `getPluginsList` (line 6)
- `togglePlugin` (line 33)
- `getPluginSettings` (line 42)
- `savePluginSettings` (line 48)
- `savePluginPrompt` (line 57)


### `src/bun/rpc/projects.ts`

**Interfaces:**
- `ProjectListItem` (line 11)
- `CreateProjectParams` (line 43)

**Types:**
- `StmtCache` (line 275)

**Functions:**
- `getProjectsList` (line 26)
- `createProjectHandler` (line 63)
- `deleteProjectHandler` (line 213)
- `getProject` (line 223)
- `updateProject` (line 243)
- `buildStmts` (line 278)
- `getStmts` (line 308)
- `deleteProjectCascade` (line 317)
- `resetProjectData` (line 365)
- `saveProjectSetting` (line 398)
- `getProjectSettings` (line 428)
- `detectVerifyCommand` (line 447)
- `exists` (line 464)
- `readJson` (line 465)
- `listWorkspaceFiles` (line 589)
- `readWorkspaceFile` (line 661)
- `readWorkspaceImageFile` (line 700)
- `syncWorkspaceFolders` (line 740)


### `src/bun/rpc/prompts.ts`

**Functions:**
- `getPrompts` (line 5)
- `getPrompt` (line 9)
- `savePrompt` (line 14)
- `deletePrompt` (line 45)
- `searchPrompts` (line 50)


### `src/bun/rpc/providers.ts`

**Interfaces:**
- `ProviderListItem` (line 28)
- `SaveProviderParams` (line 61)

**Functions:**
- `normalizeBaseUrl` (line 15)
- `normalizeUrlForComparison` (line 23)
- `getProvidersList` (line 42)
- `saveProviderHandler` (line 75)
- `testProviderHandler` (line 161)
- `deleteProviderHandler` (line 207)
- `getConnectedProviderModelsHandler` (line 219)
- `listProviderModelsHandler` (line 259)
- `checkModelToolSupportHandler` (line 288)
- `listProviderModelsByIdHandler` (line 338)


### `src/bun/rpc/pulls.ts`

**Functions:**
- `mapPr` (line 9)
- `getPullRequests` (line 30)
- `createPullRequest` (line 42)
- `updatePullRequest` (line 97)
- `mergePullRequest` (line 113)
- `deletePullRequest` (line 175)
- `getPrDiff` (line 180)
- `getPrComments` (line 194)
- `addPrComment` (line 212)
- `deletePrComment` (line 233)
- `generatePrDescription` (line 240)
- `runGitInProject` (line 262)


### `src/bun/rpc/reset.ts`

**Functions:**
- `resetApplication` (line 14)


### `src/bun/rpc/search.ts`

**Interfaces:**
- `SearchResult` (line 3)

**Functions:**
- `globalSearch` (line 15)


### `src/bun/rpc/settings-export.ts`

**Interfaces:**
- `SettingsBundle` (line 15)

**Functions:**
- `exportSettings` (line 70)
- `importSettings` (line 188)


### `src/bun/rpc/settings.ts`

**Functions:**
- `getSettings` (line 11)
- `getRawSetting` (line 37)
- `getSetting` (line 57)
- `saveSetting` (line 86)


### `src/bun/rpc/skills.ts`

**Functions:**
- `getSkills` (line 7)
- `getSkill` (line 20)
- `refreshSkills` (line 36)
- `getSkillsDirectory` (line 41)
- `openSkillsFolder` (line 45)
- `openSkillInEditor` (line 64)
- `deleteSkill` (line 84)
- `getAvailableTools` (line 88)


### `src/bun/rpc/updater.ts`

**Functions:**
- `relayStatus` (line 6)
- `checkForUpdate` (line 17)
- `downloadUpdate` (line 35)
- `applyUpdate` (line 45)
- `queueWindowsUpdateFallback` (line 69)
- `esc` (line 89)


### `src/bun/rpc/webhooks.ts`

**Functions:**
- `getWebhookConfigs` (line 16)
- `saveWebhookConfig` (line 33)
- `deleteWebhookConfig` (line 65)
- `getWebhookEvents` (line 72)
- `pollGithubEvents` (line 96)
- `mapGithubEventType` (line 150)
- `buildEventTitle` (line 165)


### `src/bun/rpc/whatsapp.ts`

**Functions:**
- `getWhatsAppConfigs` (line 5)
- `saveWhatsAppConfig` (line 9)
- `deleteWhatsAppConfig` (line 34)
- `getWhatsAppStatus` (line 40)
- `getDefaultChannelProject` (line 50)
- `setDefaultChannelProject` (line 58)
- `connectWhatsApp` (line 71)


### `src/bun/scheduler/automation-engine.ts`

**Interfaces:**
- `TriggerCondition` (line 10)
- `TriggerConfig` (line 16)
- `AutomationAction` (line 21)

**Functions:**
- `matchesCondition` (line 26)
- `evaluateRules` (line 42)
- `initAutomationEngine` (line 87)
- `shutdownAutomationEngine` (line 103)


### `src/bun/scheduler/cron-scheduler.ts`

**Interfaces:**
- `ManagedJob` (line 14)

**Functions:**
- `triggerJobNow` (line 21)
- `runJob` (line 25)
- `startJob` (line 83)
- `stopJob` (line 95)
- `initCronScheduler` (line 103)
- `shutdownCronScheduler` (line 133)
- `refreshJob` (line 140)
- `getNextRuns` (line 152)


### `src/bun/scheduler/event-bus.ts`

**Classes:**
- `EventBusImpl` (line 15)

**Types:**
- `AutoDeskEvent` (line 4)

**Methods:**
- `emit` (line 22)
- `on` (line 27)
- `off` (line 31)
- `onAny` (line 35)
- `removeAllListeners` (line 39)

**Exports:**
- `eventBus` (line 44)


### `src/bun/scheduler/index.ts`

**Exports:**
- `eventBus` (line 2)
- `AutoDeskEvent` (line 2)
- `executeTask` (line 3)
- `setTaskExecutorEngine` (line 3)
- `TaskType` (line 3)
- `TaskResult` (line 3)
- `initCronScheduler` (line 4)
- `shutdownCronScheduler` (line 4)
- `refreshJob` (line 4)
- `getNextRuns` (line 4)
- `triggerJobNow` (line 4)
- `initAutomationEngine` (line 5)
- `shutdownAutomationEngine` (line 5)


### `src/bun/scheduler/task-executor.ts`

**Interfaces:**
- `TaskResult` (line 15)

**Types:**
- `TaskType` (line 13)
- `GetOrCreateEngine` (line 22)

**Functions:**
- `setTaskExecutorEngine` (line 26)
- `executeTask` (line 30)


### `src/bun/skills/loader.ts`

**Interfaces:**
- `SkillValidationError` (line 10)
- `Skill` (line 15)
- `SkillFrontmatter` (line 30)

**Functions:**
- `scanSkillsDirectory` (line 46)
- `parseSkillFile` (line 74)
- `validateSkill` (line 130)
- `resolveSkillName` (line 176)
- `extractFirstParagraph` (line 189)
- `loadSupportingFiles` (line 213)
- `collectFiles` (line 223)
- `loadAllSkills` (line 239)
- `executeBashInjections` (line 263)
- `substituteArguments` (line 290)
- `resolveSkillContent` (line 332)


### `src/bun/skills/registry.ts`

**Classes:**
- `SkillRegistry` (line 13)

**Methods:**
- `loadAll` (line 51)
- `reload` (line 88)
- `getAll` (line 93)
- `getByName` (line 98)
- `search` (line 106)
- `resolveContent` (line 117)
- `deleteSkill` (line 125)

**Exports:**
- `Skill` (line 7)
- `skillRegistry` (line 152)


### `src/bun/windows-registry.ts`

**Functions:**
- `registerWindowsUninstaller` (line 12)


## Data Flow

Router/Controller → Repository → Model/Schema

## Change Recipe

To add a new feature to the **bun** domain:

1. Update the model/schema in `src/bun/`
