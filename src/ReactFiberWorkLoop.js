import {
  updateClassComponent,
  updateFragmentComponent,
  updateFunctionComponent,
  updateHostComponent,
  updateHostTextComponent,
} from "./ReactFiberReconciler";
import {
  ClassComponent,
  FunctionComponent,
  HostComponent,
  HostText,
  Fragment,
} from "./ReactWorkTags";
import { Placement } from "./utils";

let wip = null; // work in progress
let wipRoot = null;

// 组件初次渲染和更新
export function scheduleUpdateOnFiber(fiber) {
  wip = fiber;
  wipRoot = fiber;
}

function performUnitOfWork() {
  // debugger;
  const { tag } = wip;

  // tode 1.更新当前组件
  switch (tag) {
    case HostComponent:
      updateHostComponent(wip);
      break;
    case FunctionComponent:
      updateFunctionComponent(wip);
      break;
    case ClassComponent:
      updateClassComponent(wip);
      break;
    case Fragment:
      updateFragmentComponent(wip);
      break;
    case HostText:
      updateHostTextComponent(wip);
      break;
    default:
      break;
  }

  // todo 2.下一个更新谁 深度优先遍历（国王的故事）
  if (wip.child) {
    wip = wip.child;
    return;
  }

  let next = wip;

  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return;
    }
    next = next.return;
  }

  wip = null;
}

function workLoop(IdleDeadline) {
  while (wip && IdleDeadline.timeRemaining() > 0) {
  // while (wip) {
    performUnitOfWork();
  }

  // 提交
  if (!wip && wipRoot) {
    commitRoot();
  }
}

// 提交
function commitRoot() {
  commitWorker(wipRoot);
  wipRoot = null;
}

function commitWorker(wip) {
  // debugger;
  if (!wip) {
    return;
  }

  // 1.提交自己
  const parentNode = getParentNode(wip.return);
  const { flags, stateNode } = wip;
  if (flags & Placement && stateNode) {
    parentNode.appendChild(stateNode);
  }
  // 2.提交子节点
  commitWorker(wip.child);
  // 3.提交兄弟
  commitWorker(wip.sibling);
}

function getParentNode(wip) {
  let tem = wip;
  while(tem){
    if(tem.stateNode){
      return tem.stateNode;
    }
    tem = tem.return
  }
}

requestIdleCallback(workLoop);
