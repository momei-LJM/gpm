import chalk from "chalk";

export default class Log {
  // 基础日志方法
  static info(message: string) {
    console.log(chalk.blue(`ℹ️  ${message}`));
  }

  static warn(message: string) {
    console.log(chalk.yellow(`⚠️  ${message}`));
  }

  static success(message: string) {
    console.log(chalk.green(`✅ ${message}`));
  }

  static error(message: string) {
    console.log(chalk.red(`❌ ${message}`));
  }

  // 扩展的美化日志方法
  static proxy(message: string) {
    console.log(chalk.magenta(`🌐 ${message}`));
  }

  static config(message: string) {
    console.log(chalk.cyan(`⚙️  ${message}`));
  }

  static cache(message: string) {
    console.log(chalk.gray(`💾 ${message}`));
  }

  static registry(message: string) {
    console.log(chalk.blue(`📦 ${message}`));
  }

  static git(message: string) {
    console.log(chalk.red(`🔧 Git: ${message}`));
  }

  static npm(message: string) {
    console.log(chalk.yellow(`📦 NPM: ${message}`));
  }

  // 特殊格式的日志
  static title(message: string) {
    console.log(chalk.bold.cyan(`\n🚀 ${message}`));
  }

  static subtitle(message: string) {
    console.log(chalk.bold(`\n📋 ${message}`));
  }

  static separator() {
    console.log(chalk.gray('─'.repeat(50)));
  }

  static loading(message: string) {
    console.log(chalk.blue(`⏳ ${message}...`));
  }

  static complete(message: string) {
    console.log(chalk.green(`🎉 ${message}`));
  }

  // 列表输出
  static list(items: string[], prefix = '  •') {
    items.forEach(item => {
      console.log(chalk.gray(`${prefix} ${item}`));
    });
  }

  // 键值对输出
  static pair(key: string, value: string, emoji = '📝') {
    console.log(`${emoji} ${chalk.bold(key)}: ${chalk.cyan(value)}`);
  }

  // 状态显示
  static status(service: string, status: 'enabled' | 'disabled' | 'configured', details?: string) {
    const statusEmoji = status === 'enabled' ? '🟢' : status === 'configured' ? '🔵' : '🔴';
    const statusColor = status === 'enabled' ? 'green' : status === 'configured' ? 'blue' : 'red';
    const statusText = status === 'enabled' ? 'ENABLED' : status === 'configured' ? 'CONFIGURED' : 'DISABLED';

    console.log(`${statusEmoji} ${chalk.bold(service)}: ${chalk[statusColor](statusText)}${details ? ` - ${details}` : ''}`);
  }

  // 表格样式输出
  static table(headers: string[], rows: string[][]) {
    console.log();
    // 输出表头
    console.log(chalk.bold.cyan(headers.join(' | ')));
    console.log(chalk.gray('─'.repeat(headers.join(' | ').length + 10)));

    // 输出行
    rows.forEach(row => {
      console.log(row.join(' | '));
    });
    console.log();
  }
}
