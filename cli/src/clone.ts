import download from "download-git-repo";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import shelljs from "shelljs";
import {readJSON, writeJSON} from "fs-extra";
import {deleteFileLines} from "./utils";
import {UserOptions} from "./options";

const templateRemoteUrl = "Maylisten/vue3-template";
let domain = "";
let name = "";
let completeName = "";
let rootPath = "";
let cliPath = "";

const setProjectInfo = (option: UserOptions) => {
  const projectName = option.name;
  domain = projectName.trim().split("/").at(-2) ?? "";
  name = projectName.trim().split("/").at(-1);
  completeName = `${domain}${domain ? "/" : ""}${name}`;
  rootPath = path.join(process.cwd(), name);
  cliPath = path.join(rootPath, 'cli');
};

const downloadCompleteTemplate = () => {
  const downSpinner = ora("正在下载模板...").start();
  return new Promise((resolve, reject) => {
    download(templateRemoteUrl, name, {clone: false}, (err) => {
      if (err) {
        downSpinner.fail();
        reject(err);
        return;
      }
      downSpinner.succeed(chalk.green("模板下载成功！"));
      resolve(1);
    });
  });
};

const removePnpmSetting = () => {
  const removeFilePaths = [path.join(rootPath, "pnpm-lock.yaml"), path.join(rootPath, "pnpm-workspace.yaml")];
  removeFilePaths.forEach(filePath => shelljs.rm("-rf", filePath));
};

const removeCliDir = () => {
  shelljs.rm("-rf", cliPath);
};

const removeCliPackageJsonScripts = () => {
  const jsonPath = path.join(rootPath, "package.json");
  deleteFileLines(jsonPath, /[Cc]li/);
  deleteFileLines(jsonPath, "release");
};

const removeCli = () => {
  removeCliDir();
  removeCliPackageJsonScripts();
};

const resetPackageJsonName = async () => {
  const jsonPath = path.join(rootPath, "package.json");
  const json = await readJSON(jsonPath, {encoding: 'utf8'}) as Record<string, unknown>;
  json.name = completeName;
  await writeJSON(jsonPath, json, {spaces: 2});
};

const shake = async () => {
  const downSpinner = ora("正在初始化模板...").start();
  try {
    removePnpmSetting();
    removeCli();
    await resetPackageJsonName();
    downSpinner.succeed(chalk.green("模板初始化成功！"));
  } catch (err) {
    downSpinner.fail();
    throw new Error(err);
  }
};

export const downloadTemplate = async (options: UserOptions) => {
  setProjectInfo(options);
  await downloadCompleteTemplate();
  await shake();
};
