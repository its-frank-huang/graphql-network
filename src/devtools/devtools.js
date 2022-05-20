chrome.devtools.panels.create(
  'My Panel',
  'MyPanelIcon.png',
  '/src/devtools/devtools.html',
  function (panel) {},
);

chrome.devtools.network.onRequestFinished.addListener(function (request) {
  console.log('request', request);
});
