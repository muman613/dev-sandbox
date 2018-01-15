#!/usr/bin/env python3
"""Script to determine if a string is a palindrome
"""

import sys
from textutils import is_palindrome

def main():
    """Get arguments from commandline and perform palindrome test.
    """

    arg_count = len(sys.argv)

    if arg_count != 2:
        sys.stderr.write('{} \'Sentence to test\'\n'.format(sys.argv[0]))
        sys.exit(-1)

    # Get the string from the commandline argument...
    input_sentence = sys.argv[1]

    # Check if the string is a palindrome.
    if is_palindrome(input_sentence):
        print('This is a palindrome!')
    else:
        print('This is not a palindrome')

if __name__ == "__main__":
    main()
