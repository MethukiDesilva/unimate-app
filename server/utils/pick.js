// returns a copy of obj with only the listed fields
module.exports = (obj, fields) =>
  fields.reduce((result, field) => {
    if (obj[field] !== undefined) {
      result[field] = obj[field];
    }
    return result;
  }, {});