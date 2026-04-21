# Domain: mainview

**Directory:** `src/mainview`
**Files:** 129
**Symbols:** 1085

## Files

### `src/mainview/App.tsx`

**Functions:**
- `App` (line 4)


### `src/mainview/components/activity/context-panel.tsx`

**Interfaces:**
- `ContextPanelProps` (line 8)

**Types:**
- `ContextTabId` (line 6)

**Functions:**
- `ContextPanel` (line 13)


### `src/mainview/components/activity/docs-tab.tsx`

**Interfaces:**
- `Note` (line 16)
- `Plan` (line 26)
- `SelectedDoc` (line 33)
- `DocsTabProps` (line 39)

**Functions:**
- `DocsTab` (line 43)
- `refresh` (line 73)
- `onKanbanMove` (line 74)
- `handleViewAllNotes` (line 88)
- `openNote` (line 94)
- `openPlan` (line 107)

**Methods:**
- `code` (line 287)


### `src/mainview/components/activity/files-tab.tsx`

**Interfaces:**
- `FileEntry` (line 28)
- `TreeNode` (line 36)
- `FilesTabProps` (line 42)
- `TreeItemProps` (line 149)

**Functions:**
- `isBinaryFile` (line 62)
- `isImageFile` (line 67)
- `getLanguage` (line 73)
- `FileIcon` (line 123)
- `formatSize` (line 138)
- `TreeItem` (line 157)
- `FilesTab` (line 238)
- `refresh` (line 278)
- `onKanbanMove` (line 279)
- `toggle` (line 300)
- `findNode` (line 318)
- `inject` (line 342)


### `src/mainview/components/analytics/charts.tsx`

**Interfaces:**
- `HoverTooltip` (line 8)
- `LineChartProps` (line 28)
- `BarChartProps` (line 111)
- `DonutChartProps` (line 201)
- `HeatmapProps` (line 281)
- `StatCardProps` (line 351)

**Functions:**
- `ChartTooltip` (line 14)
- `LineChart` (line 35)
- `BarChart` (line 117)
- `computeSlices` (line 208)
- `DonutChart` (line 219)
- `arcPath` (line 232)
- `ActivityHeatmap` (line 287)
- `showHour` (line 306)
- `StatCard` (line 358)
- `EmptyChart` (line 370)


### `src/mainview/components/chat/chat-input-popover.tsx`

**Interfaces:**
- `PopoverItem` (line 9)
- `UseInputPopoverOptions` (line 51)

**Functions:**
- `buildFileItem` (line 36)
- `useInputPopover` (line 61)

**Exports:**
- `SLASH_COMMANDS` (line 21)


### `src/mainview/components/chat/chat-input.tsx`

**Interfaces:**
- `ChatInputHandle` (line 30)
- `ChatInputProps` (line 36)
- `AttachmentFile` (line 78)

**Types:**
- `AttachmentType` (line 76)

**Functions:**
- `categorizeFile` (line 89)
- `processFiles` (line 107)
- `handleSlashSelect` (line 342)
- `handleFileSelect_mention` (line 403)
- `handleKeyDown` (line 526)

**Exports:**
- `TEXT_EXTENSIONS` (line 54)
- `IMAGE_EXTENSIONS` (line 65)
- `BINARY_DOC_EXTENSIONS` (line 70)
- `ChatInput` (line 131)


### `src/mainview/components/chat/chat-layout.tsx`

**Interfaces:**
- `ChatLayoutProps` (line 18)

**Functions:**
- `ChatLayout` (line 26)
- `handleMouseDown` (line 42)
- `onMouseMove` (line 282)
- `onMouseUp` (line 291)
- `onKeyDown` (line 302)


### `src/mainview/components/chat/code-block.tsx`

**Interfaces:**
- `CodeBlockProps` (line 7)

**Types:**
- `CodeBlockTheme` (line 5)

**Functions:**
- `getHighlighter` (line 24)
- `CodeBlock` (line 52)
- `handleCopy` (line 84)


### `src/mainview/components/chat/context-indicator.tsx`

**Interfaces:**
- `ContextIndicatorProps` (line 9)

**Functions:**
- `estimateTokens` (line 21)
- `formatTokens` (line 25)
- `ContextIndicator` (line 31)


### `src/mainview/components/chat/conversation-cost.tsx`

**Interfaces:**
- `ConversationCostProps` (line 7)
- `TokenTotals` (line 12)

**Functions:**
- `sumTokens` (line 17)
- `formatTokens` (line 35)
- `ConversationCost` (line 41)


### `src/mainview/components/chat/conversation-sidebar.tsx`

**Interfaces:**
- `ConversationSidebarProps` (line 8)

**Functions:**
- `ConversationSidebar` (line 21)
- `exitSelectMode` (line 45)
- `toggleSelected` (line 50)
- `toggleSelectAll` (line 67)
- `handler` (line 94)
- `startRename` (line 99)
- `commitRename` (line 105)
- `handleContextMenu` (line 113)
- `isInArchivedList` (line 119)


### `src/mainview/components/chat/image-lightbox.tsx`

**Functions:**
- `ImageLightbox` (line 4)
- `onKey` (line 6)


### `src/mainview/components/chat/message-actions-context.tsx`

**Interfaces:**
- `MessageActions` (line 12)

**Functions:**
- `MessageActionsProvider` (line 22)
- `useMessageActions` (line 41)


### `src/mainview/components/chat/message-bubble.tsx`

**Interfaces:**
- `MessageBubbleProps` (line 23)

**Functions:**
- `SearchHighlight` (line 35)
- `highlightChildren` (line 54)
- `AttachmentPreviews` (line 65)
- `PlanApprovalFooter` (line 120)
- `handleApprove` (line 131)
- `handleReject` (line 136)
- `onPartCreated` (line 289)
- `onPartUpdated` (line 309)
- `handleCopy` (line 360)
- `handleDeleteClick` (line 366)
- `handleRetry` (line 368)
- `handleBranch` (line 378)
- `h` (line 392)

**Methods:**
- `code` (line 209)
- `code` (line 395)

**Exports:**
- `Message` (line 21)
- `MessageBubble` (line 253)


### `src/mainview/components/chat/message-list.tsx`

**Classes:**
- `MessageErrorBoundary` (line 11)

**Interfaces:**
- `MessageListProps` (line 37)

**Functions:**
- `MessageList` (line 49)
- `handler` (line 68)
- `StreamingBubble` (line 266)
- `TypingRow` (line 275)
- `WaitingRow` (line 329)

**Methods:**
- `getDerivedStateFromError` (line 20)
- `render` (line 24)


### `src/mainview/components/chat/message-parts.tsx`

**Interfaces:**
- `MessagePartData` (line 23)
- `MessagePartsProps` (line 374)

