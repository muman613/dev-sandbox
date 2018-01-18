#include <iostream>
#include <string>
#include <vector>
#include <fstream>

#include "wordcollection.h"

using namespace std;

wordCollection::wordCollection() {
    // ctor
}

/**
 *
 */

wordCollection::wordCollection(const string sInputFilename) {
    Open(sInputFilename);
}

wordCollection::wordCollection(ifstream& ifs) {
    if (ifs.is_open()) {
        readListFromFile(ifs);
    }
}

wordCollection::~wordCollection() {
    // dtor
}

/**
 *  Open word list file and read all words into container...
 */

bool wordCollection::Open(const string sInputFilename) {
    bool            bRes = false;
    ifstream        ifs;

    ifs.open(sInputFilename, ifstream::in);

    if (ifs.is_open()) {
        bRes = readListFromFile(ifs);
        ifs.close();
    } else {
        cerr << "ERROR: Unable to open " << sInputFilename << endl;
    }

    return bRes;
}

/**
 * Read a list of words from an input file stream...
 */

bool wordCollection::readListFromFile(ifstream& ifs) {
    bool bRes = false;
    string sWord;

    while (getline(ifs, sWord)) {
        if ((sWord[0] == '#') || (sWord.length() == 0))
            continue;
#ifdef VERBOSE
        cout << '[' << sWord << ']' << endl;
#endif  // VERBOSE
        push_back(sWord);
    }

    bRes = true;

#ifdef VERBOSE
    cout << "Found " << size() << " words in list file..." << endl;
#endif // VERBOSE

    return bRes;
}

bool wordCollection::addWord(string sWord) {
    push_back(sWord);
    return true;
}
