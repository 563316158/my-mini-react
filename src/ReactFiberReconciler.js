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

export function updateFunctionComponent(wip) {
  const { type, props } = wip;
  const children = type(props);
  reconcileChildren(wip, children);
}

export function updateClassComponent(wip) {
  const { type, props } = wip;
  const instance = new type(props);
  const children = instance.render();
  reconcileChildren(wip, children);
}

export function updateFragmentComponent(wip) {
  console.log("Fragment:", wip);
  const children = wip.props.children;
  reconcileChildren(wip, children);
}

export function updateHostTextComponent(wip) {
  wip.stateNode = document.createTextNode(wip.props.children);
}

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
    } else if (k.slice(0, 2) === "on") {
      // fake
      const eventName = k.slice(2).toLocaleLowerCase();
      node.addEventListener(eventName, nextVal[k]);
    } else {
      node[k] = nextVal[k];
    }
  });
}
