const formatUpdateParmas = (request) => {
  const params = request.columns;
  return Object.keys(params).map((key) => {
    return params[key];
  });
};

const formatUpdateQuery = (request) => {
  const { table, columns, uniqueIdentifier, uniqueValue } = request;
  const query = [`UPDATE ${table} SET`];

  const values = [];

  Object.keys(columns).forEach((key, i) => {
    values.push(`${key} = $${i + 1}`);
  });

  query.push(values.join(", "));
  // TODO: Remap this, potential for bad value to pass in
  query.push(`WHERE ${uniqueIdentifier} = '${uniqueValue}'`);

  return query.join(" ");
};

module.exports.createDbQuery = (request) => {
  return new Promise((resolve, reject) => {
    const response = {
      params: formatUpdateParmas(request),
      query: formatUpdateQuery(request),
    };

    resolve(response);
  });
};
