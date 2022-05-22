import type { Component } from 'solid-js';
import { useReqCtx } from './store/context';

const App: Component = () => {
  const { reqList } = useReqCtx();
  return (
    <div>
      {reqList().map((req) => {
        console.log(
          'request',
          req,
          req.getContent((content) => {
            console.log(content);
          }),
        );
        return <div>{req.request.url}</div>;
      })}
    </div>
  );
};

export default App;
