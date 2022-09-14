import { createStore, SetStoreFunction, Store } from "solid-js/store";
import { createEffect } from "solid-js";

function createLocalStore<T>(initState: T): [Store<T>, SetStoreFunction<T>] {
  const [state, setState] = createStore(initState);
  if (localStorage["mulforma-lynkr"]) {
    setState(JSON.parse(localStorage["mulforma-lynkr"]));
  }
  createEffect(() => (localStorage["mulforma-lynkr"] = JSON.stringify(state)));
  return [state, setState];
}

function randomString(length: number): string {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export const [state, setState] = createLocalStore({
  pwd: null,
});
