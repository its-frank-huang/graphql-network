import { ParentComponent, onMount } from 'solid-js';
import style from './ResizablePanel.module.scss';

export interface ResizablePanelProps {
  /** which side to adjust? */
  side: 'left' | 'top';
  defaultPlacement: string;
  containerClassName?: string;
  className?: string;
  handleName: string;
}
const MinDivSize = 16;

const ResizablePanel: ParentComponent<ResizablePanelProps> = ({
  children,
  side,
  defaultPlacement,
  containerClassName,
  className,
  handleName,
}) => {
  let containerRef: HTMLDivElement;
  let handleRef: HTMLDivElement;
  onMount(() => {
    if (!containerRef || !containerRef.parentElement) return;
    const parent = containerRef.parentElement;
    if (
      parent.style.position !== 'relative' &&
      parent.style.position !== 'absolute'
    )
      parent.style.position = 'relative';
    parent.style.overflow = 'hidden';
    let isMouseDown = false;
    let isMouseIn = false;
    let isAdjusting = false;
    let status: 'expand' | 'between' | 'collapsed' = 'between';
    parent.addEventListener('mousemove', (e) => {
      const parentPos = parent.getBoundingClientRect();
      const parentSize = parentPos[side === 'left' ? 'width' : 'height'];
      const parentOffset = parentPos[side];

      const divPos = containerRef.getBoundingClientRect();
      const divValue = divPos[side];
      const divSize = parentSize - divValue;

      const mousePos = side === 'top' ? e.clientY : e.clientX;

      if (isAdjusting || isMouseIn) {
        parent.style.cursor = side === 'left' ? 'col-resize' : 'row-resize';
        if (isMouseDown) {
          isAdjusting = true;
          if (divSize < MinDivSize && status !== 'collapsed') {
            containerRef.style[side] = divValue - (MinDivSize - divSize) + 'px';
            isAdjusting = false;
            isMouseDown = false;
            status = 'collapsed';
          } else {
            status = 'between';
            containerRef.style[side] = mousePos - parentOffset + 'px';
          }
        } else {
          isAdjusting = false;
        }
      } else {
        parent.style.cursor = 'unset';
      }
    });

    handleRef.addEventListener('mouseenter', () => (isMouseIn = true));
    handleRef.addEventListener('mouseleave', () => (isMouseIn = false));
    parent.addEventListener('mousedown', () => (isMouseDown = true));
    parent.addEventListener('mouseup', () => (isMouseDown = false));
  });
  return (
    <div
      class={`${style.container} ${containerClassName} ${style[side]}`}
      style={{
        [side]: defaultPlacement,
      }}
      ref={(el) => (containerRef = el)}
    >
      <div class={style.handle} ref={(el) => (handleRef = el)}>
        {handleName}
      </div>
      <div class={`${style.content} ${className}`}>{children}</div>
    </div>
  );
};

export default ResizablePanel;
