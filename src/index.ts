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

const isHttpOrHttps = (proxy: string) => {
  return proxy.startsWith("http://") || proxy.startsWith("https://");
};
program.description("simple git proxy manager").version("0.0.1");

program
  .option("-c, --config <proxy>", "init proxy")
  .option("-g, --get", "get proxy")
  .option("-s, --set", "set proxy")
  .option("-u, --unset", "unset proxy")
  .option("-http, --http", "get http proxy")
  .option("-https, --https", "get https proxy")
  .action((params) => {
    if (Object.keys(params).length === 0) {
      Log.warn("Please provide a valid option");
      return;
    }
    const { set, get, unset, config, http, https } = params;
    if (config) {
      saveProxy(
        isHttpOrHttps(config)
          ? config.replace(/((http|https):\/\/)/, "")
          : config
      );
      return;
    }
    if (http) {
      getGitProxyHttp();
      return;
    } else if (https) {
      getGitProxyHttps();
      return;
    } else if (unset) {
      unsetGitProxy();
      return;
    }

    if (!readProxy()) {
      Log.error("No saved proxy found, you can set one using --config");
      return;
    }
    if (set) {
      setGitProxy(readProxy()!);
    } else if (get) {
      Log.success(readProxy()!);
    }
  });

program.parse();
