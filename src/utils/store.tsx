import React, { createContext, useReducer, ReactElement } from "react";

export const RootContext = createContext({});
export const UPDATE_STOCK = "updateStock";
export const UPDATE_ITEM = "updateItem";
interface State {
  stock: string;
  // [day, open, close, lowest, highest] （即：[日期, 开盘值, 收盘值, 最低值, 最高值]）
  item: [[number, number, number, number, number]];
}
export interface IRootContext {
  state: State;
  dispatch: Function;
}

const reducer = (state: State, action: { type: string; value: any }) => {
  switch (action.type) {
    case UPDATE_STOCK:
      return {
        ...state,
        stock: action.value,
      };
      case UPDATE_ITEM:
        return {
          ...state,
          item: action.value,
        };
    default:
      throw new Error();
  }
};

interface IProps {
  children: ReactElement;
}

const RootContextProvider: React.FC<IProps> = (props: IProps) => {
  const [state, dispatch] = useReducer(reducer, {
    stock: "",
    item: [0, 0, 0, 0, 0],
  });
  return (
    <RootContext.Provider value={{ state, dispatch }}>
      {props.children}
    </RootContext.Provider>
  );
};

export default RootContextProvider;
