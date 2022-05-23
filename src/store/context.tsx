import {
  createSignal,
  createContext,
  useContext,
  Component,
  JSX,
  Accessor,
} from 'solid-js';

export interface Req {
  url: string;
  request: {
    operationName: string;
    variables: any;
  };
  batchNumber: number;
  response: string;
}

type ReqCtx = {
  reqList: Accessor<Req[]>;
  pushReq: (req: Req[]) => Req[];
};

const reqCtx = createContext<ReqCtx>({} as unknown as ReqCtx);

export const ReqCtxProvider: Component<{ children: JSX.Element }> = (props) => {
  const [reqList, setReqList] = createSignal<Req[]>([]);
  const value: ReqCtx = {
    reqList,
    pushReq: (req) => setReqList((p) => [...p, ...req]),
  };
  chrome.devtools.network.onNavigated.addListener(() => {
    // TODO: reset batch number when navigated to a new page
  });
  let batchNumber = 0;
  chrome.devtools.network.onRequestFinished.addListener(async (req) => {
    if (req._resourceType !== 'fetch' || !req.request.url.endsWith('/graphql'))
      return;
    batchNumber++;
    try {
      const response: string = await new Promise((resolved) =>
        req.getContent((content) => resolved(content)),
      );
      const requestPayload = JSON.parse(req.request.postData?.text ?? '');
      const url = req.request.url;
      value.pushReq(
        requestPayload.map(({ operationName, variables }: any) => ({
          url,
          request: {
            operationName,
            variables,
          },
          batchNumber,
          response,
        })),
      );
    } catch (e) {
      console.error(e);
    }
  });

  return <reqCtx.Provider value={value}>{props.children}</reqCtx.Provider>;
};

export const useReqCtx = () => useContext(reqCtx) as ReqCtx;
