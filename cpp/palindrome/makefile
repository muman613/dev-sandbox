# Makefile

DBG=-g3

SOURCES=main.cpp palindrome.cpp
OBJS = $(patsubst %.cpp, %.o, $(notdir $(SOURCES)))

CXXFLAGS=--std=c++11 $(DBG)

palindrome: $(OBJS)
	$(CXX) $(CXXFLAGS) -o palindrome $(OBJS)


clean:
	rm -f palindrome *.o