**Functions:**
- `getAgentBorderColor` (line 58)
- `formatAgentDisplayName` (line 63)
- `ElapsedTimer` (line 116)
- `getAgentBadgeColor` (line 148)
- `TaskPromptCard` (line 155)

**Exports:**
- `ThinkingBlock` (line 82)
- `AGENT_BADGE_COLORS` (line 130)
- `MessageParts` (line 385)


### `src/mainview/components/chat/message-search.tsx`

**Interfaces:**
- `MessageSearchProps` (line 5)

**Functions:**
- `MessageSearch` (line 12)
- `handleKeyDown` (line 64)


### `src/mainview/components/chat/model-selector.tsx`

**Interfaces:**
- `ProviderModels` (line 10)
- `ModelSelectorProps` (line 24)

**Functions:**
- `ModelSelector` (line 29)


### `src/mainview/components/chat/plan-diff.tsx`

**Interfaces:**
- `DiffLine` (line 10)
- `SeparatorEntry` (line 19)
- `PlanDiffProps` (line 158)

**Types:**
- `DiffLineKind` (line 8)
- `CollapsedEntry` (line 24)

**Functions:**
- `buildLcsTable` (line 35)
- `buildDiff` (line 58)
- `collapseContext` (line 104)
- `PlanDiff` (line 164)


### `src/mainview/components/chat/prompts-dropdown.tsx`

**Interfaces:**
- `Prompt` (line 13)
- `PromptsDropdownProps` (line 21)

**Functions:**
- `PromptsDropdown` (line 26)


### `src/mainview/components/chat/shell-approval-card.tsx`

**Functions:**
- `formatAgentName` (line 8)
- `ShellApprovalCard` (line 14)
- `handleDecision` (line 18)


### `src/mainview/components/chat/tool-call-card.tsx`

**Interfaces:**
- `ToolCallPartData` (line 49)
- `DiffLine` (line 430)

**Functions:**
- `InlineImage` (line 31)
- `shortPath` (line 145)
- `truncate` (line 151)
- `parseInput` (line 155)
- `StateIcon` (line 160)
- `isImageTool` (line 175)
- `ToolInputDisplay` (line 257)
- `ToolOutputDisplay` (line 337)
- `computeUnifiedDiff` (line 437)
- `computeInlineHighlights` (line 486)
- `computeCharHighlights` (line 521)
- `HighlightedContent` (line 549)
- `UnifiedDiffCard` (line 569)
- `PatchDiffCard` (line 612)
- `extToLang` (line 657)
- `detectLanguageFromContent` (line 673)
- `formatDuration` (line 693)
- `formatJson` (line 700)
- `unescapeTerminal` (line 709)
- `ansiToHtml` (line 714)
- `extractShellOutput` (line 751)
- `tryFormatJson` (line 765)

**Exports:**
- `ToolCallCard` (line 179)


### `src/mainview/components/command-palette.tsx`

**Interfaces:**
- `CommandPaletteProps` (line 49)
- `Project` (line 54)
- `SearchResult` (line 59)

**Functions:**
- `getRecentSearches` (line 30)
- `addRecentSearch` (line 39)
- `CommandPalette` (line 67)
- `runCommand` (line 115)
- `getSearchResultIcon` (line 120)
- `navigateToResult` (line 135)


### `src/mainview/components/dashboard/pm-chat-widget.tsx`

**Interfaces:**
- `ChatMessage` (line 15)

**Functions:**
- `loadPersistedSession` (line 80)
- `persistMessages` (line 93)
- `persistSessionId` (line 101)
- `PmChatWidget` (line 113)
- `handleMouseDown` (line 144)
- `onChunk` (line 165)
- `onToolCall` (line 177)
- `onComplete` (line 184)
- `onError` (line 196)
- `handleKeyDown` (line 272)
- `handleClear` (line 284)

**Methods:**
- `code` (line 28)


### `src/mainview/components/dashboard/project-card.tsx`

**Interfaces:**
- `Project` (line 23)
- `ProjectCardProps` (line 35)

**Types:**
- `BadgeStatus` (line 51)

**Functions:**
- `toStatus` (line 53)
- `ProjectCard` (line 58)
- `handleCardClick` (line 62)
- `handleDeleteClick` (line 66)
- `handleConfirmDelete` (line 71)


### `src/mainview/components/deploy/deploy-tab.tsx`

**Interfaces:**
- `DeployTabProps` (line 9)
- `Environment` (line 13)
- `DeployHistoryItem` (line 24)

**Functions:**
- `DeployTab` (line 48)
- `resetForm` (line 100)
- `startEdit` (line 105)
- `saveEnvironment` (line 115)
- `deleteEnvironment` (line 137)
- `confirmDeleteEnvironment` (line 142)
- `executeDeploy` (line 154)
- `formatDuration` (line 173)
- `formatDate` (line 179)


### `src/mainview/components/git/branch-list.tsx`

**Interfaces:**
- `Branch` (line 6)
- `BranchListProps` (line 8)

**Functions:**
- `BranchList` (line 14)
- `handleCreate` (line 20)
- `handleSwitch` (line 29)
- `handleDelete` (line 34)


### `src/mainview/components/git/branch-strategy.tsx`

**Interfaces:**
- `BranchStrategyProps` (line 5)

**Types:**
- `Strategy` (line 10)

**Functions:**
- `BranchStrategy` (line 18)
- `handleSave` (line 51)
- `loadMergedBranches` (line 70)
- `handleCleanup` (line 80)


### `src/mainview/components/git/commit-log.tsx`

**Interfaces:**
- `Commit` (line 5)
- `CommitFile` (line 6)
- `CommitLogProps` (line 76)

**Functions:**
- `CommitRow` (line 16)
- `handleToggle` (line 21)
- `CommitLog` (line 81)


### `src/mainview/components/git/conflict-resolver.tsx`

**Interfaces:**
- `ConflictResolverProps` (line 6)

**Functions:**
- `ConflictResolver` (line 10)
- `handleAbort` (line 40)
- `colorizeConflictDiff` (line 116)


### `src/mainview/components/git/diff-viewer.tsx`

**Interfaces:**
- `DiffLine` (line 8)
- `DiffHunk` (line 15)
- `DiffFile` (line 20)

**Functions:**
- `parseGitDiff` (line 30)
- `FileBadge` (line 103)
- `FileDiff` (line 113)
- `DiffViewer` (line 194)


### `src/mainview/components/git/git-tab.tsx`

**Interfaces:**
- `GitTabProps` (line 16)

**Types:**
- `GitSubTab` (line 14)

**Functions:**
- `GitTab` (line 26)
- `saveAutoCommitSettings` (line 74)
- `handlePull` (line 83)
- `handlePullWithBranch` (line 104)


### `src/mainview/components/git/github-issues.tsx`

**Interfaces:**
- `GithubIssuesProps` (line 8)

