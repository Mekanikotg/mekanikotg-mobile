
export default useCheckerFiled = (arr) => {
    let ct = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === "" || arr[i] === undefined || arr[i] === null) {
        ct += 1;
      }
    }
    return ct; // No empty or undefined values found
  };