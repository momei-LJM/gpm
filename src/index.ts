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
} from "./config";
import Log from "./log";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf8"));

program.description("simple git proxy manager").version(pkg.version);

program
  .command("config <proxy>")
  .description("init proxy, this will be cached ")
  .action((proxy) => {
    if (proxy) {
      saveProxy(processProxyUrl(proxy));
    }
  });

program
  .command("get")
  .description("get proxy from config or git")
  .option("-c, --config", "get proxy from config")
  .option("-http, --http", "get http proxy from git")
  .option("-https, --https", "get https proxy from git")
  .action(({ config, http, https }) => {
    if (config) {
      if (!readProxy()) {
        Log.error(
          "No saved proxy found, you can set one using gpm config <proxy>"
        );
        return;
      }
      Log.success(readProxy()!);
      return;
    }
    if (http) {
      getGitProxyHttp();
      return;
    } else if (https) {
      getGitProxyHttps();
      return;
    }
    getGitProxyHttp();
    getGitProxyHttps();
  });

program
  .command("use")
  .description("use proxy config")
  .action(() => {
    const proxy = readProxy();
    if (!proxy) {
      Log.error("No saved proxy found, you can set one using gpm config <proxy>");
      return;
    }
    setGitProxy(proxy);
  });

program
  .command("unuse")
  .description("unuse proxy config")
  .action(() => {
    unsetGitProxy();
  });

// NPM 代理命令
program
  .command("npm")
  .description("NPM proxy and registry management")
  .addCommand(
    program
      .createCommand("proxy")
      .description("NPM proxy management")
      .addCommand(
        program
          .createCommand("set")
          .description("set NPM proxy (uses saved proxy config)")
          .action(() => {
            const proxy = readProxy();
            if (!proxy) {
              Log.error("No saved proxy found, you can set one using gpm config <proxy>");
              return;
            }
            setNpmProxy(proxy);
          })
      )
      .addCommand(
        program
          .createCommand("unset")
          .description("remove NPM proxy settings")
          .action(() => {
            unsetNpmProxy();
          })
      )
      .addCommand(
        program
          .createCommand("get")
          .description("get current NPM proxy settings")
          .action(() => {
            getNpmProxy();
          })
      )
  )
  .addCommand(
    program
      .createCommand("registry")
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
              Log.error("No saved NPM registry found, you can set one using gpm npm registry set <registry>");
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
      )
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