**Types:**
- `GhIssue` (line 6)

**Functions:**
- `IssueCard` (line 12)
- `stateColor` (line 55)
- `GithubIssues` (line 61)
- `handleSync` (line 80)


### `src/mainview/components/git/pull-requests.tsx`

**Interfaces:**
- `PullRequestsProps` (line 10)

**Types:**
- `PR` (line 7)
- `Comment` (line 8)

**Functions:**
- `stateColor` (line 18)
- `PrDetail` (line 27)
- `handleMerge` (line 42)
- `handleAddComment` (line 55)
- `handleDeleteComment` (line 68)
- `CreatePrForm` (line 217)
- `handleGenerate` (line 260)
- `handleCreate` (line 271)
- `PullRequests` (line 369)
- `toggleFeatureBranches` (line 383)


### `src/mainview/components/git/staged-files.tsx`

**Interfaces:**
- `FileStatus` (line 26)
- `StagedFilesProps` (line 28)

**Functions:**
- `PushDialog` (line 5)
- `StagedFiles` (line 34)
- `toggle` (line 41)
- `showFeedback` (line 47)
- `handleCommit` (line 52)
- `handlePush` (line 73)
- `toggleAll` (line 90)


### `src/mainview/components/git/webhook-events.tsx`

**Interfaces:**
- `WebhookEventsProps` (line 9)

**Types:**
- `WebhookConfig` (line 6)
- `WebhookEvent` (line 7)

**Functions:**
- `eventIcon` (line 15)
- `eventColor` (line 26)
- `ConfigForm` (line 39)
- `toggle` (line 52)
- `handleSave` (line 58)
- `WebhookEvents` (line 113)
- `handlePoll` (line 138)
- `handleDeleteConfig` (line 154)


### `src/mainview/components/inbox/inbox-rules-editor.tsx`

**Interfaces:**
- `InboxRule` (line 23)
- `RuleCondition` (line 34)
- `RuleAction` (line 40)
- `NativeSelectProps` (line 143)
- `ActionValueInputProps` (line 169)
- `RuleFormProps` (line 229)
- `RuleRowProps` (line 524)
- `InboxRulesEditorProps` (line 644)

**Functions:**
- `parseConditions` (line 85)
- `parseActions` (line 94)
- `summarizeConditions` (line 103)
- `summarizeActions` (line 110)
- `makeEmptyCondition` (line 131)
- `makeEmptyAction` (line 135)
- `NativeSelect` (line 148)
- `ActionValueInput` (line 174)
- `RuleForm` (line 246)
- `updateCondition` (line 260)
- `removeCondition` (line 269)
- `updateAction` (line 273)
- `removeAction` (line 293)
- `handleSubmit` (line 297)
- `RuleRow` (line 533)
- `InboxRulesEditor` (line 649)
- `handleToggle` (line 689)
- `handleDelete` (line 704)
- `handleSaveNew` (line 723)
- `handleSaveEdit` (line 761)
- `handleEditClick` (line 802)
- `handleCancelForm` (line 807)


### `src/mainview/components/kanban/kanban-board.tsx`

**Interfaces:**
- `KanbanBoardProps` (line 27)

**Functions:**
- `KanbanBoard` (line 33)


### `src/mainview/components/kanban/kanban-card.tsx`

**Interfaces:**
- `KanbanCardProps` (line 17)

**Functions:**
- `KanbanCard` (line 22)


### `src/mainview/components/kanban/kanban-column.tsx`

**Interfaces:**
- `KanbanColumnProps` (line 25)

**Functions:**
- `KanbanColumn` (line 32)


### `src/mainview/components/kanban/kanban-filters.tsx`

**Interfaces:**
- `KanbanFiltersProps` (line 8)

**Types:**
- `SortOption` (line 5)
- `PriorityFilter` (line 6)

**Functions:**
- `KanbanFilters` (line 34)


### `src/mainview/components/kanban/kanban-stats-bar.tsx`

**Interfaces:**
- `StatIndicatorProps` (line 4)

**Functions:**
- `StatIndicator` (line 11)
- `KanbanStatsBar` (line 23)


### `src/mainview/components/kanban/task-detail-modal.tsx`

**Interfaces:**
- `AcceptanceCriterionItem` (line 23)
- `TaskDetailModalProps` (line 28)

**Functions:**
- `parseCriteria` (line 83)
- `Section` (line 109)
- `TaskDetailModal` (line 135)
- `saveTitle` (line 174)
- `saveDescription` (line 180)
- `saveImportantNotes` (line 185)
- `saveDueDate` (line 190)
- `savePriority` (line 196)
- `saveColumn` (line 201)
- `toggleCriterion` (line 207)
- `addCriterion` (line 218)
- `removeCriterion` (line 228)
- `handleDelete` (line 234)
- `confirmDelete` (line 238)


### `src/mainview/components/layout/app-shell.tsx`

**Functions:**
- `AppShell` (line 30)
- `AppShellContent` (line 38)
- `handler` (line 57)
- `handler` (line 120)
- `onFocus` (line 130)
- `onBlur` (line 131)

**Routes:**
- `restoreRoute` (line 74)


### `src/mainview/components/layout/sidebar.tsx`

**Interfaces:**
- `NavItem` (line 30)
- `SidebarProps` (line 37)

**Types:**
- `UpdateState` (line 120)

**Functions:**
- `NavItemButton` (line 54)
- `resolveIcon` (line 116)
- `Sidebar` (line 122)
- `fetchUnread` (line 140)
- `handler` (line 154)
- `fetchExtensions` (line 164)
- `handler` (line 183)
- `handler` (line 213)
- `handleVersionClick` (line 222)
- `handleDownload` (line 252)
- `handleApply` (line 264)


### `src/mainview/components/layout/topnav.tsx`

**Interfaces:**
- `TopNavProps` (line 7)

**Functions:**
- `TopNav` (line 13)


### `src/mainview/components/modals/new-project-modal.tsx`

**Interfaces:**
- `NewProjectModalProps` (line 19)
- `FormState` (line 25)

**Functions:**
- `NewProjectModal` (line 41)
- `updateField` (line 92)
- `validate` (line 99)
- `handleBrowse` (line 114)
- `onResult` (line 117)
- `handleSubmit` (line 135)
- `handleOpenChange` (line 169)


### `src/mainview/components/modals/startup-health-dialog.tsx`

**Interfaces:**
- `HealthStatus` (line 31)
- `RowProps` (line 76)

**Types:**
- `Level` (line 45)

**Functions:**
- `toLevel` (line 47)
- `LevelIcon` (line 53)
- `isAllHealthy` (line 60)
- `Row` (line 85)
- `StartupHealthDialog` (line 129)


### `src/mainview/components/modals/user-question-dialog.tsx`

**Interfaces:**
- `UserQuestionPayload` (line 16)

