#!/usr/bin/env pythonw
"""Merge two sorted lists implemented in Python
   By Michael Uman
"""

def merge_list_inc(list1, list2):
    """Perform incremental merge
    
    Arguments:
        list1 {[type]} -- [description]
        list2 {[type]} -- [description]
    
    Returns:
        [type] -- [description]
    """

    _n1 = len(list1)
    _n2 = len(list2)
    list3 = [0] * (_n1 + _n2)
    i = j = k = 0

    while (i < _n1) and (j < _n2):
        if list1[i] < list2[j]:
            list3[k] = list1[i]
            k += 1
            i += 1
        else:
            list3[k] = list2[j]
            k += 1
            j += 1

    while (i < _n1):
        list3[k] = list1[i]
        k += 1
        i += 1

    while (j < _n2):
        list3[k] = list2[j]
        k += 1
        j += 1

    return list3

def merge_list_dec(list1, list2):
    """Perform decremental merge of lists
    
    Arguments:
        list1 {list of integers} -- [description]
        list2 {list of integers} -- [description]
    
    Returns:
        [list of integers] -- [description]
    """

    _n1 = len(list1)
    _n2 = len(list2)
    list3 = [0] * (_n1 + _n2)
    i = j = 0
    k = _n1 + _n2 - 1

    while (i < _n1) and (j < _n2):
        if list1[i] < list2[j]:
            list3[k] = list1[i]
            k -= 1
            i += 1
        else:
            list3[k] = list2[j]
            k -= 1
            j += 1

    while (i < _n1):
        list3[k] = list1[i]
        k -= 1
        i += 1

    while (j < _n2):
        list3[k] = list2[j]
        k -= 1
        j += 1

    return list3

def dump_list(msg, this_list):
    """Dump list to output with message
    
    Arguments:
        msg {string} -- Message to display before list
        this_list {list of integers} -- List to dump
    """

    print(msg)
    for n in this_list:
        print("{} ".format(n), end='')
    print("")

def main():
    list1 = [ 1, 3, 5, 7 ]
    list2 = [ 2, 4, 6, 8 ]
#   list3 = []

    dump_list("list 1", list1)
    dump_list("list 2", list2)
    dump_list("Incremental sort", merge_list_inc(list1, list2))
    dump_list("Decremental sort", merge_list_dec(list1, list2))

if __name__ == '__main__':
    main()

