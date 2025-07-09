#!/usr/bin/env node

import { program } from "commander";
import {
  saveProxy,
  readProxy,
  setGitProxy,
  unsetGitProxy,
  getGitProxyHttp,
  getGitProxyHttps,
} from "./config";
import Log from "./log";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf8"));
const isHttpOrHttps = (proxy: string) => {
  return proxy.startsWith("http://") || proxy.startsWith("https://");
};
program.description("simple git proxy manager").version(pkg.version);

program
  .command("config <proxy>")
  .description("init proxy, this will be cached ")
  .action((proxy) => {
    if (proxy) {
      saveProxy(
        isHttpOrHttps(proxy) ? proxy.replace(/((http|https):\/\/)/, "") : proxy
      );
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

program.parse();
