import { createSignal, Index, Show, Accessor, JSX, onMount } from 'solid-js';
import ResizablePanel from '../ResizablePanel';
import style from './Tabs.module.scss';

const Tabs = ({
  tabs,
  onClose,
}: {
  tabs: Accessor<
    {
      title: string;
      content: () => JSX.Element;
    }[]
  >;
  onClose: () => void;
}) => {
  const [currentTab, setCurrentTab] = createSignal(0);
  return (
    <ResizablePanel
      className={style.container}
      handleName="DATA"
      side="left"
      defaultPlacement="30%"
    >
      <div class={style.header}>
        <div class={style.tabs}>
          <Index each={tabs()}>
            {(tab, i) => (
              <div
                class={`${style.tab} ${i === currentTab() ? style.active : ''}`}
                onclick={() => setCurrentTab(i)}
              >
                {tab().title}
              </div>
            )}
          </Index>
        </div>
        <svg
          width={14}
          height={14}
          viewBox="0 0 20 20"
          class={style.close}
          onClick={onClose}
          stroke="white"
        >
          <path d="M 3,3 L 17,17" />
          <path d="M 3,17 L 17,3" />
        </svg>
      </div>
      <div class={style.tabContent}>
        <Index each={tabs()}>
          {(tab, i) => <Show when={i === currentTab()}>{tab().content()}</Show>}
        </Index>
      </div>
    </ResizablePanel>
  );
};
export default Tabs;
