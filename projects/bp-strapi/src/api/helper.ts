const singular = key => {
  if (key[key.length - 1] !== 's') {
    return key;
  }
  return key.slice(0, -1);
};

const plural = key => {
  if (key[key.length - 1] === 's') {
    return key;
  }
  return key + 's';
};

const DATABASE_SCHEMA = process.env.DATABASE_SCHEMA;

const table = name => {
  return DATABASE_SCHEMA + '.' + name;
};

module.exports = {
  singular,
  plural,
  table,
};
