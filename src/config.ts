import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import Log from "./log";

const proxyFilePath = path.join(__dirname, "proxy.txt");
const withHttp = (proxy: string): string => {
  return `http://${proxy}`;
};

const withHttps = (proxy: string): string => {
  return `https://${proxy}`;
};

export const saveProxy = (proxy: string): void => {
  fs.writeFileSync(proxyFilePath, proxy, "utf8");
};

export const readProxy = (): string | null => {
  if (fs.existsSync(proxyFilePath)) {
    return fs.readFileSync(proxyFilePath, "utf8");
  }
  return null;
};

export const setGitProxy = (proxy: string): void => {
  if (!proxy) {
    return;
  }
  try {
    execSync(`git config --global http.proxy ${withHttp(proxy)}`);
    execSync(`git config --global https.proxy ${withHttps(proxy)}`);
    Log.success(`Git proxy set to ${proxy}`);
  } catch (error) {
    console.error("Error setting Git proxy:", (error as Error).message);
  }
};

export const unsetGitProxy = (): void => {
  try {
    execSync("git config --global --unset http.proxy");
    execSync("git config --global --unset https.proxy");
    Log.success("Git proxy settings removed");
  } catch (error) {
    console.error("Error removing Git proxy:", (error as Error).message);
  }
};

export const getGitProxyHttp = (): void => {
  try {
    const http = execSync("git config --global --get http.proxy").toString();
    Log.success(http);
  } catch (error) {
    console.error("Error getting Git proxy:", (error as Error).message);
  }
};
export const getGitProxyHttps = (): void => {
  try {
    const https = execSync("git config --global --get https.proxy").toString();
    Log.success(https);
  } catch (error) {
    console.error("Error getting Git proxy:", (error as Error).message);
  }
};