**Functions:**
- `UserQuestionDialog` (line 27)
- `handler` (line 35)


### `src/mainview/components/notes/note-editor.tsx`

**Interfaces:**
- `NoteEditorProps` (line 9)

**Types:**
- `EditorMode` (line 17)

**Functions:**
- `NoteEditor` (line 19)
- `handleSave` (line 32)

**Methods:**
- `code` (line 84)


### `src/mainview/components/notes/notes-tab.tsx`

**Interfaces:**
- `Note` (line 19)
- `Plan` (line 29)
- `NotesTabProps` (line 41)

**Types:**
- `DocItem` (line 37)

**Functions:**
- `Highlight` (line 46)
- `highlightChildren` (line 66)
- `makeMdComponents` (line 74)
- `h` (line 75)
- `getItemKey` (line 129)
- `NotesTab` (line 133)
- `refresh` (line 230)
- `handleSelect` (line 239)
- `startEdit` (line 244)
- `startCreate` (line 255)
- `cancelEdit` (line 263)
- `handleSave` (line 271)
- `handleDelete` (line 292)

**Methods:**
- `code` (line 78)


### `src/mainview/components/project-settings/project-settings-tab.tsx`

**Interfaces:**
- `ProjectData` (line 44)
- `GeneralForm` (line 56)
- `AiForm` (line 65)
- `ProviderItem` (line 78)
- `FieldRowProps` (line 109)
- `DeleteConfirmDialogProps` (line 134)
- `GeneralTabProps` (line 286)
- `AiTabProps` (line 613)
- `IntegrationsTabProps` (line 916)
- `ProjectSettingsTabProps` (line 1049)

**Functions:**
- `FieldRow` (line 116)
- `DeleteConfirmDialog` (line 141)
- `handleConfirm` (line 157)
- `ResetConfirmDialog` (line 226)
- `handleConfirm` (line 237)
- `GeneralTab` (line 291)
- `handleChange` (line 320)
- `handleBrowse` (line 328)
- `onResult` (line 332)
- `AiTab` (line 619)
- `handleChange` (line 646)
- `IntegrationsTab` (line 921)
- `copyToClipboard` (line 940)
- `ProjectSettingsTab` (line 1053)
- `load` (line 1064)


### `src/mainview/components/scheduler/automation-rule-card.tsx`

**Interfaces:**
- `AutomationRule` (line 12)
- `AutomationAction` (line 24)
- `AutomationRuleCardProps` (line 29)

**Functions:**
- `parseJson` (line 40)
- `extractEventType` (line 49)
- `summarizeActions` (line 54)
- `eventTypeBadgeClass` (line 71)
- `AutomationRuleCard` (line 83)


### `src/mainview/components/scheduler/automation-rule-form.tsx`

**Interfaces:**
- `TriggerCondition` (line 24)
- `TriggerConfig` (line 30)
- `ReminderConfig` (line 43)
- `ShellConfig` (line 48)
- `WebhookConfig` (line 53)
- `PmPromptConfig` (line 60)
- `AgentTaskConfig` (line 65)
- `SendChannelMessageConfig` (line 70)
- `NativeSelectProps` (line 178)
- `ActionConfigFieldsProps` (line 203)
- `AutomationRuleFormProps` (line 436)

**Types:**
- `ActionType` (line 35)
- `ActionConfig` (line 75)

**Functions:**
- `parseJson` (line 122)
- `makeTrigger` (line 131)
- `makeCondition` (line 135)
- `makeAction` (line 139)
- `triggerFromRule` (line 156)
- `actionsFromRule` (line 160)
- `triggerFromPrefill` (line 165)
- `actionsFromPrefill` (line 169)
- `NativeSelect` (line 182)
- `ActionConfigFields` (line 209)
- `AutomationRuleForm` (line 448)
- `setEventType` (line 489)
- `addCondition` (line 493)
- `updateCondition` (line 500)
- `removeCondition` (line 509)
- `addAction` (line 520)
- `changeActionType` (line 524)
- `updateAction` (line 530)
- `removeAction` (line 536)
- `handleSubmit` (line 544)


### `src/mainview/components/scheduler/automation-templates.tsx`

**Interfaces:**
- `AutomationTemplate` (line 16)
- `AutomationTemplatesProps` (line 22)
- `TemplateCardProps` (line 82)

**Functions:**
- `parseJson` (line 34)
- `extractEventType` (line 43)
- `buildDescription` (line 48)
- `eventBadgeClass` (line 71)
- `TemplateCard` (line 87)
- `TemplateSkeleton` (line 131)
- `AutomationTemplates` (line 146)
- `load` (line 153)


### `src/mainview/components/scheduler/cron-job-form.tsx`

**Interfaces:**
- `ProjectOption` (line 70)
- `CronJob` (line 75)
- `AgentOption` (line 92)
- `TaskConfig` (line 97)
- `CronJobFormProps` (line 116)
- `TaskFieldsProps` (line 172)

**Types:**
- `TaskType` (line 90)

**Functions:**
- `parseTaskConfig` (line 129)
- `buildTaskConfig` (line 137)
- `ProjectSelect` (line 180)
- `TaskFields` (line 196)
- `CronJobForm` (line 381)
- `validate` (line 438)
- `handleSave` (line 449)


### `src/mainview/components/scheduler/schedule-builder.tsx`

**Interfaces:**
- `VisualScheduleState` (line 29)
- `ScheduleBuilderProps` (line 37)
- `VisualEditorProps` (line 152)
- `CronEditorProps` (line 312)

**Types:**
- `ScheduleFrequency` (line 22)

**Functions:**
- `buildCronExpression` (line 68)
- `parseCronToVisual` (line 89)
- `friendlyFrequency` (line 138)
- `VisualEditor` (line 157)
- `set` (line 160)
- `toggleDay` (line 164)
- `CronEditor` (line 318)
- `ScheduleBuilder` (line 416)
- `handleVisualChange` (line 434)
- `handleModeChange` (line 440)


### `src/mainview/components/ui/agent-avatar.tsx`

**Interfaces:**
- `AgentAvatarProps` (line 6)

**Types:**
- `AvatarSize` (line 4)

**Functions:**
- `hashColor` (line 19)
- `stripInstanceId` (line 28)
- `humanizeName` (line 33)
- `deriveInitials` (line 40)
- `AgentAvatar` (line 52)


### `src/mainview/components/ui/badge.tsx`

**Interfaces:**
- `BadgeProps` (line 27)

**Functions:**
- `Badge` (line 31)

**Exports:**
- `Badge` (line 37)
- `badgeVariants` (line 37)


### `src/mainview/components/ui/button.tsx`

**Interfaces:**
- `ButtonProps` (line 38)

**Exports:**
- `Button` (line 58)
- `buttonVariants` (line 58)


