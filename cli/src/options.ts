import prompts, {PromptObject} from "prompts";
import npmNameValidate from "validate-npm-package-name";

export interface UserOptions {
  name: string,
  tailwind: boolean,
  document: boolean,
  git: string
}

const defaultProjectName = "vue3-example-project";

const questions = [
  {
    name: "name",
    type: "text",
    message: `project-name/npm-package-name(default: ${defaultProjectName})`,
    onState: (state: { aborted: boolean }) => {
      if (state.aborted) {
        process.nextTick(() => {
          process.exit(0);
        });
      }
    }
  }
];

export async function getOptions() {
  const promptsResponse = await prompts(questions as PromptObject<string>[]);
  if (promptsResponse.name === "") {
    promptsResponse.name = defaultProjectName;
  }
  const result: UserOptions = promptsResponse as UserOptions;
  checkOptions(result);
  return result;
}

function checkOptions(options: UserOptions) {
  const {name} = options;
  checkName(name);
}

function checkName(name: string) {
  const checkResult = npmNameValidate(name);
  if (!checkResult.validForNewPackages && !checkResult.validForOldPackages) {
    throw new Error(`不正确的项目名称（npm包名称）："${name}", 详情见 https://docs.npmjs.com/package-name-guidelines`);
  }
}
