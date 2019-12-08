const filterItems = [
  {
    title: `everything`,
    isChecked: true,
  },
  {
    title: `future`,
    isChecked: false,
  },
  {
    title: `past`,
    isChecked: false,
  }];

const getFilterItems = () => filterItems.slice();

export {getFilterItems};
