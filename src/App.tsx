import { Component, createMemo, createSignal, Index, Show } from 'solid-js';
import { useReqCtx } from './store/context';
import style from './app.module.scss';
import Tabs from './components/Tabs';
import JsonView from './components/JsonView';
import ResizablePanel from './components/ResizablePanel';
import { DuplicateIcon, SearchIcon } from './icons';
import { copyToClipBoard } from './utils/copyToClipBoard';

const App: Component = () => {
  const { reqList } = useReqCtx();
  const [currentReq, setCurrentReq] = createSignal<number | null>(null);
  const [searchVal, setSearchVal] = createSignal('');

  const diaplayList = createMemo(() => {
    if (!searchVal) return reqList();
    return reqList().filter((it) =>
      it.request.operationName
        .toLowerCase()
        .includes(searchVal().toLowerCase()),
    );
  });
  const Tab = ({ data }: { data: any }) => {
    const json = JSON.stringify(data, null, 2);
    return (
      <>
        <div class={style.jsonView}>
          <JsonView json={json} name="variables" />
        </div>
        <ResizablePanel
          handleName="RAW"
          containerClassName={style.rawJsonContainer}
          className={style.rawJsonContent}
          side="top"
          defaultPlacement="80%"
        >
          <div class={style.toolbar}>
            <DuplicateIcon
              class={style.DuplicateIcon}
              onClick={() => copyToClipBoard(json)}
            />
          </div>
          <pre>{json}</pre>
        </ResizablePanel>
      </>
    );
  };
  const tabs = createMemo(() => {
    if (currentReq() === null) return [];
    const { request, response } = reqList()[currentReq()!];
    return [
      {
        title: 'Request',
        content: () => <Tab data={request.variables} />,
      },
      {
        title: 'Response',
        content: () => <Tab data={response} />,
      },
    ];
  });
  return (
    <div class={style.container}>
      <div class={style.header}>
        <SearchIcon />
        <input
          type="text"
          value={searchVal()}
          onInput={(e) => setSearchVal(e.currentTarget.value)}
        />
      </div>
      <div class={style.requestList}>
        <Index each={diaplayList()}>
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
