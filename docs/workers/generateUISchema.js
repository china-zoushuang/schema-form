const generate = (fields) => {
  return fields.reduce((combine, obj) => {
    for (const key in obj) {
      let value = {};
      const {
        type,
        auto,
        between,
        required,
        one_of,
        match,
        match_any,
        match_all,
        match_none,
        reference,
        timestamp,
        keys,
        values,
        elements,
        fields,
      } = obj[key];

      value.type = type;

      value["ui:auto"] = auto;
      value["ui:min"] = between?.[0];
      value["ui:max"] = between?.[1];
      value["ui:enum"] = one_of?.map((item) => ({
        label: item,
        value: item,
      }));

      value["ui:rules"] = [];

      if (required && key !== "elements") {
        value["ui:rules"].push({
          required,
          message: `${key} is required`,
        });
      }

      if (match) {
        value["ui:rules"].push({
          pattern: `/${match}/`,
          message: `match /${match}/ error`,
        });
      }

      if (match_any) {
        value["ui:rules"].push({
          pattern: `/[${match_any.patterns.join("|")}]/`,
          message: match_any.err,
        });
      }

      if (match_all) {
        value["ui:rules"].push(
          ...match_all.map((item) => ({
            pattern: `/${item.pattern}/`,
            message: item.err,
          }))
        );
      }

      if (match_none) {
        value["ui:rules"].push(
          ...match_none.map((item) => ({
            pattern: item.pattern,
            message: item.err,
          }))
        );
      }

      switch (type) {
        case "string":
          if (one_of) {
            value["ui:widget"] = "a-select";
          } else {
            value["ui:widget"] = "a-input";
          }
          break;
        case "number":
        case "integer":
          if (timestamp) {
            value["ui:widget"] = "a-date-picker";
          } else if (one_of) {
            value["ui:widget"] = "a-select";
            value["ui:enum"] = one_of.map((item) => ({
              label: item,
              value: item,
            }));
          } else {
            value["ui:widget"] = "a-input-number";
          }
          break;
        case "boolean":
          value["ui:widget"] = "a-switch";
          break;
        case "set":
        case "array":
          if (elements.one_of) {
            value["ui:widget"] = "a-select";
            value["ui:mode"] = "tags";
            value["ui:enum"] = elements.one_of.map((item) => ({
              label: item,
              value: item,
            }));
          } else if (elements.fields) {
            value["ui:fields"] = generate(elements.fields);
          } else {
            value["ui:widget"] = "EditableField";
            value["ui:elements"] = generate([
              {
                elements: obj[key].elements,
              },
            ]).elements;
          }
          break;
        case "map":
          value["ui:widget"] = "EditableField";
          value["ui:elements"] = generate([{ keys, values }]);
          break;
        case "foreign":
          value["ui:widget"] = "a-select";
          value["ui:enum"] = [
            {
              key: reference,
              label: reference,
            },
          ];
          break;
        case "record":
          value["ui:fields"] = generate(fields);
          break;
        default:
          break;
      }

      // remove the key which the value is an empty array
      if (!value["ui:rules"].length) {
        delete value["ui:rules"];
      }

      obj[key] = value;
    }
    return {
      ...combine,
      ...obj,
    };
  }, {});
};

onmessage = (payload) => {
  const { fields = [] } = JSON.parse(payload.data);

  const data = generate(fields);

  postMessage(data);
};
