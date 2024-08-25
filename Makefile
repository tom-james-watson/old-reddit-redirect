.PHONY: run clean

old-reddit-redirect.zip: *.json img/* *.md *.txt
	zip -r old-reddit-redirect.zip * -x .git/* -x img/screenshot.png -x .gitignore -x Makefile -x _metadata/*

run:
	npx web-ext run

clean:
	rm -f *.zip
