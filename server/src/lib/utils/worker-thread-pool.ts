import {Worker} from 'worker_threads';
import { EventEmitter } from 'events';

export class WorkerThreadPool extends EventEmitter{
  filename:string;
  poolSize:number;
  workers: Array<Worker>;

  constructor(filename:string,poolSize:number){
    super();
    this.filename = filename;
    this.poolSize = poolSize
    this.workers = [];
    for(let i = 0; i < poolSize;i++){
      this.addNewWorker(filename)
    }
  }

  private addNewWorker(filename:string){
    if(this.workers.length === this.poolSize)
      return;
    this.workers.push(new Worker(filename))
  }

  runTask(task:Object,callback:Function){
    if(this.workers.length === 0){
      this.once('freedworker',()=>{
        this.runTask(task,callback);
      })
      return;
    }
    const worker=this.workers.shift() as Worker
    worker.postMessage(task);
    worker.once('message',(result)=>{
      this.emit('freedworker');
      callback(undefined,result);
      this.workers.push(worker);
    })
    worker.once('error',(error)=>{
      callback(error,undefined);
      console.error(`worker ${worker.threadId} errored`,error);
      this.workers.push(worker);
    })
    worker.once('exit',(exitCode)=>{
      console.error(`worker ${worker.threadId} exited with exit code ${exitCode}`);
      this.workers.push(worker);
    })
  }

}
