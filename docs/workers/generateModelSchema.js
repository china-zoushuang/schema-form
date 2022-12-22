const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const generate = (fields) => {
  return fields.reduce((combine, obj) => {
    for (const key in obj) {
      let value;
      const {
        type,
        default: defaultValue,
        auto,
        uuid,
        timestamp,
        reference,
        fields,
      } = obj[key];
      switch (type) {
        case "string":
          value = defaultValue || "";
          if (auto) {
            if (uuid) {
              value = generateUUID();
            }
          }
          break;
        case "integer":
          value = defaultValue || null;
          if (timestamp && auto) {
            value = Date.now();
          }
          break;
        case "boolean":
          value = defaultValue || false;
          break;
        case "array":
        case "set":
        case "map":
          value = defaultValue || new Array();
          break;
        // case "set":
        //   value = defaultValue || new Set();
        //   break;
        // case "map":
        //   value = defaultValue || new Map();
        //   break;
        case "foreign":
          value = reference;
          break;
        case "record":
          value = generate(fields);
          break;
        default:
          break;
      }
      obj[key] = value;
    }
    return { ...combine, ...obj };
  }, {});
};

onmessage = (payload) => {
  const { fields = [] } = JSON.parse(payload.data);

  const data = generate(fields);

  postMessage(data);
};
