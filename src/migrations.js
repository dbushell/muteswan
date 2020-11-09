// Latest redux persist version
const migrateVersion = 2;

const migrations = Object.create(null);

migrations[1] = (state) => {
  return {
    ...state,
    deletions: {}
  };
};

migrations[2] = (state) => {
  const newState = {
    ...state,
    memos: {...state.feathers}
  };
  delete newState.feathers;
  return newState;
};

export {migrations, migrateVersion};
