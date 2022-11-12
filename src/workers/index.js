export const getWorker = () => {
  let worker;

  const start = (work, payload) => {
    return new Promise((resolve, reject) => {
      end();

      const path = `workers/${work}.js`;
      worker = new Worker(path);
      worker.postMessage(payload);
      worker.onmessage = ({ data, error }) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      };
    });
  };
  const end = () => {
    worker?.terminate && worker.terminate();
  };
  return {
    start,
    end,
  };
};
