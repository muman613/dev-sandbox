/**
* @module	palindrome.cpp
* @date		January 14, 2018
* @author	Michael A. Uman
*/

#include "stdafx.h"
#include <iostream>
#include <string>
#include "palindrome.h"

using namespace std;

static bool stripString(string& str);

/**
 * Remove all non-alpha characters from string and convert to lower-case.
 */
#ifdef FIRST_IMPLEMENTATION
static bool stripString(string& str) {
    string newStr;

    for (auto c : str) {
        if (isalpha(c))
            newStr += tolower(c);
    }

    str.swap(newStr);

    return true;
}
#else
// New implementation modifies the string 'in-place' rather than copying...
static bool stripString(string& str) {
    size_t strLen = str.length();

    for (size_t i = 0 ; i < strLen ; ) {
#ifdef DEEP_DEBUG
        cout << ">> " << str[i] << endl;
#endif // DEEP_DEBUG

        if (!isalpha(str[i])) {
            str.erase(i, 1);
            --strLen;
        } else {
            str[i] = static_cast<char>(tolower(str[i]));
            i++;
        }
    }

    return true;
}
#endif

/**
 *  isPalindrome() checks if the string passed is a palindrome.
 */

bool isPalindrome(const string& sentence) {
    if (sentence.length() == 0) {
        // User passed a null string, not a palindrome...
        return false;
    }

    // Strip the sentence of spaces and punctuation.
    string copyOfSentence = sentence;
    stripString(copyOfSentence);

    size_t strLen = copyOfSentence.length();

    for (size_t i = 0 ; i < (strLen / 2) ; i++) {
        // If these characters are not identical then it is not a palindrome...
        if (copyOfSentence[i] != copyOfSentence[strLen - i - 1])
            return false;
    }

    return true;
}
