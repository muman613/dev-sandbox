/**
 * @module	main.cpp
 * @date	January 12, 2018
 * @author	Michael A. Uman
 */

//#define DEEP_DEBUG

#include "stdafx.h"
#include <iostream>
#include <string>
#include <ctype.h>
#include "palindrome.h"

using namespace std;


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
