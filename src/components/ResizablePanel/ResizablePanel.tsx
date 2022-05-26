import { ParentComponent, onMount } from 'solid-js';
import style from './ResizablePanel.module.scss';

export interface ResizablePanelProps {
  /** which side to adjust? */
  side: 'left' | 'top';
  defaultPlacement: string;
  handleMargin?: number;
  containerClassName?: string;
  className?: string;
  handleName: string;
}

const ResizablePanel: ParentComponent<ResizablePanelProps> = ({
  children,
  side,
  defaultPlacement,
  handleMargin = 5,
  containerClassName,
  className,
  handleName,
}) => {
  let containerRef: HTMLDivElement;
  onMount(() => {
    if (!containerRef || !containerRef.parentElement) return;
    const parent = containerRef.parentElement;
    if (
      parent.style.position !== 'relative' &&
      parent.style.position !== 'absolute'
    )
      parent.style.position = 'relative';
    let isMouseDown = false;
    let isAdjusting = false;
    parent.addEventListener('mousemove', (e) => {
      const panelPos = containerRef.getBoundingClientRect()[side];
      const parentPos = parent.getBoundingClientRect()[side];
      const mousePos = side === 'top' ? e.clientY : e.clientX;
      if (
        isAdjusting ||
        (mousePos > panelPos - handleMargin &&
          mousePos < panelPos + handleMargin)
      ) {
        parent.style.cursor = side === 'left' ? 'col-resize' : 'row-resize';
        if (isMouseDown) {
          isAdjusting = true;
          containerRef.style[side] = mousePos - parentPos + 'px';
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
    <div
      class={`${style.container} ${containerClassName} ${style[side]}`}
      style={{
        [side]: defaultPlacement,
      }}
      ref={(el) => (containerRef = el)}
    >
      <div class={style.handle}>{handleName}</div>
      <div class={`${style.content} ${className}`}>{children}</div>
    </div>
  );
};

export default ResizablePanel;
