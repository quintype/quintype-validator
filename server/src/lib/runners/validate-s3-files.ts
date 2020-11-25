import S3 from 'aws-sdk/clients/s3'
import fs from "fs"
import _ from 'lodash';
import { asyncValidateStream } from "../utils/validator"
import { WorkerThreadPool } from "../utils/worker-thread-pool"
import { parentPort } from "worker_threads"
const config = require("js-yaml").load(fs.readFileSync('config/migrator.yml'))

async function validateByKey(data: any, type: string, uniqueSlugs: Set<string>) {
  const { Name, files } = data
  let result: { [key: string]: any } | any = { exceptions: [] }
  const s3 = new S3({
    accessKeyId: config['accessKeyId'],
    secretAccessKey: config['secretAccessKey']
  })
  for (const key of files) {
    try {
      const readableStream = s3.getObject({
        Bucket: Name,
        Key: key
      })
        .createReadStream()
      result = await asyncValidateStream(readableStream, type, result, uniqueSlugs)
    } catch (error) {
      const errorKey = result.exceptions.find((err: { key: string; }) => err.key === error)

      if (!errorKey) {
        result.exceptions.push({
          key: error,
          ids: [key]
        })
      } else {
        errorKey.ids.push(key)
      }
    }
  }
  return result
}

export async function validateS3Files(s3Data: any, type: string, uniqueSlugs: Set<string>, workerPool: WorkerThreadPool) {
  let { path, files } = s3Data
  const bucket = path.split('/')[2]
  const data = {
    Name: bucket,
    files
  }
  let resultArr = await new Promise((resolve, reject) => {
    workerPool.runTask({data, type, uniqueSlugs }, (error: any, result: any) => {
      if (error) {
        reject(error);
        return;
      } resolve(result)
    })
  }).catch((err)=>{
      return err
  })

  return resultArr;
}


parentPort && parentPort.on('message', async (task: { s3: any, data: any, type: string, uniqueSlugs: Set<string> }) => {
  const {data, type, uniqueSlugs } = task;
  try {
    const result = await validateByKey(data, type, uniqueSlugs);
    parentPort && parentPort.postMessage(result)
  }
  catch (err) {
    parentPort && parentPort.emit('error', "worker errored out")
  }
})
