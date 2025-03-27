function run() {
  // 执行一段代码
  Object.prototype[Symbol.iterator] =  function() {
    const keys = Object.keys(this);
    let index = 0;
    return {
      next: () => {
        if (index < keys.length) {
          const key = keys[index++];
          return { value: this[key], done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
}
run();
const [a, b] = {a: 1, b: 2} ;
console.log(a, b); // 输出 1 2
