/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import App from './App';
import { ReqCtxProvider } from './store/context';

chrome.devtools.panels.create(
  'Graphql Network',
  '',
  'dist/index.html',
  function (panel) {},
);

render(
  () => (
    <ReqCtxProvider>
      <App />
    </ReqCtxProvider>
  ),
  document.getElementById('root') as HTMLElement,
);