### `src/mainview/components/ui/card.tsx`

**Exports:**
- `Card` (line 76)
- `CardHeader` (line 76)
- `CardFooter` (line 76)
- `CardTitle` (line 76)
- `CardDescription` (line 76)
- `CardContent` (line 76)


### `src/mainview/components/ui/command.tsx`

**Functions:**
- `CommandDialog` (line 24)
- `CommandShortcut` (line 125)

**Exports:**
- `Command` (line 141)
- `CommandDialog` (line 141)
- `CommandInput` (line 141)
- `CommandList` (line 141)
- `CommandEmpty` (line 141)
- `CommandGroup` (line 141)
- `CommandItem` (line 141)
- `CommandShortcut` (line 141)
- `CommandSeparator` (line 141)


### `src/mainview/components/ui/confirmation-dialog.tsx`

**Interfaces:**
- `ConfirmationDialogProps` (line 11)

**Functions:**
- `ConfirmationDialog` (line 23)
- `handleCancel` (line 34)
- `handleConfirm` (line 39)


### `src/mainview/components/ui/connection-status.tsx`

**Functions:**
- `ConnectionStatus` (line 10)
- `check` (line 15)


### `src/mainview/components/ui/dialog.tsx`

**Functions:**
- `DialogHeader` (line 54)
- `DialogFooter` (line 68)

**Exports:**
- `Dialog` (line 109)
- `DialogPortal` (line 109)
- `DialogOverlay` (line 109)
- `DialogTrigger` (line 109)
- `DialogClose` (line 109)
- `DialogContent` (line 109)
- `DialogHeader` (line 109)
- `DialogFooter` (line 109)
- `DialogTitle` (line 109)
- `DialogDescription` (line 109)


### `src/mainview/components/ui/dropdown-menu.tsx`

**Functions:**
- `DropdownMenuShortcut` (line 169)

**Exports:**
- `DropdownMenu` (line 182)
- `DropdownMenuTrigger` (line 182)
- `DropdownMenuContent` (line 182)
- `DropdownMenuItem` (line 182)
- `DropdownMenuCheckboxItem` (line 182)
- `DropdownMenuRadioItem` (line 182)
- `DropdownMenuLabel` (line 182)
- `DropdownMenuSeparator` (line 182)
- `DropdownMenuShortcut` (line 182)
- `DropdownMenuGroup` (line 182)
- `DropdownMenuPortal` (line 182)
- `DropdownMenuSub` (line 182)
- `DropdownMenuSubContent` (line 182)
- `DropdownMenuSubTrigger` (line 182)
- `DropdownMenuRadioGroup` (line 182)


### `src/mainview/components/ui/empty-state.tsx`

**Interfaces:**
- `EmptyStateProps` (line 5)

**Functions:**
- `EmptyState` (line 13)

**Exports:**
- `EmptyState` (line 41)
- `EmptyStateProps` (line 42)


### `src/mainview/components/ui/error-boundary.tsx`

**Classes:**
- `ErrorBoundary` (line 15)

**Interfaces:**
- `Props` (line 5)
- `State` (line 10)

**Methods:**
- `getDerivedStateFromError` (line 18)
- `componentDidCatch` (line 22)
- `render` (line 31)


### `src/mainview/components/ui/input.tsx`

**Types:**
- `InputProps` (line 5)

**Exports:**
- `Input` (line 24)


### `src/mainview/components/ui/kbd.tsx`

**Interfaces:**
- `KbdProps` (line 5)

**Functions:**
- `Kbd` (line 10)

**Exports:**
- `Kbd` (line 29)
- `KbdProps` (line 30)


### `src/mainview/components/ui/label.tsx`

**Exports:**
- `Label` (line 24)


### `src/mainview/components/ui/mermaid-diagram.tsx`

**Interfaces:**
- `MermaidDiagramProps` (line 26)

**Functions:**
- `getMermaid` (line 8)
- `MermaidDiagram` (line 37)


### `src/mainview/components/ui/popover.tsx`

**Exports:**
- `Popover` (line 31)
- `PopoverTrigger` (line 31)
- `PopoverContent` (line 31)
- `PopoverAnchor` (line 31)


### `src/mainview/components/ui/resizable-pane.tsx`

**Interfaces:**
- `ResizablePaneProps` (line 10)

**Functions:**
- `ResizablePane` (line 18)
- `handleMouseMove` (line 45)
- `handleMouseUp` (line 53)


### `src/mainview/components/ui/scroll-area.tsx`

**Exports:**
- `ScrollArea` (line 46)
- `ScrollBar` (line 46)


### `src/mainview/components/ui/search-input.tsx`

**Interfaces:**
- `SearchInputProps` (line 7)

**Functions:**
- `SearchInput` (line 14)
- `handleClear` (line 22)

**Exports:**
- `SearchInput` (line 55)
- `SearchInputProps` (line 56)


### `src/mainview/components/ui/select.tsx`

**Exports:**
- `Select` (line 146)
- `SelectGroup` (line 146)
- `SelectValue` (line 146)
- `SelectTrigger` (line 146)
- `SelectContent` (line 146)
- `SelectLabel` (line 146)
- `SelectItem` (line 146)
- `SelectSeparator` (line 146)
- `SelectScrollUpButton` (line 146)
- `SelectScrollDownButton` (line 146)


### `src/mainview/components/ui/separator.tsx`

**Exports:**
- `Separator` (line 29)


### `src/mainview/components/ui/sheet.tsx`

**Interfaces:**
- `SheetContentProps` (line 50)

**Functions:**
- `SheetHeader` (line 75)
- `SheetFooter` (line 89)

**Exports:**
- `Sheet` (line 127)
- `SheetPortal` (line 127)
- `SheetOverlay` (line 127)
- `SheetTrigger` (line 127)
- `SheetClose` (line 127)
- `SheetContent` (line 127)
- `SheetHeader` (line 127)
- `SheetFooter` (line 127)
- `SheetTitle` (line 127)
- `SheetDescription` (line 127)


### `src/mainview/components/ui/skeleton.tsx`

**Functions:**
- `Skeleton` (line 3)
- `SkeletonCard` (line 12)
- `SkeletonLine` (line 26)

**Exports:**
- `Skeleton` (line 34)
- `SkeletonCard` (line 34)
- `SkeletonLine` (line 34)


### `src/mainview/components/ui/status-badge.tsx`

**Interfaces:**
- `StatusBadgeProps` (line 6)

**Types:**
- `Status` (line 3)
- `Size` (line 4)

**Functions:**
- `StatusBadge` (line 45)


### `src/mainview/components/ui/switch.tsx`

**Exports:**
- `Switch` (line 27)


### `src/mainview/components/ui/tabs.tsx`

**Exports:**
- `Tabs` (line 53)
- `TabsList` (line 53)
- `TabsTrigger` (line 53)
- `TabsContent` (line 53)


