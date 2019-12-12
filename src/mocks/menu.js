const menuItems = [
  {
    title: `Table`,
    isActive: true,
  },
  {
    title: `Stats`,
    isActive: false,
  }];

const getMenuItems = () => menuItems.slice();

export {getMenuItems};
