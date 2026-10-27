.PHONY: run clean

old-reddit-redirect.zip: *.json *.js *.css img/* *.txt
	rm -f $@
	zip -r old-reddit-redirect.zip *.json *.js *.css img LICENSE.txt -x img/screenshot.png

run:
	npx web-ext run

clean:
	rm -f *.zip
