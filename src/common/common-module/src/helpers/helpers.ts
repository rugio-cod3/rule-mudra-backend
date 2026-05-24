
export const isObjEmpty = (obj: object): boolean => {
    for (const key in obj) {
        if (key in obj) {
            return false;
        }
    }
    return true;
}
