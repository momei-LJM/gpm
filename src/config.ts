import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import Log from "./log";

//设置为用户主目录
const proxyFilePath = path.join(os.homedir(), ".gpm-proxy");
const npmRegistryFilePath = path.join(os.homedir(), ".gpm-npm-registry");

export const isHttpOrHttps = (proxy: string): boolean => {
  return proxy.startsWith("http://") || proxy.startsWith("https://");
};

export const processProxyUrl = (proxy: string): string => {
  return isHttpOrHttps(proxy)
    ? proxy.replace(/((http|https):\/\/)/, "")
    : proxy;
};
export const withHttp = (proxy: string): string => {
  return `http://${proxy}`;
};

export const withHttps = (proxy: string): string => {
  return `https://${proxy}`;
};

export const saveProxy = (proxy: string): void => {
  try {
    fs.writeFileSync(proxyFilePath, proxy, "utf8");
    Log.config(`Proxy configuration saved: ${proxy}`);
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

export const escapeShellArg = (arg: string): string => {
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
    Log.git(`Proxy set to ${proxy}`);
  } catch (error) {
    Log.error(`Error setting Git proxy: ${(error as Error).message}`);
  }
};

export const unsetGitProxy = (): void => {
  try {
    execSync("git config --global --unset http.proxy");
    execSync("git config --global --unset https.proxy");
    Log.git("Proxy settings removed");
  } catch (error) {
    Log.error(`Error removing Git proxy: ${(error as Error).message}`);
  }
};

const getGitProxy = (type: 'http' | 'https'): void => {
  try {
    const proxy = execSync(`git config --global --get ${type}.proxy`, { encoding: 'utf8' });
    Log.git(`${type.toUpperCase()} proxy: ${proxy.trim()}`);
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

// NPM 代理管理
export const setNpmProxy = (proxy: string): void => {
  if (!proxy) {
    Log.error("No proxy configuration provided");
    return;
  }
  try {
    execSync(`npm config set proxy ${escapeShellArg(withHttp(proxy))}`);
    execSync(`npm config set https-proxy ${escapeShellArg(withHttps(proxy))}`);
    Log.npm(`Proxy set to ${proxy}`);
  } catch (error) {
    Log.error(`Error setting NPM proxy: ${(error as Error).message}`);
  }
};

export const unsetNpmProxy = (): void => {
  try {
    execSync("npm config delete proxy");
    execSync("npm config delete https-proxy");
    Log.npm("Proxy settings removed");
  } catch (error) {
    Log.error(`Error removing NPM proxy: ${(error as Error).message}`);
  }
};

export const getNpmProxy = (): void => {
  try {
    const httpProxy = execSync("npm config get proxy", { encoding: 'utf8' }).trim();
    const httpsProxy = execSync("npm config get https-proxy", { encoding: 'utf8' }).trim();

    if (httpProxy && httpProxy !== 'null' && httpProxy !== 'undefined') {
      Log.npm(`HTTP proxy: ${httpProxy}`);
    } else {
      Log.warn("No NPM HTTP proxy configured");
    }

    if (httpsProxy && httpsProxy !== 'null' && httpsProxy !== 'undefined') {
      Log.npm(`HTTPS proxy: ${httpsProxy}`);
    } else {
      Log.warn("No NPM HTTPS proxy configured");
    }
  } catch (error) {
    Log.error(`Error getting NPM proxy: ${(error as Error).message}`);
  }
};

// NPM 镜像管理
export const saveNpmRegistry = (registry: string): void => {
  try {
    fs.writeFileSync(npmRegistryFilePath, registry, "utf8");
    Log.registry(`Registry configuration saved: ${registry}`);
  } catch (error) {
    Log.error(`Failed to save NPM registry configuration: ${(error as Error).message}`);
  }
};

export const readNpmRegistry = (): string | null => {
  try {
    if (fs.existsSync(npmRegistryFilePath)) {
      return fs.readFileSync(npmRegistryFilePath, "utf8").trim();
    }
    return null;
  } catch (error) {
    Log.error(`Failed to read NPM registry configuration: ${(error as Error).message}`);
    return null;
  }
};

export const setNpmRegistry = (registry: string): void => {
  if (!registry) {
    Log.error("No registry URL provided");
    return;
  }
  try {
    execSync(`npm config set registry ${escapeShellArg(registry)}`);
    Log.registry(`Registry set to ${registry}`);
  } catch (error) {
    Log.error(`Error setting NPM registry: ${(error as Error).message}`);
  }
};

export const getNpmRegistry = (): void => {
  try {
    const registry = execSync("npm config get registry", { encoding: 'utf8' }).trim();
    Log.registry(`Current registry: ${registry}`);
  } catch (error) {
    Log.error(`Error getting NPM registry: ${(error as Error).message}`);
  }
};

// 预设的 NPM 镜像
export const NPM_REGISTRIES = {
  npm: "https://registry.npmjs.org/",
  taobao: "https://registry.npmmirror.com/",
  cnpm: "https://r.cnpmjs.org/",
  yarn: "https://registry.yarnpkg.com/",
  tencent: "https://mirrors.cloud.tencent.com/npm/",
  huawei: "https://repo.huaweicloud.com/repository/npm/",
  aliyun: "https://npm.aliyun.com/"
};

export const listNpmRegistries = (): void => {
  Log.title("Available NPM registries");
  Object.entries(NPM_REGISTRIES).forEach(([name, url]) => {
    Log.pair(name, url, '📦');
  });
};

// 缓存文件管理
export const showCacheInfo = (): void => {
  Log.title("GPM cache information");

  Log.subtitle("Cache file locations");
  Log.pair("Proxy config", proxyFilePath, '🌐');
  Log.pair("NPM registry config", npmRegistryFilePath, '📦');

  Log.subtitle("Current configurations");

  // 检查文件是否存在并显示内容
  if (fs.existsSync(proxyFilePath)) {
    const proxyContent = fs.readFileSync(proxyFilePath, "utf8").trim();
    Log.status("Proxy", "configured", proxyContent);
  } else {
    Log.status("Proxy", "disabled");
  }

  if (fs.existsSync(npmRegistryFilePath)) {
    const registryContent = fs.readFileSync(npmRegistryFilePath, "utf8").trim();
    Log.status("NPM registry", "configured", registryContent);
  } else {
    Log.status("NPM registry", "disabled");
  }
};

export const clearCache = (): void => {
  try {
    let filesRemoved = 0;

    if (fs.existsSync(proxyFilePath)) {
      fs.unlinkSync(proxyFilePath);
      filesRemoved++;
    }

    if (fs.existsSync(npmRegistryFilePath)) {
      fs.unlinkSync(npmRegistryFilePath);
      filesRemoved++;
    }

    if (filesRemoved > 0) {
      Log.complete(`Cleared ${filesRemoved} cache file(s)`);
    } else {
      Log.warn("No cache files to clear");
    }
  } catch (error) {
    Log.error(`Error clearing cache: ${(error as Error).message}`);
  }
};

// 统一的代理配置保存函数
export const saveProxyConfig = (proxy: string, type: 'git' | 'npm'): void => {
  const processedProxy = processProxyUrl(proxy);

  if (type === 'git') {
    saveProxy(processedProxy);
  } else if (type === 'npm') {
    saveProxy(processedProxy); // NPM 也使用同一个代理配置
  }
};

// 统一的代理应用函数
export const useProxy = (type: 'git' | 'npm'): void => {
  const proxy = readProxy();
  if (!proxy) {
    Log.error(`No saved proxy found, you can set one using gpm config --${type} <proxy>`);
    return;
  }

  if (type === 'git') {
    setGitProxy(proxy);
  } else if (type === 'npm') {
    setNpmProxy(proxy);
  }
};

// 统一的代理移除函数
export const unuseProxy = (type: 'git' | 'npm'): void => {
  if (type === 'git') {
    unsetGitProxy();
  } else if (type === 'npm') {
    unsetNpmProxy();
  }
};

// 统一的代理查看函数
export const getProxyStatus = (type: 'git' | 'npm'): void => {
  if (type === 'git') {
    getGitProxyHttp();
    getGitProxyHttps();
  } else if (type === 'npm') {
    getNpmProxy();
  }
};
