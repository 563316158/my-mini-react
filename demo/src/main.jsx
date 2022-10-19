import { ReactDOM, Component, useReducer } from "../which-react";
import "./index.css";

function FunctionComponent(props) {
  const [count, setCount] = useReducer((x) => x + 1, 0);

  return (
    <div className="border">
      <p>{props.name}</p>
      <button onClick={() => setCount()}>{count}</button>
    </div>
  );
}

class ClassComponent extends Component {
  render() {
    return (
      <div className="border">
        <h3>{this.props.name}</h3>
        我是类组件的文本
      </div>
    );
  }
}

function FragmentComponent() {
  return (
    <ul>
      <>
        <li>part1</li>
        <li>part2</li>
      </>
    </ul>
  );
}

const jsx = (
  <div className="border">
    {null}
    <h1>react</h1>
    <a href="https://github.com/bubucuo/mini-react">mini react</a>
    <FunctionComponent name="函数组件" />
    <ClassComponent name="类组件" />
    <FragmentComponent />
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(jsx);
