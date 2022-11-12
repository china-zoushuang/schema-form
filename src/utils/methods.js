import { getWorker } from "@/workers";

export const generateModel = (schema) => {
  const worker = getWorker();
  return new Promise((resolve, reject) => {
    worker
      .start("generateModelSchema", schema)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const generateUI = (schema) => {
  const worker = getWorker();
  return new Promise((resolve, reject) => {
    worker
      .start("generateUISchema", schema)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
