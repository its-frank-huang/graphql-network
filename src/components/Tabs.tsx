import { createSignal, Component, Index, Switch, Match, Show } from 'solid-js';
import style from './Tabs.module.scss';

export const Tabs = ({
  tabs,
}: {
  tabs: {
    title: string;
    content: Component;
  }[];
}) => {
  const [currentTab, setCurrentTab] = createSignal(0);
  return (
    <div class={style.container}>
      <div class={style.tabs}>
        <Index each={tabs}>
          {(tab, i) => (
            <div class={style.tab} onclick={() => setCurrentTab(i)}>
              {tab().title}
            </div>
          )}
        </Index>
      </div>
      <div class={style.tabContent}>
        <Index each={tabs}>
          {(tab, i) => <Show when={i === currentTab()}>{tab().content}</Show>}
        </Index>
      </div>
    </div>
  );
};
