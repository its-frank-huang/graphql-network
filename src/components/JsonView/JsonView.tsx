import { renderJsonView } from '@frank-tomato/jsonviewer';
import { onMount } from 'solid-js';
import style from './JsonView.module.scss';

export interface JsonViewProps {
  json: string;
  name: string;
}

const JsonView = ({ json, name }: JsonViewProps) => {
  let divRef: HTMLDivElement;
  onMount(() => {
    renderJsonView(divRef, {
      json,
    });
  });
  return <div class={style.JsonView} ref={(el) => (divRef = el)} />;
};

export default JsonView;
