/**
 *  Example implementation of mergeing two sorted integer vectors.
 */

#include <iostream>
#include <vector>

using namespace std;

typedef vector<int>                 intVec;
typedef vector<int>::const_iterator intVecIter;

// Merge arrays in decreasing order.

void mergeArraysDec(const intVec& arr1, const intVec& arr2, intVec& arr3)
{
    size_t  n1 = arr1.size(),
            n2 = arr2.size();
    size_t  i  = 0,
            j  = 0,
            k  = n1 + n2 - 1;
    
    arr3.resize(n1+n2);

    while ((i < n1) && (j < n2))
    {
        if (arr1[i] < arr2[j])
            arr3[k--] = arr1[i++];
        else
            arr3[k--] = arr2[j++];
    }

    while (i < n1)
        arr3[k--] = arr1[i++];
 
    while (j < n2)
        arr3[k--] = arr2[j++];
}

// Merge arrays in increasing order.

void mergeArraysInc(const intVec& arr1, const intVec& arr2, intVec& arr3)
{
    size_t  n1 = arr1.size(),
            n2 = arr2.size();
    size_t  i  = 0,
            j  = 0,
            k  = 0;
    
    arr3.resize(n1+n2);

    while ((i < n1) && (j < n2))
    {
        if (arr1[i] < arr2[j])
            arr3[k++] = arr1[i++];
        else
            arr3[k++] = arr2[j++];
    }

    while (i < n1)
        arr3[k++] = arr1[i++];
 
    while (j < n2)
        arr3[k++] = arr2[j++];
}

void displayArray(string sMsg, const intVec& vec) {
    cout << sMsg << endl;

    for (intVecIter it = vec.begin() ; it != vec.end() ; it++) {
        cout << *it << " ";    
    }
    cout << endl;
}

int main()
{
    intVec arr1 = { 1, 3, 5, 7 };
    intVec arr2 = { 2, 4, 6, 8, 10, 12 };
    intVec arr3;

    mergeArraysInc(arr1, arr2, arr3);
    displayArray("Array after merging increasing", arr3);
    mergeArraysDec(arr1, arr2, arr3);
    displayArray("Array after merging decreasing", arr3);
    
    return 0;
}