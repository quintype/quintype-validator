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
    this.workers = new Array(poolSize);
    for(let i = 0; i < poolSize;i++){
      this.addNewWorker(filename)
    }
  }

  private addNewWorker(filename:string){
    this.workers.push(new Worker(filename))
  }

  runTask(task:Object,callback:Function){
    if(this.workers.length == 0){
      this.once('freedworker',()=>{
        console.log("worker freed")
        this.runTask(task,callback);
      })
      return;
    }
    const worker=this.workers.pop() as Worker
    worker.postMessage(task);
    worker.on('message',(result)=>{
      this.emit('freedworker')
      callback(undefined,result)
      this.workers.push(worker)
    })
    worker.on('error',(error)=>{
      callback(error,undefined);
    })
    worker.on('exit',(exitCode)=>{
      console.log("exit",exitCode);
      this.addNewWorker(this.filename);
    })
  }

}
