#!/usr/bin/python3
"""This module contains code to lookup ISBN numbers read from an input file
"""

import sys
import re
import json
import isbnlib
from colorama import Fore  # , Back, Style


def lookup_code(code):
    """Perform the look-up of the ISBN code using isbnlib functions

    Arguments:
        code {[type]} -- [description]
    """

    print("Looking up ISBN code {}".format(code))

    isbn_meta = isbnlib.meta(code)

#   print(json.dumps(isbn_meta, indent=4))

    return isbn_meta


def process_file(fileName):
    """Read lines from fileName and process the ISBN # returning a list of
       lines

    Arguments:
        fileName {[type]} -- [description]

    Returns:
        [type] -- [description]
    """

    codes = {}
    missing = 0

    lines = [line.rstrip('\n') for line in open(fileName)]

    for code in lines:
        m = re.match(r'([\w ]+):\s+(\d+)', code)
        if m:
            label, value = m.group(1, 2)     # get the label and value

            print("""Label : '{}' : Value '{}'""".format(label, value))
        else:
            isbn_meta = lookup_code(code)
            if isbn_meta:
                codes[code] = isbn_meta
            else:
                print(Fore.RED + "Warning :" + Fore.RESET + " Invalid ISBN #")
                missing += 1

    return codes, missing


def main():
    """Main entry point of this module
    """

    if len(sys.argv) == 2:
        codeFile = sys.argv[1]
        codes, missing = process_file(codeFile)

        print(json.dumps(codes, indent=4))

        print("WARNING: Encountered {} bad ISBN codes!".format(missing))
    else:
        print(Fore.RED + "Must specify input file name!" + Fore.RESET)


if __name__ == '__main__':
    main()
