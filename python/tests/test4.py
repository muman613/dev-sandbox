#!/usr/bin/env python3

import psycopg2

def main():
    """[summary]
    """
    try:
        conn = psycopg2.connect(user='michael', dbname='michael', password='password')
    except psycopg2.OperationalError:
        print("Unable to connect to remote database server!")
        exit()

    curs = conn.cursor()

    curs.execute("SELECT * FROM user_list ORDER BY last_name, first_name, city;")

    for x in curs:
        fullname = "{} {}".format(x[0], x[1])
        print("Fullname : {:20}".format(fullname))

main()
