
export const getFixedLengthAddress = (address: string, len: number = 40) => {
    const arr = address.split(' ');
    let l = arr[0].length;
    let finalAddress = arr[0];
    arr.shift();
    for (const i of arr) {
      if (l + i.length <= len) {
        l += i.length;
        finalAddress += ' ' + i;
      }
    }
    return finalAddress;
  };
  