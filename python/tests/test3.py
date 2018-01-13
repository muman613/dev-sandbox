#!/usr/bin/env python3

import psycopg2

def main():
    """[summary]
    """
    try:
        conn = psycopg2.connect(user='michael', dbname='michael', host='revelation.sdesigns.com')
    except psycopg2.OperationalError:
        print("Unable to connect to remote database server!")
        exit()

    curs = conn.cursor()

    curs.execute("SELECT * FROM contacts ORDER BY joindate ;")

    for x in curs:
        print("{} - {}".format(x[0], x[1]))

main()
