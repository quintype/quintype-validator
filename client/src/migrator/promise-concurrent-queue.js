import { EventEmitter } from "events";

export class PromiseQueue extends EventEmitter {
  promiseResolved = Symbol('resolved');
  concurrentPromises = 1;
  runningPromises = 0;
  promiseQueue = [];
  constructor(concurrentPromises) {
    super();
    this.concurrentPromises = concurrentPromises;
    this.promiseQueue = [];
  }

  addPromise(f,...args) {
    return new Promise((resolve, reject) => {
      this.promiseQueue.push({ f,args, resolve, reject })
      this.runPromise();
    })
  }

  runPromise() {
    if (this.runningPromises === this.concurrentPromises || this.promiseQueue.length === 0) {
      return;
    }
    let item;
    try {
      this.runningPromises++;
      item = this.promiseQueue.shift();
      console.info(item)
      item.f.apply(null,item.args)
        .then((result, error) => {
          if (error) {
            item.reject(error);
            return
          }
          item.resolve(result);
          this.emit(this.promiseResolved)
          this.runningPromises--
          this.runPromise();
        })
    } catch (err) {
      console.info(err);
      item.reject(err)
    }

  }
}