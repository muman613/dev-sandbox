#!/usr/bin/env python3
"""Demonstration Python Script
"""

################################################################################
#   Simple Python Demonstration
################################################################################

import argparse


def greet(name):
    """Display greeting message

    Arguments:
        name {string} -- name to greet.
    """

    print("Hello {target}".format(target=name))

def leave(name):
    """Display parting message

    Arguments:
        name {string} -- name to leave.
    """

    print("Goodbye {target}".format(target=name))

def main():
    """[summary]
    """

    listener = "World"

    parser = argparse.ArgumentParser(description="Simple Python Demonstration")

    parser.add_argument('--name', help='Specify name')

    args = parser.parse_args()

    # print(args)

    if args.name:
        # print("Name is {}".format(args.name))
        listener = args.name
        # print(listener)

    greet(listener)
    leave(listener)

if __name__ == '__main__':
    main()
