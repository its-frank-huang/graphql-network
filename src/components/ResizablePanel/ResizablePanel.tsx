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
const MouseLeaveMargin = 4;
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
    let isMouseInHandle = false;
    let isAdjusting = false;
    let mouseDownOffset = 0;
    parent.addEventListener('mousemove', (e) => {
      const parentPos = parent.getBoundingClientRect();
      const parentSize = parentPos[side === 'left' ? 'width' : 'height'];
      const parentOffset = parentPos[side];

      const divPos = containerRef.getBoundingClientRect();
      const divValue = divPos[side];
      const divSize = parentSize - divValue;

      const mousePos = side === 'top' ? e.clientY : e.clientX;
      const minDivValue = divValue - (MinDivSize - divSize);

      if (isAdjusting) {
        containerRef.style[side] =
          Math.max(
            0,
            Math.min(minDivValue, mousePos - parentOffset - mouseDownOffset),
          ) + 'px';
      }

      if (isMouseInHandle || isAdjusting) {
        parent.style.cursor = side === 'left' ? 'col-resize' : 'row-resize';
      } else {
        parent.style.cursor = 'unset';
      }
    });

    handleRef.addEventListener('mouseenter', () => (isMouseInHandle = true));
    handleRef.addEventListener('mouseleave', () => (isMouseInHandle = false));
    handleRef.addEventListener('mousedown', (e) => {
      mouseDownOffset =
        e[side === 'left' ? 'clientX' : 'clientY'] -
        containerRef.getBoundingClientRect()[side];
      isAdjusting = true;
    });
    document.addEventListener('mouseup', () => (isAdjusting = false));
    document.addEventListener('mousemove', (e) => {
      if (
        e.clientX <= MouseLeaveMargin ||
        e.clientX >= window.innerWidth - MouseLeaveMargin ||
        e.clientY <= MouseLeaveMargin ||
        e.clientY >= window.innerHeight - MouseLeaveMargin
      ) {
        isAdjusting = false;
      }
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
      <div class={style.handle} ref={(el) => (handleRef = el)}>
        {handleName}
      </div>
      <div class={`${style.content} ${className}`}>{children}</div>
    </div>
  );
};

export default ResizablePanel;
