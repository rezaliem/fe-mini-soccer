import _ from "lodash";

export const Mixin = {
  getValueOfKeysFromJSON(json: any, keys: string[], d?: string) {
    // dataOnboard was save as a wild JSON
    // this function is to return value, per key
    // eg. keys = dataOnboard.personalProfile.phone.number

    let value = d || "-"; // CHANGING THE VALUE WILL BREAK

    if (!_.isEmpty(json)) {
      let tmp = json;
      let flag = 0;

      keys.forEach((key) => {
        if (tmp !== null && key in tmp) tmp = tmp[key];
        else flag++;
      });

      if (flag === 0) value = tmp;
    }

    return value;
  },

  removeNullProperty(arr) {
    /*
      Fixed issue vselect not showing
      Problem: data from db has 'null' value in the array
      E.g: currency: [ null, 'USD' ]

      VSelect will prompt an error:
      Cannot read properties of null (reading 'hasOwnProperty')

      Solution: remove null from the array
    */
    if (arr && Array.isArray(arr)) {
      for (const [itemIndex, item] of arr.entries()) {
        if (item === null) arr.splice(itemIndex, 1);
      }
    }

    return arr;
  },

  checkString(v: string) {
    // Handle error if contains ' (apostrophe)
    // Solution: BE can read double apostrophe ''
    let c = null;
    if (v.includes("'")) {
      const i = v.indexOf("'");
      c = v.slice(0, i) + "'" + v.slice(i);
    }

    return c || v;
  },

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  snakeToString(snake: string, splitBy: string) {
    let a: string;

    const words = snake ? snake.split(splitBy) : [];

    // splited
    if (words.length > 0) {
      for (const [i, word] of words.entries()) {
        words[i] = this.capitalizeFirstLetter(word);
      }

      a = words.join(" ");
    }

    // noting to split
    else a = snake;

    return a;
  },
};
