# Makefile

#DBG=-g3
OPTIMIZE=-Os -fno-exceptions

SOURCES=main.cpp palindrome.cpp
OBJS = $(patsubst %.cpp, %.o, $(notdir $(SOURCES)))

CXXFLAGS=--std=c++11 $(DBG) $(OPTIMIZE)

palindrome: $(OBJS)
	$(CXX) $(CXXFLAGS) -o palindrome $(OBJS)


clean:
	rm -f palindrome *.o
