.PHONY: run clean

old-reddit-redirect.zip: *.json *.js img/* *.txt
	zip -r old-reddit-redirect.zip * -x .git/* -x img/screenshot.png -x .gitignore -x Makefile

run:
	npx web-ext run

clean:
	rm -f *.zip
