import { Component, createSignal, Index, onMount, Show } from 'solid-js';
import { Req, useReqCtx } from './store/context';
import style from './app.module.scss';
import { Tabs } from './components/Tabs';
import jsonview from '@pgrabovets/json-view';

const App: Component = () => {
  const { reqList } = useReqCtx();
  const [currentReq, setCurrentReq] = createSignal<number | null>(null);

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
        <Tabs
          tabs={[
            {
              title: 'Request',
              content: () => {
                onMount(() => {
                  console.log('reqList()', reqList(), currentReq());
                  const tree = jsonview.create(
                    JSON.stringify(reqList()[currentReq()!].request.variables),
                  );
                  jsonview.render(
                    tree,
                    document.getElementById('request_json_view'),
                  );
                });
                return <div id="request_json_view"></div>;
              },
            },
            {
              title: 'Response',
              content: () => {
                onMount(() => {
                  const tree = jsonview.create(
                    reqList()[currentReq()!].response,
                  );
                  jsonview.render(
                    tree,
                    document.getElementById('response_json_view'),
                  );
                });
                return <div id="response_json_view"></div>;
              },
            },
          ]}
        />
      </Show>
    </div>
  );
};

export default App;
