import { peek, pop, push } from "./minHeap";

let taskQueue = [];
let taskIdCounter = 1;

export function scheduleCallback(callback){
     const currentTime = getCurrentTime();

     const timeout = -1;

     const expirtationTime = currentTime - timeout;

     const newTask = {
        id: taskIdCounter++,
        callback,
        expirtationTime,
        sortIndex: expirtationTime, 
     };

     push(taskQueue,newTask)
     // 请求调度
     requestHostCallback();
}

function requestHostCallback(){
    port.postMessage(null)
}

const channel = new MessageChannel();
const port = channel.port2;

channel.port1.onmessage = function (){
    workLoop();
}

function workLoop(){
    console.log("taskQueue:", JSON.parse(JSON.stringify(taskQueue)) );
    let currentTask = peek(taskQueue);
    while(currentTask){
        const callback = currentTask.callback;
        currentTask.callback = null;
        callback();
        pop(taskQueue);
        currentTask = peek(taskQueue);
    }
}

function getCurrentTime(){
    return performance.now()
}