### `src/mainview/components/ui/textarea.tsx`

**Types:**
- `TextareaProps` (line 5)

**Exports:**
- `Textarea` (line 23)


### `src/mainview/components/ui/toast.tsx`

**Interfaces:**
- `Toast` (line 11)
- `ToastStore` (line 17)
- `ToastItemProps` (line 78)

**Functions:**
- `toast` (line 38)
- `ToastItem` (line 83)
- `Toaster` (line 132)

**Exports:**
- `useToastStore` (line 23)


### `src/mainview/components/ui/tooltip.tsx`

**Functions:**
- `Tip` (line 35)

**Exports:**
- `Tooltip` (line 54)
- `TooltipTrigger` (line 54)
- `TooltipContent` (line 54)
- `TooltipProvider` (line 54)
- `Tip` (line 54)


### `src/mainview/lib/date-utils.ts`

**Functions:**
- `parseDbDate` (line 9)
- `relativeTime` (line 20)
- `relativeTimeVerbose` (line 46)
- `formatDateTime` (line 59)
- `relativeTimeFuture` (line 75)


### `src/mainview/lib/global-error-handler.ts`

**Functions:**
- `initClientErrorHandler` (line 10)


### `src/mainview/lib/header-context.tsx`

**Interfaces:**
- `HeaderContextValue` (line 11)

**Functions:**
- `HeaderProvider` (line 21)
- `useHeaderActions` (line 65)
- `useHeaderContext` (line 80)


### `src/mainview/lib/pricing.ts`

**Interfaces:**
- `ModelPrice` (line 8)

**Functions:**
- `getModelPrice` (line 54)
- `estimateCost` (line 69)
- `formatCost` (line 85)


### `src/mainview/lib/rpc.ts`

**Exports:**
- `electroview` (line 176)
- `rpc` (line 185)


### `src/mainview/lib/types.ts`

**Interfaces:**
- `ActivityEvent` (line 6)

**Functions:**
- `assignActivityId` (line 38)


### `src/mainview/lib/use-agent-colors.ts`

**Functions:**
- `ensureFetched` (line 9)
- `useAgentColorMap` (line 24)


### `src/mainview/lib/utils.ts`

**Functions:**
- `cn` (line 4)
- `displayAgentName` (line 11)


### `src/mainview/main.tsx`

**Functions:**
- `stripHrefs` (line 13)


### `src/mainview/pages/agents.tsx`

**Interfaces:**
- `Agent` (line 33)
- `Provider` (line 48)
- `ToolDef` (line 74)
- `AgentToolsTabProps` (line 98)
- `AgentSettingsDialogProps` (line 307)
- `CreateAgentDialogProps` (line 671)
- `DeleteAgentDialogProps` (line 915)
- `AgentCardProps` (line 972)

**Functions:**
- `getInitials` (line 62)
- `AgentToolsTab` (line 104)
- `AgentSettingsDialog` (line 315)
- `handleSave` (line 359)
- `handleReset` (line 402)
- `CreateAgentDialog` (line 679)
- `resetForm` (line 689)
- `handleClose` (line 699)
- `handleCreate` (line 704)
- `DeleteAgentDialog` (line 922)
- `handleDelete` (line 927)
- `AgentCard` (line 978)
- `AgentCardSkeleton` (line 1070)
- `AgentsPage` (line 1088)
- `openDialog` (line 1108)
- `closeDialog` (line 1113)
- `handleSaved` (line 1118)
- `openDeleteDialog` (line 1124)
- `closeDeleteDialog` (line 1129)
- `handleDeleted` (line 1134)
- `handleCreated` (line 1138)


### `src/mainview/pages/analytics.tsx`

**Types:**
- `ProjectStats` (line 14)
- `SubTab` (line 16)
- `LogEntry` (line 149)
- `LogEntryFull` (line 158)

**Functions:**
- `fmtHours` (line 20)
- `DashboardTab` (line 28)
- `formatSize` (line 163)
- `formatTokens` (line 169)
- `timeAgo` (line 174)
- `formatTime` (line 184)
- `agentColor` (line 211)
- `TokenBarChart` (line 217)
- `PromptDetailDialog` (line 307)
- `PromptsTab` (line 390)
- `init` (line 406)
- `Loading` (line 548)
- `NoData` (line 556)
- `AnalyticsPage` (line 565)


### `src/mainview/pages/council.tsx`

**Interfaces:**
- `AgentInfo` (line 20)
- `Message` (line 26)
- `CouncilEvent` (line 51)

**Types:**
- `SessionState` (line 17)
- `AgentState` (line 18)

**Functions:**
- `ThinkingDots` (line 163)
- `QuestionCard` (line 187)
- `handleSubmit` (line 198)
- `MessageBubble` (line 266)
- `handleCopy` (line 277)
- `handleDownload` (line 284)
- `CouncilPage` (line 590)
- `handleSend` (line 885)
- `handleAnswer` (line 934)
- `handleStop` (line 941)

**Methods:**
- `code` (line 93)


### `src/mainview/pages/dashboard.tsx`

**Interfaces:**
- `Project` (line 21)

**Types:**
- `SortKey` (line 33)
- `StatusFilter` (line 34)

**Functions:**
- `DashboardPage` (line 36)
- `fetchCounts` (line 88)
- `handleDeleteProject` (line 176)
- `handleStatusChange` (line 188)
- `ProjectGridSkeleton` (line 328)


### `src/mainview/pages/inbox.tsx`

**Interfaces:**
- `InboxMessage` (line 48)
- `Project` (line 64)
- `MessageDetailDialogProps` (line 127)
- `BulkActionBarProps` (line 308)

**Types:**
- `ChannelFilter` (line 69)
- `CategoryFilter` (line 70)
- `ReadFilter` (line 71)
- `ArchiveFilter` (line 72)

**Functions:**
- `getChannelSource` (line 78)
- `getSourceBadgeStyle` (line 82)
- `getSourceLabel` (line 92)
- `MessageRowSkeleton` (line 106)
- `MessageDetailDialog` (line 137)
- `BulkActionBar` (line 316)
- `InboxPage` (line 348)
- `handler` (line 434)
- `handleMarkAsRead` (line 476)
- `handleRowClick` (line 489)
- `handleDeleteMessage` (line 495)
- `handleArchiveMessage` (line 509)
- `handleMarkAllRead` (line 530)
- `toggleSelect` (line 546)
- `toggleSelectAll` (line 555)
- `handleBulkMarkRead` (line 569)
- `handleBulkArchive` (line 582)
- `handleBulkDelete` (line 596)


### `src/mainview/pages/onboarding.tsx`

**Interfaces:**
- `FormData` (line 31)
- `ValidationState` (line 41)

