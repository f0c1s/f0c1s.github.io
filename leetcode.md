<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>blog.f0c1s.com/leetcode</title>
<script src="setup.js" async></script>
<link rel="stylesheet" href="index.css" />
<link rel="stylesheet" href="highlight/styles/monokai.min.css"/>
<script src="highlight/highlight.min.js"></script>
</head>

<body onload="setup()">
<h1>/f0c1s/blog/leetcode</h1>

<p>
    <a href="index.html">blog</a>
    <a href="leetcode.html">+ leetcode</a>
</p>

## TOC

- Longest Palindromic Substring
- Three sum
- Two sum

## Longest Palindromic Substring

Given a string `s`, return the longest palindromic substring in `s`.

For example, `pap` and `apa` in `papad`.

```javascript

/**
 * isPalindrome: finds if input string is a palindrome. Has custom logic.
 * @param inputStr {string}
 * @return {boolean}
 */
function isPalindrome(inputStr) {
    if (inputStr.length === 0) {
        /* we need max of current string length and longest so far,
         * thus we return true even if it is an empty string.
         */
        return true;
    }
    if (inputStr.length === 1) {
        return true;
    }
    const len = inputStr.length;
    /**
     * we start from both ends, and walk inwards until we reach middle.
     */
    for (let front = 0, back = len - front - 1;
         front <= back;
         front++, back--) {
        if (inputStr[front] !== inputStr[back]) {
            return false;
        }
    }
    return true;
}

/**
 * longestPalindrome: find the string and length that of, which is the longest palindrome in given input string
 * @param inputStr {string}
 * @return {{str: string, len: number, index: number}}
 */
function longestPalindrome(inputStr) {
    if (isPalindrome(inputStr)) {
        return {str: inputStr, len: inputStr.length, index: inputStr.indexOf(inputStr)};
    }
    let longest = '';
    const len = inputStr.length;
    for (let outer = 0; outer < len; outer++) {
        for (let inner = len; inner >= outer; inner--) {
            const slicedStr = inputStr.slice(outer, inner);
            if (isPalindrome(slicedStr)) {
                if (longest.length < slicedStr.length) {
                    longest = slicedStr;
                }
            }
        }
    }
    return {str: longest, len: longest.length, index: inputStr.indexOf(longest)};
}

console.log(longestPalindrome("babad"));
console.log(longestPalindrome("babadabaddab"));
console.log(longestPalindrome("cbbd"));
console.log(longestPalindrome("babaddtattarrattatddetartrateedredividerb"));

/* output
{ str: 'bab', len: 3, index: 0 }
{ str: 'abadaba', len: 7, index: 1 }
{ str: 'bb', len: 2, index: 1 }
{ str: 'ddtattarrattatdd', len: 16, index: 4 }
 */

```

## Three sum

Given a sorted, non-decreasing, array of numbers and a `target` number, find indices(i, j, k) of three numbers such that `a[i] + a[j] + a[k] = target`.

```javascript
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
function sumOfThree(numbers, target) {
    for (let i = 0; i < numbers.length - 2; i++) {
        const leftIndex = i;
        const left = numbers[leftIndex];
        for (let j = i + 1; j < numbers.length - 1; j++) {
            const midIndex = j;
            const mid = numbers[midIndex];
            if (left + mid > target) {
                break;
            }
            for (let k = j + 1; k < numbers.length; k++) {
                const rightIndex = k;
                const right = numbers[rightIndex];
                if (left + mid + right === target) {
                    return [leftIndex, midIndex, rightIndex];
                }
            }
        }
    }
}

console.log(sumOfThree([1, 2, 3, 4, 5, 6], 15)); // [ 3, 4, 5 ]
console.log(sumOfThree([1, 2, 3, 4, 5, 6], 10)); // [ 0, 2, 5 ]

```

## Two sum

```javascript
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
function twoSum(numbers, target) {
    for (let i = 0; i < numbers.length - 1; i++) {
        const leftIndex = i;
        const left = numbers[leftIndex];
        for (let j = i + 1; j < numbers.length; j++) {
            const rightIndex = j;
            const right = numbers[rightIndex];
            if (left + right === target) {
                return [leftIndex, rightIndex];
            }
        }
    }
}
```

<script>hljs.highlightAll();</script>
</body>
</html>
