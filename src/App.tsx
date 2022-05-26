import {
  Component,
  createMemo,
  createSignal,
  Index,
  onMount,
  Show,
} from 'solid-js';
import { useReqCtx } from './store/context';
import style from './app.module.scss';
import Tabs from './components/Tabs';
import JsonView from './components/JsonView';
import ResizablePanel from './components/ResizablePanel';

const App: Component = () => {
  const { reqList } = useReqCtx();
  const [currentReq, setCurrentReq] = createSignal<number | null>(null);
  const tabs = createMemo(() => {
    if (currentReq() === null) return [];
    const { request, response } = reqList()[currentReq()!];
    return [
      {
        title: 'Request',
        content: () => {
          const json = JSON.stringify(request.variables, null, 2);
          return (
            <>
              <JsonView json={json} name="variables" />
              <ResizablePanel
                handleName="RAW"
                containerClassName={style.rawJsonContainer}
                className={style.rawJsonContent}
                side="top"
                defaultPlacement="80%"
              >
                <pre>{json}</pre>
              </ResizablePanel>
            </>
          );
        },
      },
      {
        title: 'Response',
        content: () => {
          const json = JSON.stringify(response, null, 2);
          return (
            <>
              <JsonView json={json} name="response" />
              <ResizablePanel
                handleName="RAW"
                containerClassName={style.rawJsonContainer}
                className={style.rawJsonContent}
                side="top"
                defaultPlacement="80%"
              >
                <pre>{json}</pre>
              </ResizablePanel>
            </>
          );
        },
      },
    ];
  });
  return (
    <div class={style.container}>
      <div class={style.requestList}>
        <Index each={reqList()}>
          {(req, i) => (
            <div
              class={`${style.requestBox} ${
                i === currentReq() ? style.active : ''
              }`}
              onClick={() => {
                setCurrentReq(i);
              }}
            >
              <div class={style.batchNumber}>{req().batchNumber}</div>
              <div class={style.title}>{req().request.operationName}</div>
            </div>
          )}
        </Index>
        <div class={style.requestBox}></div>
      </div>
      <Show when={currentReq() !== null}>
        <Tabs tabs={tabs} onClose={() => setCurrentReq(null)} />
      </Show>
    </div>
  );
};

export default App;
