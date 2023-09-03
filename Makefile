run:
	node_modules/.bin/web-ext run

old-reddit-redirect.zip: *.json *.js img/* *.md *.txt
	zip -r old-reddit-redirect.zip * -x .git/* -x img/screenshot.png -x .gitignore -x Makefile

clean:
	rm *.zip
