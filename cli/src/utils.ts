import {readFileSync, writeFileSync} from 'fs';

export function deleteFileLines(path: string, regex: string, encoding?: BufferEncoding);
export function deleteFileLines(path: string, regex: RegExp, encoding?: BufferEncoding);
export function deleteFileLines(path: string, regex: string | RegExp, encoding: BufferEncoding = 'utf8') {
  const fileContent = readFileSync(path, {encoding});
  const filteredContent = fileContent
    .split('\n')
    .filter(line => typeof regex === "string" ? !line.includes(regex) : !regex.test(line))  // 过滤掉包含 'cli' 的行
    .join('\n');
  writeFileSync(path, filteredContent, encoding);
}

export function replaceFileLetters(path: string, regex: string, letter: string, encoding?: BufferEncoding);
export function replaceFileLetters(path: string, regex: RegExp, letter: string, encoding?: BufferEncoding);
export function replaceFileLetters(path: string, regex: string | RegExp, letter: string, encoding: BufferEncoding = 'utf8') {
  const fileContent = readFileSync(path, {encoding});
  const filteredContent = fileContent
    .split('\n')
    .map(line => line.replace(regex, letter))  // 过滤掉包含 'cli' 的行
    .join('\n');
  writeFileSync(path, filteredContent, encoding);
}
