#!/usr/bin/env node

import { program } from "commander";
import {
  saveProxy,
  readProxy,
  setGitProxy,
  unsetGitProxy,
  getGitProxyHttp,
  getGitProxyHttps,
  isHttpOrHttps,
  processProxyUrl,
  setNpmProxy,
  unsetNpmProxy,
  getNpmProxy,
  saveNpmRegistry,
  readNpmRegistry,
  setNpmRegistry,
  getNpmRegistry,
  NPM_REGISTRIES,
  listNpmRegistries,
  showCacheInfo,
  clearCache,
  saveProxyConfig,
  useProxy,
  unuseProxy,
  getProxyStatus,
} from "./config";
import Log from "./log";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf8"));

program.description("Git & NPM Proxy Manager").version(pkg.version);

// 重构后的 config 命令 - 只负责保存代理到缓存
program
  .command("config <proxy>")
  .description("save proxy configuration to cache")
  .option("--git", "configure for Git (default)")
  .option("--npm", "configure for NPM")
  .action((proxy, options) => {
    const type = options.npm ? 'npm' : 'git';
    saveProxyConfig(proxy, type);
  });

// 重构后的 use 命令 - 应用缓存的代理配置
program
  .command("use")
  .description("apply cached proxy configuration")
  .option("--git", "apply to Git (default)")
  .option("--npm", "apply to NPM")
  .option("--all", "apply to both Git and NPM")
  .action((options) => {
    if (options.all) {
      useProxy('git');
      useProxy('npm');
    } else {
      const type = options.npm ? 'npm' : 'git';
      useProxy(type);
    }
  });

// 重构后的 unuse 命令 - 移除代理配置
program
  .command("unuse")
  .description("remove proxy configuration")
  .option("--git", "remove from Git (default)")
  .option("--npm", "remove from NPM")
  .option("--all", "remove from both Git and NPM")
  .action((options) => {
    if (options.all) {
      unuseProxy('git');
      unuseProxy('npm');
    } else {
      const type = options.npm ? 'npm' : 'git';
      unuseProxy(type);
    }
  });

// get 命令 - 查看当前代理状态
program
  .command("get")
  .description("get current proxy configuration")
  .option("-c, --config", "get proxy from cache")
  .option("--git", "get Git proxy status (default)")
  .option("--npm", "get NPM proxy status")
  .option("--all", "get all proxy status")
  .action((options) => {
    if (options.config) {
      const proxy = readProxy();
      if (!proxy) {
        Log.error("No saved proxy found, you can set one using gpm config <proxy>");
        return;
      }
      Log.success(`Cached proxy: ${proxy}`);
      return;
    }

    if (options.all) {
      Log.info("Git proxy status:");
      getProxyStatus('git');
      Log.info("\nNPM proxy status:");
      getProxyStatus('npm');
    } else {
      const type = options.npm ? 'npm' : 'git';
      getProxyStatus(type);
    }
  });

// NPM 镜像管理命令
program
  .command("registry")
  .description("NPM registry management")
  .addCommand(
    program
      .createCommand("set")
      .argument("<registry>", "registry URL or preset name")
      .description("set NPM registry")
      .action((registry) => {
        // 检查是否是预设名称
        const presetRegistry = NPM_REGISTRIES[registry as keyof typeof NPM_REGISTRIES];
        const registryUrl = presetRegistry || registry;

        saveNpmRegistry(registryUrl);
        setNpmRegistry(registryUrl);
      })
  )
  .addCommand(
    program
      .createCommand("use")
      .description("use saved NPM registry")
      .action(() => {
        const registry = readNpmRegistry();
        if (!registry) {
          Log.error("No saved NPM registry found, you can set one using gpm registry set <registry>");
          return;
        }
        setNpmRegistry(registry);
      })
  )
  .addCommand(
    program
      .createCommand("get")
      .description("get current NPM registry")
      .action(() => {
        getNpmRegistry();
      })
  )
  .addCommand(
    program
      .createCommand("list")
      .description("list available NPM registry presets")
      .action(() => {
        listNpmRegistries();
      })
  );

// 缓存管理命令
program
  .command("cache")
  .description("cache file management")
  .addCommand(
    program
      .createCommand("info")
      .description("show cache file locations and content")
      .action(() => {
        showCacheInfo();
      })
  )
  .addCommand(
    program
      .createCommand("clear")
      .description("clear all cache files")
      .action(() => {
        clearCache();
      })
  );

program.parse();
