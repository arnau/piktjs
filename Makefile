EMCC = emcc
CFLAGS ?= -Os

all: clean dist/pikchr.js

# Borrowed from https://github.com/jakethaw/pikchr_webassembly_demo
dist/pikchr.js: src/pikchr.c
	mkdir -p dist
	$(EMCC) $^ $(CFLAGS) -s WASM=1 -o $@ \
		-s EXPORTED_FUNCTIONS='["_pikchr", "_leak_check"]' \
		-s 'EXPORTED_RUNTIME_METHODS=["ccall"]' \
		-s ASSERTIONS=1 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-fsanitize=address \
		-s AGGRESSIVE_VARIABLE_ELIMINATION=1

test.html: src/pikchr.c
	$(EMCC) $^ -s WASM=1 -o $@


clean:
	rm -r dist
PHONY: clean
