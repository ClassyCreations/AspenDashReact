export const loadState = () => {
  try{
    const serializedData = localStorage.getItem('aspenDash');
    if(serializedData === null){
      return undefined;
    }
    return JSON.parse(serializedData)
  }catch(err){
    return undefined;
  }
};

export const saveState = (appState) => {
  let state = {...appState};
  try{
    //State is saved as a string so it has to be stringified
    exclusions.forEach((item) => {
      state[item] = true;
    });
    console.log("Saving state: ",state);
    const serializedState = JSON.stringify(state);
    localStorage.setItem('aspenDash', serializedState)
  }catch(err){
    return undefined;
  }
};

const exclusions = [
  'header',
];
