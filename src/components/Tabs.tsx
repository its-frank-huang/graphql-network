import { createSignal, Index, Show, Accessor, JSX, onMount } from 'solid-js';
import style from './Tabs.module.scss';

export const Tabs = ({
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
  let containerRef: HTMLDivElement;
  onMount(() => {
    console.log(containerRef, containerRef?.parentElement);
    if (!containerRef || !containerRef.parentElement) return;
    const parent = containerRef.parentElement;
    let isMouseDown = false;
    let isAdjusting = false;
    parent.addEventListener('mousemove', (e) => {
      const panelLeft = containerRef.getBoundingClientRect().left;
      if (
        isAdjusting ||
        (e.clientX > panelLeft - 5 && e.clientX < panelLeft + 5)
      ) {
        parent.style.cursor = 'ew-resize';
        if (isMouseDown) {
          isAdjusting = true;
          containerRef.style.left = e.clientX + 'px';
        } else {
          isAdjusting = false;
        }
      } else {
        parent.style.cursor = 'unset';
      }
    });

    parent.addEventListener('mousedown', (e) => {
      isMouseDown = true;
    });
    parent.addEventListener('mouseup', (e) => {
      isMouseDown = false;
    });
  });
  return (
    <div class={style.container} ref={(el) => (containerRef = el)}>
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
          width={16}
          height={16}
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
    </div>
  );
};
