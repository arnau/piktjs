EMCC = emcc
CFLAGS ?= -Os

PIKCHR_WASM := src/pikchr.js

all: clean dist

dist:
	@$(MAKE) $(PIKCHR_WASM)
.PHONY: dist

clean:
	rm -rf $(PIKCHR_WASM)
PHONY: clean


# Compile the C89 source to WebAssembly
src/pikchr.js: pikchr/pikchr.c
	$(EMCC) $^ $(CFLAGS) -s WASM=1 -o $@ \
		-s SINGLE_FILE=1 \
		-s EXPORT_ES6=1 \
		-s MODULARIZE=1 \
		-s EXPORTED_FUNCTIONS='["_pikchr"]' \
		-s 'EXPORTED_RUNTIME_METHODS=["ccall"]' \
		-s AGGRESSIVE_VARIABLE_ELIMINATION=1
