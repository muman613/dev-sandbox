/**
 * palindrome.cpp
 * January 12, 2018
 * Michael A. Uman
 */

//#define DEEP_DEBUG

#include <iostream>
#include <string>
#include <ctype.h>

using namespace std;

/**
 * Remove all non-alpha characters from string and convert to lower-case.
 */
#ifdef FIRST_IMPLEMENTATION
bool stripString(string& str) {
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
bool stripString(string& str) {
    size_t strLen = str.length();

    for (int i = 0 ; i < strLen ; ) {
#ifdef DEEP_DEBUG
        cout << ">> " << str[i] << endl;
#endif // DEEP_DEBUG

        if (!isalpha(str[i])) {
            str.erase(i, 1);
            --strLen;
        } else {
            str[i] = tolower(str[i]);
            i++;
        }
    }

    return true;
}
#endif

/**
 *  isPalindrome() checks if the string passed is a palindrome.
 */

bool isPalindrome(const string sentence) {
    if (sentence.length() == 0) {
        // User passed a null string, not a palindrome...
        return false;
    }

    // Strip the sentence of spaces and punctuation.
    string copyOfSentence = sentence;
    stripString(copyOfSentence);

    size_t strLen = copyOfSentence.length();

    for (int i = 0 ; i < (strLen / 2) ; i++) {
        // If these characters are not identical then it is not a palindrome...
        if (copyOfSentence[i] != copyOfSentence[strLen - i - 1])
            return false;
    }

    return true;
}

/**
 * Main entry point of program...
 */

int main(int argc, const char* argv[]) {
    string input;

    if (argc != 2) {
        cerr << argv[0] << " \"Is this a palindrome\"" << endl;
        return -1;
    }

    input = argv[1];

    cout << "Input string : \"" << input << "\"" << endl;

    if (isPalindrome(input)) {
        cout << "This is a palindrome!" << endl;
    } else {
        cout << "This is not a palindrome..." << endl;
    }

    return 0;
}


/**
Sore was I ere I saw Eros.
A man, a plan, a canal -- Panama
Never a foot too far, even.
Euston saw I was not Sue.
Live on evasions? No, I save no evil.
Red Roses run no risk, sir, on nurses order.
Salisbury moor, sir, is roomy. Rub Silas.
Marge, let's "went." I await news telegram.
A new order began, a more Roman age bred Rowena.
I, man, am regal; a German am I.
Tracy, no panic in a pony-cart.
Egad! Loretta has Adams as mad as a hatter. Old age!
Eve, mad Adam, Eve!
Resume so pacific a pose, muser.
Marge let a moody baby doom a telegram.
Tenet C is a basis, a basic tenet.
Nella's simple hymn: "I attain my help, Miss Allen."
Straw? No, too stupid a fad. I put soot on warts.
Sir, I demand, I am a maid named Iris.
Lay a wallaby baby ball away, Al.
Tessa's in Italy, Latin is asset.
Noel sees Leon.
No, it can assess an action.
Bob: "Did Anna peep?" Anna: "Did Bob?"
Sex at noon taxes.
 */