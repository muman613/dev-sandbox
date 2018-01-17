/**
 * @module          main.cpp
 * @project         Sort1
 * @author          Michael A. Uman
 * @date            January 17, 2018
 */

#define VERBOSE         1

#include <iostream>
#include <string>
#include <vector>
#include <fstream>

using namespace std;

using  StringList = std::vector<std::string>;

class wordCollection : public StringList {
    public:
        wordCollection();
        wordCollection(const std::string sInputFilename);
        wordCollection(std::ifstream& ifs);
        virtual ~wordCollection();

        bool Open(const std::string sInputFilename);
        bool addWord(const std::string sWord);

    protected:
        bool readListFromFile(std::ifstream& ifs);
};

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


int main(int argc, char const *argv[]) {
    string          sInputListName;
    wordCollection  wordList;

    if (argc != 2) {
        cerr << argv[0] << " [inputFileName]" << endl;
        return -10;
    }

    sInputListName = argv[1];

    cout << "Reading input file " << sInputListName << endl;
    if (wordList.Open(sInputListName)) {
        size_t n = 0;

        cout << "Unsorted list:" << endl;
        for (auto word : wordList) {
            cout << "word " << n << " = " << word << endl;
            ++n;
        }
    }
    /* code */
    return 0;
}
