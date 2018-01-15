
"""Various text utilities can be found here.
"""


def _strip_string(sentence):
    """Strip all non-alpha characters from string and convert to all lower-case.

    Arguments:
        sentence {string} -- Sentence to strip.

    Returns:
        string -- String with non-alpha stripped and lowercased
    """

    output = ''
    for cur_char in sentence:
        # print('character {}'.format(cur_char))
        if cur_char.isalpha():
            output += cur_char.lower()
    return output

def is_palindrome(sentence):
    """Determine if sentence (string) is a palindrome.

    Arguments:
        sentence {string} -- Sentence to test for palindrome

    Returns:
        bool -- True if string is a palindrome, False otherwise.
    """

    strip_sentence = _strip_string(sentence)
    sentence_len = len(strip_sentence)

    for i in range(0, int(sentence_len / 2)):
        # print('index {} char {} - {}'.format(i, strip_sentence[i], \
        #     strip_sentence[sentence_len - i - 1]))
        if strip_sentence[i] != strip_sentence[sentence_len - i - 1]:
            return False
    return True

if __name__ == "__main__":
    pass
