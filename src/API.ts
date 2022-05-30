export function setData(key: string, data: any): void {
  localStorage.setItem(
    key,
    JSON.stringify(data, function (key, value) {
      if (typeof value === "function") {
        return value.toString();
      } else {
        return value;
      }
    })
  );
}
export function getData(key: string): any {
  return JSON.parse(
    localStorage.getItem(key) || "false",
    function (key, value) {
      if (typeof value == "string") {
        if (value.slice(0, 3) == "fun") {
          return eval("(" + value + ")");
        } else {
          return value;
        }
      } else {
        return value;
      }
    }
  );
}
