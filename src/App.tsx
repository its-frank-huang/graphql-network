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
import { Tabs } from './components/Tabs';
import jsonview from '@pgrabovets/json-view';

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
          onMount(() => {
            const tree = jsonview.create(JSON.stringify(request.variables));
            jsonview.render(tree, document.getElementById('request_json_view'));
            tree.el.querySelector('.json-key').innerText = 'variables';
            if (tree.children.length > 0) {
              const icon = tree.el.querySelector('.caret-icon');
              if (icon) {
                icon.classList.replace('fa-caret-right', 'fa-caret-down');
              }
              tree.isExpanded = true;
              tree.children.forEach((child: any) => {
                child.el.classList.remove('hidden');
              });
            } else {
              tree.el.querySelector('.json-value').innerText = '{0}';
            }
          });
          return <div id="request_json_view"></div>;
        },
      },
      {
        title: 'Response',
        content: () => {
          onMount(() => {
            const tree = jsonview.create(response);
            jsonview.render(
              tree,
              document.getElementById('response_json_view'),
            );
          });
          return <div id="response_json_view"></div>;
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
