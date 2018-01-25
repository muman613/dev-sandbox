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

#include <assert.h>
#include <functional>
#include <memory>

template<class K, class V> class bTree;

/**
 * Template class for the b-tree node.
 */

template<class K, class V>
    class bNode {
        public:
            bNode(K key, V* value = nullptr) {
                m_key   = key;
                //m_value = value;
                m_value.reset(value);
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
                return m_value.get();
            }

            void Value(V* set) {
                m_value.reset(set);
            }

        protected:
            friend class bTree<K,V>;    // Allow the bTree to modify the node.

            K                   m_key;
            std::shared_ptr<V>  m_value;
            bNode*              m_left  = nullptr;
            bNode*              m_right = nullptr;
    };

enum class traversalOrder {
    TRAVERSE_PREORDER,
    TRAVERSE_INORDER,
    TRAVERSE_POSTORDER,
};

/**
 * Template class for the binary tree.
 */

template<class K, class V>
    class bTree {
        public:

            using bNodePtr      = bNode<K,V>*;
            using functionPtr   = std::function<void (bNodePtr)>;

            bTree() {
                // ctor
            }
            virtual ~bTree() {
                deleteAllNodes();
            }

            void insert(K key, V* value) {
                insert(m_rootNode, key, value);
                return;
            }

            /**
             * print each key value to the output stream.
             */
            void dumpOrdered(std::ostream& os, traversalOrder order = traversalOrder::TRAVERSE_INORDER) {
                if (m_rootNode != nullptr) {
                    forEachNode([&](bNodePtr pNode) {
                        os << pNode->m_key << std::endl;
                    }, order);
                }
            }

            void getOrderedNodeVector(std::vector<bNodePtr>& nodeVec, traversalOrder order = traversalOrder::TRAVERSE_INORDER) {
                nodeVec.clear();

                if (m_rootNode != nullptr) {
                    forEachNode([&](bNodePtr pNode) {
                        nodeVec.push_back(pNode);
                    }, order);
                }

                return;
            }

            /**
             * Traverse through b-tree using pre-order, in-order, or post-order traversal.
             */
            void forEachNode(functionPtr cb, traversalOrder order = traversalOrder::TRAVERSE_INORDER) {
                if (m_rootNode != nullptr) {
                    switch (order) {
                    case traversalOrder::TRAVERSE_INORDER:
                        forEachNodeInOrder(m_rootNode, cb);
                        break;
                    case traversalOrder::TRAVERSE_POSTORDER:
                        forEachNodePostOrder(m_rootNode, cb);
                        break;
                    case traversalOrder::TRAVERSE_PREORDER:
                        forEachNodePreOrder(m_rootNode, cb);
                        break;
                    }
                }
            }

            /* Free all dynamically allocated nodes... */
            void deleteAllNodes() {
                if (m_rootNode != nullptr) {
                    forEachNode([](bTree<K,V>::bNodePtr pNode) {
                        delete pNode;
                    }, traversalOrder::TRAVERSE_POSTORDER);

                    m_rootNode = nullptr;
                }
            }

        protected:
            void insert(bNodePtr pNode, K key, V* value) {
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

            void forEachNodeInOrder(bNodePtr pNode, functionPtr cb) {
                assert(pNode != nullptr);
                if (pNode->m_left != nullptr)
                    forEachNodeInOrder(pNode->m_left, cb);
                cb(pNode);
                if (pNode->m_right != nullptr)
                    forEachNodeInOrder(pNode->m_right, cb);
            }

            void forEachNodePreOrder(bNodePtr pNode, functionPtr cb) {
                assert(pNode != nullptr);
                cb(pNode);
                if (pNode->m_left != nullptr)
                    forEachNodePreOrder(pNode->m_left, cb);
                if (pNode->m_right != nullptr)
                    forEachNodePreOrder(pNode->m_right, cb);
            }

            void forEachNodePostOrder(bNodePtr pNode, functionPtr cb) {
                assert(pNode != nullptr);
                if (pNode->m_left != nullptr)
                    forEachNodePostOrder(pNode->m_left, cb);
                if (pNode->m_right != nullptr)
                    forEachNodePostOrder(pNode->m_right, cb);
                cb(pNode);
            }

            bNodePtr  m_rootNode = nullptr;
    };

#endif /* BTREE_H */
