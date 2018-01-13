#!/usr/bin/env python3

"""Demonstration Python Script
"""

import argparse
import timestring

class Customer:
    """Customer class
    """

    def __init__(self, name, bday):
        self._name = name
        self._birthday = timestring.Date(bday)
        print('Birthday = {}'.format(self._birthday.format("%m/%d/%y")))

    def greet(self):
        """Display greeting message
        """

        print("Hello {target}".format(target=self._name))

    def leave(self):
        """Display goodbye message
        """

        print("Goodbye {target}".format(target=self._name))

    def is_birthday(self):
        """Determine if today is their birthday.

        Returns:
            bool -- True if today is their birthday, False otherwise...
        """

        # print("Birthday is on {}/{}".format(self._birthday.month, self._birthday.day))
        ts = timestring.Date('today')
        if self._birthday.month == ts.month and self._birthday.day == ts.day:
            return True
        return False

    def age(self):
        """Return the age in years

        Returns:
            [type] -- [description]
        """

        diff = timestring.Range(self._birthday, timestring.Date('today'))
        return diff.elapse

def main():
    """[summary]
    """

    listener = "World"
    bday     = "Jan 1, 1975"

    # Parse commandline arguments
    parser = argparse.ArgumentParser(description="Simple Python Demonstration")
    parser.add_argument('--name', help='Specify name')
    parser.add_argument('--bday', help='Specify birthday')

    args = parser.parse_args()

    if args.name:
        listener = args.name

    if args.bday:
        bday = args.bday

    cust = Customer(listener, bday)
    cust.greet()
    cust.leave()

    if cust.is_birthday():
        print("It's their birthday")

    age = cust.age()
    print ("Age %s" % age)

if __name__ == '__main__':
    main()
