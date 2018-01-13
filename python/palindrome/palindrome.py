#!/usr/bin/env python3

import sys

def strip_string(sentence):
    """Strip all non-alpha characters from string and convert to all lower-case.

    Arguments:
        sentence {string} -- Sentence to strip.

    Returns:
        string -- String with non-alpha stripped and lowercased
    """

    output = ''
    for ch in sentence:
        # print('character {}'.format(ch))
        if ch.isalpha():
            output += ch.lower()
    return output

def is_palindrome(sentence):
    strip_sentence = strip_string(sentence)
    sentence_len = len(strip_sentence)

    for i in range(0, int(sentence_len / 2)):
        print('index {} char {} - {}'.format(i, strip_sentence[i], strip_sentence[sentence_len - i - 1]))

    return False

def main():
    """Get arguments from commandline and perform palindrome test.
    """

    arg_count = len(sys.argv)

    if arg_count != 2:
        sys.stderr.write('{} \'Sentence to test\'\n'.format(sys.argv[0]))
        sys.exit(-1)

    input_sentence = sys.argv[1]

    if is_palindrome(input_sentence):
        print('This is a palindrome!')
    else:
        print('This is not a palindrome')

#    strip_sentence = strip_string(input_sentence)
#    print('Stripped sentence = \'{}\''.format(strip_sentence))

if __name__ == "__main__":
    main()