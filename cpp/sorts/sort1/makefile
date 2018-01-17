# Makefile

DBG=-g3
#OPTIMIZE=-Os -fno-exceptions
TARGET=sort1

SOURCES=main.cpp
OBJS = $(patsubst %.cpp, %.o, $(notdir $(SOURCES)))

CXXFLAGS=--std=c++11 $(DBG) $(OPTIMIZE)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJS)


clean:
	rm -f $(TARGET) $(OBJS)
