# REPORTER ?= dot
# https://github.com/visionmedia/mocha/blob/master/Makefile

test: test-unit

test-unit:
	@./node_modules/.bin/mocha \
		test/**/*.js

.PHONY: test test-unit