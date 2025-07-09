# GPM - Git & NPM Proxy Manager

一个简单的 Git 和 NPM 代理管理工具，支持代理切换、NPM 镜像切换和缓存管理。

## 🚀 功能特性

- ✅ **Git 代理管理** - 快速设置和切换 Git HTTP/HTTPS 代理
- ✅ **NPM 代理管理** - 管理 NPM 的代理设置
- ✅ **NPM 镜像管理** - 快速切换常用的 NPM 镜像源
- ✅ **缓存管理** - 查看和清理配置文件
- ✅ **预设支持** - 内置常用镜像源配置

## 📦 安装

```bash
npm install -g @momei-x/gpm
```

## 🎯 使用方法

### Git 代理管理

```bash
# 配置代理（会自动去除 http:// 前缀）
gpm config http://127.0.0.1:7890
gpm config 127.0.0.1:7890

# 应用代理到 Git
gpm use

# 移除 Git 代理
gpm unuse

# 查看当前 Git 代理设置
gpm get
gpm get --http     # 仅查看 HTTP 代理
gpm get --https    # 仅查看 HTTPS 代理
gpm get --config   # 查看缓存的代理配置
```

### NPM 代理管理

```bash
# 设置 NPM 代理（使用缓存的代理配置）
gpm npm proxy set

# 移除 NPM 代理
gpm npm proxy unset

# 查看当前 NPM 代理设置
gpm npm proxy get
```

### NPM 镜像管理

```bash
# 设置 NPM 镜像（使用预设名称）
gpm npm registry set taobao
gpm npm registry set npm
gpm npm registry set cnpm

# 设置自定义镜像
gpm npm registry set https://registry.npm.your-domain.com/

# 使用已保存的镜像设置
gpm npm registry use

# 查看当前 NPM 镜像
gpm npm registry get

# 列出所有可用的预设镜像
gpm npm registry list
```

### 缓存管理

```bash
# 查看缓存文件位置和内容
gpm cache info

# 清理所有缓存文件
gpm cache clear
```

## 📋 可用的 NPM 镜像预设

| 名称    | 地址                                         | 说明       |
| ------- | -------------------------------------------- | ---------- |
| npm     | https://registry.npmjs.org/                  | 官方镜像   |
| taobao  | https://registry.npmmirror.com/              | 淘宝镜像   |
| cnpm    | https://r.cnpmjs.org/                        | CNPM 镜像  |
| yarn    | https://registry.yarnpkg.com/                | Yarn 镜像  |
| tencent | https://mirrors.cloud.tencent.com/npm/       | 腾讯云镜像 |
| huawei  | https://repo.huaweicloud.com/repository/npm/ | 华为云镜像 |
| aliyun  | https://npm.aliyun.com/                      | 阿里云镜像 |

## 💾 缓存文件位置

- 代理配置: `~/.gpm-proxy`
- NPM 镜像配置: `~/.gpm-npm-registry`

## 🔧 常用场景

### 场景 1: 设置完整的开发环境代理

```bash
# 1. 配置代理
gpm config 127.0.0.1:7890

# 2. 应用到 Git
gpm use

# 3. 应用到 NPM
gpm npm proxy set

# 4. 设置国内镜像加速
gpm npm registry set taobao
```

### 场景 2: 切换到公司网络

```bash
# 移除所有代理设置
gpm unuse
gpm npm proxy unset

# 使用公司镜像
gpm npm registry set https://npm.company.com/
```

### 场景 3: 重置到默认状态

```bash
# 清理所有配置
gpm cache clear

# 恢复 NPM 官方镜像
gpm npm registry set npm
```

## 🛠️ 开发

```bash
# 克隆项目
git clone https://github.com/your-username/gpm.git

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 运行测试
pnpm test
```

## 📝 License

MIT
