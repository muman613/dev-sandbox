/**
 * @module          main.cpp
 * @project         Sort1
 * @author          Michael A. Uman
 * @date            January 17, 2018
 */

//#define DUMP_TREE         1       // enable to dump tree to console...
//#define DISPLAY_UNSORTED  1       // Display the unsorted list...
#include <iostream>
#include <string>
#include <vector>
#include <fstream>

#include "wordcollection.h"
#include "btree.h"

using namespace std;

using stringBtree       = bTree<string, int>;
using stringBtreeNode   = stringBtree::pNodePtr;

/**
 *
 */

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

#ifdef  DISPLAY_UNSORTED
        cout << "Unsorted list (" << wordList.size() << " words) :" << endl;

        for (auto word : wordList) {
            cout << "word " << n << " = " << word << endl;
            ++n;
        }
#endif  // DISPLAY_UNSORTED

        stringBtree binaryTree;

        for (auto word : wordList) {
            binaryTree.insert(word, nullptr);
        }

        cout << "insertion complete" << endl;

#ifdef DUMP_TREE
        binaryTree.dumpOrdered(cout);
#endif  // DUMP_TREE

#ifdef GET_NODEVEC
        vector<bNode<string, int>*>      orderVec;

        binaryTree.getOrderedNodeVector(orderVec);

        for (auto node : orderVec) {
            cout << ">>" << node->Key() << endl;
        }
#endif  // GET_NODEVEC

        /* Using C++11 Lambda function here! */
        binaryTree.forEachNode([](stringBtreeNode pNode) {
            cout << " " << pNode->Key() << endl;
        });
    }

    /* code */
    return 0;
}
