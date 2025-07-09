import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import Log from "./log";

//设置为用户主目录
const proxyFilePath = path.join(os.homedir(), ".gpm-proxy");
const withHttp = (proxy: string): string => {
  return `http://${proxy}`;
};

const withHttps = (proxy: string): string => {
  return `https://${proxy}`;
};

export const saveProxy = (proxy: string): void => {
  try {
    fs.writeFileSync(proxyFilePath, proxy, "utf8");
    Log.success(`Proxy configuration saved: ${proxy}`);
  } catch (error) {
    Log.error(`Failed to save proxy configuration: ${(error as Error).message}`);
  }
};

export const readProxy = (): string | null => {
  try {
    if (fs.existsSync(proxyFilePath)) {
      return fs.readFileSync(proxyFilePath, "utf8").trim();
    }
    return null;
  } catch (error) {
    Log.error(`Failed to read proxy configuration: ${(error as Error).message}`);
    return null;
  }
};

const escapeShellArg = (arg: string): string => {
  return `"${arg.replace(/"/g, '\\"')}"`;
};

export const setGitProxy = (proxy: string): void => {
  if (!proxy) {
    Log.error("No proxy configuration provided");
    return;
  }
  try {
    execSync(`git config --global http.proxy ${escapeShellArg(withHttp(proxy))}`);
    execSync(`git config --global https.proxy ${escapeShellArg(withHttps(proxy))}`);
    Log.success(`Git proxy set to ${proxy}`);
  } catch (error) {
    Log.error(`Error setting Git proxy: ${(error as Error).message}`);
  }
};

export const unsetGitProxy = (): void => {
  try {
    execSync("git config --global --unset http.proxy");
    execSync("git config --global --unset https.proxy");
    Log.success("Git proxy settings removed");
  } catch (error) {
    Log.error(`Error removing Git proxy: ${(error as Error).message}`);
  }
};

const getGitProxy = (type: 'http' | 'https'): void => {
  try {
    const proxy = execSync(`git config --global --get ${type}.proxy`, { encoding: 'utf8' });
    Log.success(`${type.toUpperCase()} proxy: ${proxy.trim()}`);
  } catch (error) {
    Log.warn(`No ${type.toUpperCase()} proxy configured`);
  }
};

export const getGitProxyHttp = (): void => {
  getGitProxy('http');
};

export const getGitProxyHttps = (): void => {
  getGitProxy('https');
};
