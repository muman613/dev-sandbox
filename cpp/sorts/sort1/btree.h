/**
 * @module      btree.h
 * @project     sort1
 * @author      Michael A. Uman
 * @date        January 17, 2018
 * @purpose     This module contains the Binary Tree template classes.
 */

#ifndef BTREE_H
#define BTREE_H

//#include "sort_types.h"

template<class K, class V> class bTree;

template<class K, class V>
    class bNode {
        public:
            bNode(K key, V* value = nullptr) {
                m_key   = key;
                m_value = value;
                m_left  = m_right = nullptr;
            }
            virtual ~bNode() {
                //std::cout << "deleting node!" << std::endl;
            }

            /* Key accessor */
            K Key() {
                return m_key;
            }

            /* Value accessor */
            V* Value() {
                return m_value;
            }

        protected:
            friend class bTree<K,V>;    // Allow the bTree to modify the node.

            K       m_key;
            V*      m_value = nullptr;
            bNode*  m_left  = nullptr;
            bNode*  m_right = nullptr;
    };

template<class K, class V>
    class bTree {
        public:

            typedef bNode<K,V>* pNodePtr;
            typedef void (*functionPtr)(pNodePtr);

            bTree() {}
            virtual ~bTree() {
                deleteAllNodes();
            }

            void insert(K key, V* value) {
                insert(m_rootNode, key, value);
                return;
            }

            void dumpOrdered(std::ostream& os) {
                os << "Ordered list:" << std::endl;
                if (m_rootNode != nullptr) {
                    traverseTree(m_rootNode, os);
                }
            }

            void getOrderedNodeVector(std::vector<bNode<K,V>*>& nodeVec) {
                nodeVec.clear();

                if (m_rootNode != nullptr) {
                    traverseTree(m_rootNode, nodeVec);
                }

                return;
            }

            void forEachNode(functionPtr cb) {
                if (m_rootNode != nullptr) {
                    forEachNode(m_rootNode, cb);
                }
            }

            /* Free all dynamically allocated nodes... */
            void deleteAllNodes() {
                if (m_rootNode != nullptr) {
                    forEachNode([](bTree<K,V>::pNodePtr pNode) {
                        delete pNode;
                    });

                    m_rootNode = nullptr;
                }
            }

        protected:
            void insert(bNode<K,V>* pNode, K key, V* value) {
                if (pNode == nullptr) {
                    // std::cout << "allocating root node!" << std::endl;
                    m_rootNode = new bNode<K,V>(key, value);
                } else if ( key < pNode->m_key ) {
                    if (pNode->m_left != nullptr) {
                        insert(pNode->m_left, key, value);
                    } else {
                        pNode->m_left = new bNode<K,V>(key, value);
                    }
                } else if ( key > pNode->m_key ) {
                    if (pNode->m_right != nullptr) {
                        insert(pNode->m_right, key, value);
                    } else {
                        pNode->m_right = new bNode<K,V>(key, value);
                    }
                } else {
                    std::cout << "Not handling duplicate keys!" << std::endl;
                }
            }

            void traverseTree(bNode<K,V>* pNode, std::ostream& os) {
                if (pNode->m_left == nullptr) {
                    std::cout << "-- [" << pNode->m_key << "]" << std::endl;
                    if (pNode->m_right != nullptr)
                        traverseTree(pNode->m_right, os);
                } else {
                    traverseTree(pNode->m_left, os);
                    std::cout << "-- [" << pNode->m_key << "]" << std::endl;
                    if (pNode->m_right != nullptr)
                        traverseTree(pNode->m_right, os);
                }
            }

            void traverseTree(bNode<K,V>* pNode, std::vector<bNode<K,V>*>& nodeVec) {
                if (pNode->m_left == nullptr) {
                    nodeVec.push_back(pNode);
                    if (pNode->m_right != nullptr)
                        traverseTree(pNode->m_right, nodeVec);
                } else {
                    traverseTree(pNode->m_left, nodeVec);
                    nodeVec.push_back(pNode);
                    if (pNode->m_right != nullptr)
                        traverseTree(pNode->m_right, nodeVec);
                }
            }

            void forEachNode(bNode<K,V>* pNode, functionPtr cb) {
                if (pNode->m_left == nullptr) {
                    (*cb)(pNode);
                    if (pNode->m_right != nullptr)
                        forEachNode(pNode->m_right, cb);
                } else {
                    forEachNode(pNode->m_left, cb);
                    (*cb)(pNode);
                    if (pNode->m_right != nullptr)
                        forEachNode(pNode->m_right, cb);
                }
            }

            bNode<K, V>*  m_rootNode = nullptr;
    };

#endif /* BTREE_H */
