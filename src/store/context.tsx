import {
  createSignal,
  createContext,
  useContext,
  Component,
  JSX,
  Accessor,
} from 'solid-js';

type ReqCtx = {
  reqList: Accessor<chrome.devtools.network.Request[]>;
  pushReq: (
    req: chrome.devtools.network.Request,
  ) => chrome.devtools.network.Request[];
};

const reqCtx = createContext<ReqCtx>();

export const ReqCtxProvider: Component<{ children: JSX.Element }> = (props) => {
  const [reqList, setReqList] = createSignal<chrome.devtools.network.Request[]>(
    [],
  );
  const value = {
    reqList,
    pushReq: (req: chrome.devtools.network.Request) =>
      setReqList((p) => [...p, req]),
  };
  chrome.devtools.network.onRequestFinished.addListener((req) => {
    if (req._resourceType !== 'fetch' || !req.request.url.endsWith('/graphql'))
      return;
    value.pushReq(req);
  });

  return <reqCtx.Provider value={value}>{props.children}</reqCtx.Provider>;
};

export const useReqCtx = () => useContext(reqCtx) as ReqCtx;
