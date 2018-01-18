#ifndef WORDCOLLECTION_H
#define WORDCOLLECTION_H

#include "sort_types.h"

//#define VERBOSE         1


/**
 *  word collection class
 */

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

#endif /* WORDCOLLECTION_H */
