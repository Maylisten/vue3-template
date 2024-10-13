import {getOptions, UserOptions} from "./options";
import {downloadTemplate} from "./clone";
import chalk from "chalk";

(async function () {
  try {
    const options = await getOptions();
    await downloadTemplate(options as UserOptions);
  } catch (err) {
    console.log(chalk.red(err));
  }
})();
