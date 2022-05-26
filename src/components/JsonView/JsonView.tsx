import jsonview from '@pgrabovets/json-view';
import { onMount } from 'solid-js';
import style from './JsonView.module.scss';

export interface JsonViewProps {
  json: string;
  name: string;
}

const JsonView = ({ json, name }: JsonViewProps) => {
  let divRef: HTMLDivElement;
  onMount(() => {
    const tree = jsonview.create(json);
    jsonview.render(tree, divRef);
    // Expand the first level of the tree by default and change the top level field name to {name}
    tree.el.querySelector('.json-key').innerText = name;
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
      // When there are no children, show '{0}' instead of '[Object Object]'
      tree.el.querySelector('.json-value').innerText = '{0}';
    }
  });
  return <div class={style.JsonView} ref={(el) => (divRef = el)} />;
};

export default JsonView;
