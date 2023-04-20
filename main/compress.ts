import path from "path";
import fs from "fs";
import minimatch from "minimatch";
import compressing from "compressing";

function traverseFolder(folderPath: string) {
  const filesToCompress: string[] = [];

  const _traverseFolder = (fPath: string) => {
    const files = fs.readdirSync(folderPath);
    const rules = fs
      .readFileSync(path.join(fPath, ".gitignore"))
      .toString()
      .split("\n")
      .filter(Boolean);
    const regexRules = rules.map(
      (rule) => minimatch.makeRe(rule) as minimatch.MMRegExp
    );

    for (const file of files) {
      const filePath = path.join(fPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        traverseFolder(filePath);
      } else {
        const isIgnored = regexRules.some((rule) => rule.test(filePath));
        if (!isIgnored) {
          filesToCompress.push(filePath);
        }
      }
    }
  };

  _traverseFolder(folderPath);
  return filesToCompress;
}

function compress(srcPath: string, destPath: string) {
  const filesToCompress = traverseFolder(srcPath);

  const zipStream = new compressing.zip.Stream();
  filesToCompress.forEach((f) => zipStream.addEntry(f));

  const destStream = fs.createWriteStream(destPath);
  zipStream.pipe(destStream);
}

export { compress };
