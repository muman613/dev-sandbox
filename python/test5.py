#!/usr/bin/env python3

import os
import argparse

def findFilesInDir(dir, ext=None, sort=True):
    """Find files in specified directory, can find only files with extensions...

    Arguments:
        dir {string} -- Directory to scan
        ext {list} -- Optional list of file extensions (w/ period)
        sort {bool} -- True to sort list
    """

    fileList = []   # create an empty list

    for root, dirs, files in os.walk(dir):
        for file in files:
            if ext is None:
                fileList.append(file)
            else:
                thisExt = os.path.splitext(file)[1]
                if thisExt in ext:
                    fileList.append(os.path.join(root, file))

    if sort:
        fileList.sort();

    return fileList

#for root, dirs, files in os.walk(sourcedir):
#    print(type(files))
#    print(root)
#    print(len(dirs))
#    for file in files:
#        print(os.path.join(root, file))

def main():
    """Main entry point
    """
    sourcedir="/home/muman2/Documents"
    searchExt = None

    parser = argparse.ArgumentParser(description='Scan a directory for files')
    parser.add_argument('path')
    parser.add_argument('--ext', type=str)

    args = parser.parse_args()

    # print(args)

    if args.ext:
        # print("User specified extensions")
        searchExt = [ str(item) for item in args.ext.split(',') ]

    sourcedir = args.path
    # print(searchExt)

    txtFiles = findFilesInDir(sourcedir, searchExt )
    # txtFiles.sort()

    for file in txtFiles:
        print("Processing file {}...".format(file))

if __name__ == '__main__':
    main()
