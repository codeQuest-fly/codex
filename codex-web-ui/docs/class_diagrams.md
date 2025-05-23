# Codex Web UI 类图

## 后端类图

```
+-------------------+       +-------------------+       +-------------------+
|    TaskController |       |   FileController  |       |   CodexService    |
+-------------------+       +-------------------+       +-------------------+
| - createTask()    |       | - getFileList()   |       | - executeCommand()|
| - getTasks()      |       | - getFileContent()|       | - parseOutput()   |
| - getTaskById()   |       | - updateFile()    |       | - handleInteract()|
| - deleteTask()    |       +-------------------+       +-------------------+
| - interruptTask() |               ^                           ^
| - rollbackTask()  |               |                           |
| - interactWith()  |               |                           |
+-------------------+               |                           |
        ^                           |                           |
        |                           |                           |
        |                           |                           |
+-------------------+       +-------------------+       +-------------------+
|   TaskService     |       |   FileService     |       |  WebSocketService |
+-------------------+       +-------------------+       +-------------------+
| - saveTask()      |       | - readDir()       |       | - setupServer()   |
| - getAllTasks()   |       | - readFile()      |       | - sendUpdate()    |
| - getTaskById()   |       | - writeFile()     |       | - handleConnect() |
| - deleteTaskById()|       | - deleteFile()    |       | - handleClose()   |
+-------------------+       +-------------------+       +-------------------+
        ^                                                       ^
        |                                                       |
        |                                                       |
+-------------------+                                   +-------------------+
|    Database       |                                   |    WebSocket      |
+-------------------+                                   +-------------------+
| - initDb()        |                                   | - onMessage()     |
| - query()         |                                   | - send()          |
| - insert()        |                                   | - close()         |
| - update()        |                                   +-------------------+
| - delete()        |
+-------------------+
```

## 前端类图

```
+-------------------+       +-------------------+       +-------------------+
|     App           |       |     Layout        |       |    Dashboard      |
+-------------------+       +-------------------+       +-------------------+
| - routes          |       | - header          |       | - recentTasks     |
+-------------------+       | - navigation      |       | - recentFiles     |
        ^                   | - footer          |       | - quickActions    |
        |                   +-------------------+       +-------------------+
        |                           ^
        |                           |
+-------------------+       +-------------------+       +-------------------+
|   FileExplorer    |       |    CodeEditor     |       |   TaskManager     |
+-------------------+       +-------------------+       +-------------------+
| - fileList        |       | - editorContent   |       | - taskList        |
| - currentPath     |       | - language        |       | - filters         |
| - handleFileClick()|      | - saveFile()      |       | - createTask()    |
+-------------------+       +-------------------+       +-------------------+
                                                                ^
                                                                |
+-------------------+       +-------------------+       +-------------------+
|    TaskDetail     |       |     ApiService    |       | WebSocketService  |
+-------------------+       +-------------------+       +-------------------+
| - taskInfo        |       | - fileApi         |       | - connect()       |
| - output          |       | - taskApi         |       | - disconnect()    |
| - changes         |       | - get()           |       | - onMessage()     |
| - interactions    |       | - post()          |       | - sendMessage()   |
| - approveChange() |       | - put()           |       +-------------------+
| - rejectChange()  |       | - delete()        |
+-------------------+       +-------------------+
```

## 数据模型类图

```
+-------------------+
|       Task        |
+-------------------+
| - id: string      |
| - description     |
| - type: TaskType  |
| - status          |
| - createdAt       |
| - scheduledFor    |
| - completedAt     |
| - approvalMode    |
| - output          |
| - changes         |
+-------------------+
        ^
        |
        |
+-------------------+       +-------------------+
|    FileChange     |       |    Interaction    |
+-------------------+       +-------------------+
| - path: string    |       | - id: string      |
| - operation       |       | - taskId          |
| - diff            |       | - type            |
| - status          |       | - message         |
+-------------------+       | - options         |
                            | - response        |
                            | - timestamp       |
                            +-------------------+
```

## 前端组件层次结构

```
App
├── Layout
│   ├── Header
│   ├── Navigation
│   └── Footer
├── Dashboard
│   ├── RecentTasksWidget
│   ├── RecentFilesWidget
│   └── QuickActionsWidget
├── FileExplorer
│   ├── FileList
│   ├── FileActions
│   └── BreadcrumbNavigation
├── CodeEditor
│   ├── MonacoEditor
│   ├── EditorToolbar
│   └── StatusBar
├── TaskManager
│   ├── TaskList
│   ├── TaskFilters
│   └── NewTaskModal
└── TaskDetail
    ├── TaskHeader
    ├── TaskMetadata
    ├── OutputTab
    ├── ChangesTab
    ├── InteractionsTab
    └── InteractionDialog
```