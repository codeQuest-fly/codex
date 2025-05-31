import * as fsSync from "fs";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";

interface Logger {
  /** Checking this can be used to avoid constructing a large log message. */
  isLoggingEnabled(): boolean;

  log(message: string): void;
}

class AsyncLogger implements Logger {
  private queue: Array<string> = [];
  private isWriting: boolean = false;

  constructor(private filePath: string) {
    this.filePath = filePath;
  }

  isLoggingEnabled(): boolean {
    return true;
  }

  log(message: string): void {
    const entry = `[${now()}] ${message}\n`;
    this.queue.push(entry);
    this.maybeWrite();
  }

  private async maybeWrite(): Promise<void> {
    if (this.isWriting || this.queue.length === 0) {
      return;
    }

    this.isWriting = true;
    const messages = this.queue.join("");
    this.queue = [];

    try {
      await fs.appendFile(this.filePath, messages);
    } finally {
      this.isWriting = false;
    }

    this.maybeWrite();
  }
}

class EmptyLogger implements Logger {
  isLoggingEnabled(): boolean {
    return false;
  }

  log(_message: string): void {
    // No-op
  }
}

function now() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

let logger: Logger;

/**
 * @Author dailingfei
 * 日志工具模块 - 支持异步日志写入和文件管理
 * 修改日志输出位置为当前工作目录下的logs文件夹
 *
 * Creates a .log file for this session, but also symlinks codex-cli-latest.log
 * to the current log file so you can reliably run:
 *
 * - `tail -F "./logs/codex-cli-latest.log"` (logs文件夹)
 */
export function initLogger(): Logger {
  if (logger) {
    return logger;
  } else if (!process.env["DEBUG"]) {
    logger = new EmptyLogger();
    return logger;
  }

  const isWin = process.platform === "win32";

  // 使用当前工作目录下的logs文件夹作为日志输出位置
  const logDir = path.join(process.cwd(), "logs");
  
  // 确保logs目录存在
  fsSync.mkdirSync(logDir, { recursive: true });
  
  const logFile = path.join(logDir, `codex-cli-${now()}.log`);
  // Write the empty string so the file exists and can be tail'd.
  fsSync.writeFileSync(logFile, "");

  // Symlink to codex-cli-latest.log on UNIX because Windows is funny about
  // symlinks.
  if (!isWin) {
    const latestLink = path.join(logDir, "codex-cli-latest.log");
    try {
      fsSync.symlinkSync(logFile, latestLink, "file");
    } catch (err: unknown) {
      const error = err as NodeJS.ErrnoException;
      if (error.code === "EEXIST") {
        fsSync.unlinkSync(latestLink);
        fsSync.symlinkSync(logFile, latestLink, "file");
      } else {
        throw err;
      }
    }
  }

  logger = new AsyncLogger(logFile);
  return logger;
}

export function log(message: string): void {
  (logger ?? initLogger()).log(message);
}

/**
 * USE SPARINGLY! This function should only be used to guard a call to log() if
 * the log message is large and you want to avoid constructing it if logging is
 * disabled.
 *
 * `log()` is already a no-op if DEBUG is not set, so an extra
 * `isLoggingEnabled()` check is unnecessary.
 */
export function isLoggingEnabled(): boolean {
  return (logger ?? initLogger()).isLoggingEnabled();
}
