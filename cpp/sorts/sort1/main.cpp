/**
 * @module          main.cpp
 * @project         Sort1
 * @author          Michael A. Uman
 * @date            January 17, 2018
 */

//#define DUMP_TREE           1       // enable to dump tree to console...
//#define DISPLAY_UNSORTED  1       // Display the unsorted list...
//#define GET_NODEVEC         1

#include <iostream>
#include <string>
#include <vector>
#include <fstream>

#include "wordcollection.h"
#include "btree.h"

using namespace std;

using stringBtree       = bTree<string, int>;
using stringBtreeNode   = stringBtree::bNodePtr;

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
        ofstream ofs;

        ofs.open("/tmp/sortedlist.txt");
        if (ofs.is_open()) {
            binaryTree.dumpOrdered(ofs);
            ofs.close();
        }
#endif  // DUMP_TREE

#ifdef GET_NODEVEC
        vector<stringBtreeNode>      orderVec;

        binaryTree.getOrderedNodeVector(orderVec /* , traversalOrder::TRAVERSE_INORDER */);

        for (auto node : orderVec) {
            cout << ">>" << node->Key() << endl;
        }
#endif  // GET_NODEVEC

        int fooManchu = 1;

        /* Using C++11 Lambda function here! */
        binaryTree.forEachNode([&](stringBtreeNode pNode) {
            cout << " record " << fooManchu++ << " : " << pNode->Key() << endl;
        }, traversalOrder::TRAVERSE_INORDER);
    }

    /* code */
    return 0;
}
