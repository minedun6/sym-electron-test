/**
 * @param {Array} array
 * @param {string} originalKey
 * @param {string} newKey
 * @returns {Array}
 */
export function changeKeyForArray(array, originalKey, newKey) {
    let newArr = [];
    for (let i = 0; i < array.length; i++) {
        let obj = array[i];
        obj[newKey] = obj[originalKey];
        delete (obj[originalKey]);
        newArr.push(obj);
    }
    return newArr;
}

/**
 * @param {Object} object
 * @param {string} originalKey
 * @param {string} newKey
 * @returns {Object}
 */
export function changeKeyForObject(object, originalKey, newKey) {
    object[newKey] = object[originalKey];

    delete (object[originalKey])

    return object;
}