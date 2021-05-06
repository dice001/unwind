// Polyfill for Array.find to work in IE11 weights too much, we can just use filter and take first value
const find = (array, exp, defaultValue) => array.filter(exp)[0] || defaultValue

module.exports = {
    find
}