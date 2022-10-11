import { createFiber } from "./ReactFiber";
import { isArray, isStringOrNumber } from "./utils";

// 原生标签
export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);
    updateNode(wip.stateNode, wip.props);
  }
  reconcileChildren(wip, wip.props.children);
}

export function updateFunctionComponent() {}

export function updateClassComponent() {}

export function updateFragmentComponent() {}

export function updateHostTextComponent() {}

function reconcileChildren(wip, children) {
  //   debugger;
  if (isStringOrNumber(children)) {
    return;
  }

  const newChildren = isArray(children) ? children : [children];
  let previousNewFiber = null;
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    if (newChild == null) {
      continue;
    }
    const newFiber = createFiber(newChild, wip);
    if (previousNewFiber === null) {
      wip.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }

    previousNewFiber = newFiber;
  }
}

function updateNode(node, nextVal) {
  Object.keys(nextVal).forEach((k) => {
    if (k === "children") {
      // 有可能是文本
      if (isStringOrNumber(nextVal[k])) {
        node.textContent = nextVal[k] + "";
      }
    } else {
      node[k] = nextVal[k];
    }
  });
}