**Types:**
- `ProviderType` (line 28)
- `WizardStep` (line 29)

**Functions:**
- `isValidEmail` (line 74)
- `isValidUrl` (line 78)
- `normalizeBaseUrl` (line 91)
- `StepIndicator` (line 112)
- `StepWelcome` (line 173)
- `handleImportClick` (line 182)
- `StepAboutYou` (line 258)
- `handleBrowseWorkspace` (line 280)
- `onResult` (line 281)
- `StepSelectProvider` (line 376)
- `StepConfigure` (line 466)
- `fetchModels` (line 503)
- `StepValidate` (line 674)
- `StepConfirmation` (line 757)
- `OnboardingPage` (line 831)
- `goNext` (line 852)
- `goBack` (line 854)
- `updateForm` (line 857)
- `validate` (line 884)
- `onResult` (line 911)
- `handleImportSettings` (line 959)
- `parseSetting` (line 984)
- `handleProviderSelect` (line 1017)
- `handleRetry` (line 1023)
- `handleFinish` (line 1045)


### `src/mainview/pages/plugin-db-viewer.tsx`

**Types:**
- `TableMeta` (line 13)
- `Row` (line 14)

**Functions:**
- `colLabel` (line 17)
- `formatDbDateTime` (line 25)
- `cellDisplay` (line 47)
- `RowViewDialog` (line 54)
- `DbViewerPage` (line 96)
- `handleDelete` (line 147)


### `src/mainview/pages/plugins.tsx`

**Interfaces:**
- `PluginInfo` (line 16)
- `PluginSettingsDialogProps` (line 35)
- `PluginPromptDialogProps` (line 183)
- `LspServerStatus` (line 257)

**Functions:**
- `formatSettingLabel` (line 42)
- `groupSettings` (line 52)
- `PluginSettingsDialog` (line 71)
- `handleChange` (line 75)
- `handleSave` (line 79)
- `renderField` (line 85)
- `PluginPromptDialog` (line 189)
- `handleSave` (line 195)
- `handleReset` (line 207)
- `statusBadge` (line 265)
- `LspManagerCard` (line 282)
- `handleInstall` (line 302)
- `handleUninstall` (line 315)
- `handleToggleLanguage` (line 328)
- `PluginsPage` (line 442)
- `handleToggle` (line 455)
- `handleSettingsSave` (line 463)


### `src/mainview/pages/project.tsx`

**Interfaces:**
- `PluginTab` (line 20)

**Types:**
- `ProjectTab` (line 18)

**Functions:**
- `ProjectPage` (line 27)
- `handler` (line 62)
- `handleCreateTask` (line 141)


### `src/mainview/pages/prompts.tsx`

**Interfaces:**
- `Prompt` (line 14)

**Functions:**
- `PromptForm` (line 24)
- `handleSubmit` (line 38)
- `PromptsPage` (line 96)
- `handleSave` (line 128)
- `handleDelete` (line 140)
- `PromptCard` (line 293)


### `src/mainview/pages/scheduler.tsx`

**Interfaces:**
- `CronJobHistoryEntry` (line 41)
- `HistorySectionProps` (line 168)
- `CronJobCardProps` (line 313)
- `CronJobsTabProps` (line 467)
- `AutomationRulesTabProps` (line 571)

**Functions:**
- `humanizeCron` (line 56)
- `getTaskTypeLabel` (line 84)
- `CronJobCardSkeleton` (line 101)
- `LastRunBadge` (line 128)
- `HistorySection` (line 174)
- `load` (line 185)
- `handleClear` (line 209)
- `CronJobCard` (line 321)
- `handleToggle` (line 328)
- `CronJobsTab` (line 477)
- `handleClearAll` (line 488)
- `AutomationRulesTab` (line 581)
- `SchedulerPage` (line 654)
- `handleAddJob` (line 715)
- `handleEditJob` (line 720)
- `handleDeleteJob` (line 725)
- `confirmDeleteJob` (line 730)
- `handleToggleEnabled` (line 745)
- `handleAddRule` (line 761)
- `handleEditRule` (line 767)
- `handleDeleteRule` (line 773)
- `confirmDeleteRule` (line 778)
- `handleToggleRule` (line 793)
- `handleUseTemplate` (line 806)


### `src/mainview/pages/settings.tsx`

**Functions:**
- `SubTabs` (line 20)
- `SettingsPage` (line 45)


### `src/mainview/pages/settings/ai-debug.tsx`

**Functions:**
- `AiDebugSettings` (line 16)
- `load` (line 25)
- `handleToggle` (line 50)
- `handleClear` (line 63)
- `handleOpen` (line 76)


### `src/mainview/pages/settings/appearance.tsx`

**Types:**
- `SidebarDefault` (line 16)

**Functions:**
- `AppearanceSettings` (line 18)


### `src/mainview/pages/settings/audit-log.tsx`

**Interfaces:**
- `AuditEntry` (line 21)

**Functions:**
- `AuditLogSettings` (line 44)


### `src/mainview/pages/settings/constitution.tsx`

**Functions:**
- `ConstitutionSettings` (line 33)
- `loadConstitution` (line 44)


### `src/mainview/pages/settings/data.tsx`

**Interfaces:**
- `ProjectOption` (line 291)

**Functions:**
- `DatabaseMaintenanceCard` (line 27)
- `BackupsCard` (line 131)
- `formatSize` (line 202)
- `SettingsExportImportCard` (line 300)
- `DataSettings` (line 382)


### `src/mainview/pages/settings/discord-settings.tsx`

**Interfaces:**
- `DiscordConfig` (line 22)
- `ParsedConfig` (line 32)
- `Project` (line 38)
- `Server` (line 43)
- `ConfigFormProps` (line 76)

**Types:**
- `BotStatus` (line 48)

**Functions:**
- `BotStatusIndicator` (line 54)
- `ConfigForm` (line 83)
- `DiscordSettings` (line 335)
- `parseConfig` (line 391)
- `projectName` (line 399)


### `src/mainview/pages/settings/email-settings.tsx`

**Interfaces:**
- `EmailChannel` (line 63)
- `ParsedEmailConfig` (line 73)
- `Project` (line 86)
- `ConfigFormProps` (line 218)

**Functions:**
- `parseEmailConfig` (line 95)
- `ToggleSwitch` (line 118)
- `PasswordInput` (line 167)
- `ConfigForm` (line 230)
- `EmailSettings` (line 629)
- `projectName` (line 680)


### `src/mainview/pages/settings/general.tsx`

**Interfaces:**
- `UserProfile` (line 30)
- `ApplicationSettings` (line 35)
- `FieldRowProps` (line 186)

**Functions:**
- `isValidEmail` (line 56)
- `ResetApplicationCard` (line 100)
- `FieldRow` (line 193)
- `GeneralSettings` (line 211)
- `loadSettings` (line 223)
- `onResult` (line 408)


