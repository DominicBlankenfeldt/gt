const fs = require("fs");
export function write(content: any, source: any) {
  fs.writeFile(source, content, (err: any) => {
    if (err) {
      console.error(err);
      return;
    }
    //file written successfully
  });
}
