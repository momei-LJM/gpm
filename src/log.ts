import chalk from "chalk";

export default class Log {
  static info(message: string) {
    console.log(chalk.blue(message));
  }
  static warn(message: string) {
    console.log(chalk.yellow(message));
  }
  static success(message: string) {
    console.log(chalk.green(message));
  }

  static error(message: string) {
    console.log(chalk.red(message));
  }
}
