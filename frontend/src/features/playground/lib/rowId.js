let counter = 0;

/** A unique key for a product row in the form (only used to tell rows apart while editing). */
export const newRowId = () => {
  counter += 1;

  return `row-${counter}`;
};