### `src/mainview/pages/settings/github.tsx`

**Interfaces:**
- `StatusIndicatorProps` (line 28)

**Types:**
- `ConnectionStatus` (line 22)

**Functions:**
- `StatusIndicator` (line 33)
- `GithubSettings` (line 81)


### `src/mainview/pages/settings/health.tsx`

**Interfaces:**
- `HealthStatus` (line 25)
- `SubsystemCardProps` (line 131)

**Types:**
- `StatusLevel` (line 67)

**Functions:**
- `resolveLevel` (line 69)
- `StatusIcon` (line 81)
- `StatusBadge` (line 89)
- `formatUptime` (line 110)
- `SubsystemCard` (line 139)
- `DatabaseCard` (line 172)
- `AiProviderCard` (line 220)
- `WorkspaceCard` (line 248)
- `SchedulerCard` (line 278)
- `IntegrationsCard` (line 326)
- `EnginesCard` (line 363)
- `BackendCard` (line 413)
- `HealthSettings` (line 428)


### `src/mainview/pages/settings/mcp.tsx`

**Interfaces:**
- `McpServer` (line 37)

**Types:**
- `McpServerStatus` (line 14)

**Functions:**
- `statusDot` (line 48)
- `statusLabel` (line 55)
- `ServerList` (line 63)
- `McpSettings` (line 117)
- `handleChange` (line 156)
- `handleSave` (line 175)
- `handleLoadTemplate` (line 188)


### `src/mainview/pages/settings/notification-settings.tsx`

**Interfaces:**
- `PlatformPref` (line 28)
- `ToggleRowProps` (line 140)
- `PlatformCardProps` (line 190)

**Types:**
- `PlatformKey` (line 22)
- `PrefsMap` (line 36)
- `DirtyMap` (line 37)

**Functions:**
- `buildDefaultPrefs` (line 50)
- `buildDefaultDirty` (line 56)
- `getMuteValue` (line 68)
- `muteValueToTimestamp` (line 92)
- `formatMuteRemaining` (line 116)
- `ToggleRow` (line 148)
- `PlatformCard` (line 199)
- `NotificationSettings` (line 277)
- `load` (line 294)


### `src/mainview/pages/settings/providers.tsx`

**Interfaces:**
- `Provider` (line 38)
- `FormData` (line 48)
- `ProviderCardProps` (line 182)
- `ProviderDialogProps` (line 324)

**Functions:**
- `isValidUrl` (line 81)
- `normalizeBaseUrl` (line 94)
- `providerTypeBadgeClass` (line 106)
- `providerTypeLabel` (line 119)
- `ProviderCardSkeleton` (line 130)
- `EmptyProviders` (line 159)
- `ProviderCard` (line 190)
- `ProviderDialog` (line 331)
- `updateField` (line 406)
- `handleSave` (line 410)
- `handleCancel` (line 461)
- `ProvidersSettings` (line 662)
- `loadProviders` (line 681)
- `handleAdd` (line 700)
- `handleEdit` (line 705)
- `handleDeleteRequest` (line 710)
- `handleDeleteConfirm` (line 714)
- `handleTest` (line 733)
- `onResult` (line 737)


### `src/mainview/pages/settings/tavily-settings.tsx`

**Types:**
- `KeyStatus` (line 18)

**Functions:**
- `StatusDot` (line 20)
- `TavilySettings` (line 37)


### `src/mainview/pages/settings/whatsapp-settings.tsx`

**Interfaces:**
- `WhatsAppConfig` (line 21)
- `Project` (line 31)
- `AddConfigFormProps` (line 77)

**Types:**
- `WhatsAppStatus` (line 36)

**Functions:**
- `ConnectionStatusIndicator` (line 49)
- `AddConfigForm` (line 83)
- `WhatsAppSettings` (line 188)
- `onQR` (line 232)
- `onStatus` (line 237)
- `projectName` (line 311)


### `src/mainview/pages/skills.tsx`

**Interfaces:**
- `SkillValidationError` (line 13)
- `SkillSummary` (line 18)
- `SkillDetail` (line 29)
- `ToolDef` (line 35)

**Functions:**
- `ToolsReferenceDialog` (line 41)
- `SkillCard` (line 97)
- `SkillDetailDialog` (line 202)
- `SkillErrorsDialog` (line 273)
- `SkillsPage` (line 301)

**Methods:**
- `code` (line 172)


### `src/mainview/router.tsx`

**Interfaces:**
- `Register` (line 125)

**Exports:**
- `router` (line 118)


### `src/mainview/stores/chat-event-handlers.ts`

**Functions:**
- `markStreamCompleted` (line 18)
- `flushTokenBuffer` (line 46)
- `onStreamToken` (line 82)
- `onStreamReset` (line 104)
- `onStreamComplete` (line 147)
- `resolveMetadata` (line 185)
- `onStreamError` (line 267)
- `onAgentStatus` (line 307)
- `onPlanPresented` (line 319)
- `onConversationTitleChanged` (line 343)
- `onConversationUpdated` (line 356)
- `persistShellApprovalDecision` (line 399)
- `onNewMessage` (line 407)
- `onShellApprovalRequest` (line 469)
- `onAgentInlineStart` (line 490)
- `onAgentInlineComplete` (line 510)
- `onCompactionStarted` (line 555)
- `onConversationCompacted` (line 562)
- `onPmThinking` (line 583)
- `initChatEventHandlers` (line 611)

**Exports:**
- `buffers` (line 34)


### `src/mainview/stores/chat-store.ts`

**Interfaces:**
- `ChatState` (line 25)

**Functions:**
- `sortConversations` (line 96)

**Exports:**
- `ActiveInlineAgent` (line 13)
- `AgentStatusValue` (line 13)
- `Conversation` (line 13)
- `Message` (line 13)
- `ShellApprovalRequest` (line 13)
- `useChatStore` (line 132)


### `src/mainview/stores/chat-types.ts`

**Interfaces:**
- `Conversation` (line 8)
- `Message` (line 18)
- `ActiveInlineAgent` (line 31)
- `ShellApprovalRequest` (line 44)

**Types:**
- `AgentStatusValue` (line 37)

**Exports:**
- `ActivityEvent` (line 2)


### `src/mainview/stores/kanban-store.ts`

**Interfaces:**
- `KanbanTask` (line 8)
- `KanbanState` (line 32)

**Types:**
- `KanbanColumn` (line 25)
- `TaskPriority` (line 26)

**Functions:**
- `sortTasksByPosition` (line 73)

**Exports:**
- `useKanbanStore` (line 92)


## Data Flow

Router/Controller → Model/Schema

## Change Recipe

To add a new feature to the **mainview** domain:

1. Update the model/schema in `src/mainview/`
2. Register the new route/endpoint
