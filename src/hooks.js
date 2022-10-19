export function useReducer(reducer, initalState) {
  const dispatch = () => {
    console.log("LOG");
  };
  return [initalState, dispatch];
}
