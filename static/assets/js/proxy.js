let scramjetController;
let scramjetReady;

function getScramjetUrl(url) {
  if (!scramjetReady) {
    const { ScramjetController } = $scramjetLoadController();
    scramjetController = new ScramjetController({
      prefix: "/scramjet/",
      files: {
        wasm: "/assets/scramjet/scramjet.wasm.wasm",
        all: "/assets/scramjet/scramjet.all.js",
        sync: "/assets/scramjet/scramjet.sync.js",
      },
    });

    scramjetReady = navigator.serviceWorker
      .register("/scramjet-sw.js")
      .then(() => scramjetController.init())
      .then(async () => {
        const connection = new BareMux.BareMuxConnection(
          "/assets/baremux/worker.js",
        );
        const transport = "/assets/libcurl/index.mjs";
        const wispUrl = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/wisp/`;
        if ((await connection.getTransport()) !== transport) {
          await connection.setTransport(transport, [{ websocket: wispUrl }]);
        }
      });
  }

  return scramjetReady.then(() => `/scramjet/${scramjetController.encodeUrl(url)}`);
}
