#!/usr/bin/env python3

import os
import argparse

def find_files_in_dir(dir, ext=None, sort=True):
    """Find files in specified directory, can find only files with extensions...

    Arguments:
        dir {string} -- Directory to scan
        ext {list} -- Optional list of file extensions (w/ period)
        sort {bool} -- True to sort list
    """

    fileList = []   # create an empty list

    for root, dirs, files in os.walk(dir):
        for filename in files:
            full_name = os.path.join(root, filename)
            if ext is None:
                fileList.append(full_name)
            else:
                this_ext = os.path.splitext(filename)[1]
                if this_ext in ext:
                    fileList.append(full_name)

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
    search_ext = None

    parser = argparse.ArgumentParser(description='Scan a directory for files')
    parser.add_argument('path')
    parser.add_argument('--ext', type=str)

    args = parser.parse_args()

    # print(args)

    if args.ext:
        # print("User specified extensions")
        search_ext = [ str(item) for item in args.ext.split(',') ]

    sourcedir = args.path
    # print(searchExt)

    file_list = find_files_in_dir(sourcedir, search_ext )
    # txtFiles.sort()

    for file_name in file_list:
        print("Processing file {}...".format(file_name))

if __name__ == '__main__':
    main()
