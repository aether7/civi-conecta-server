node_modules:
	npm ci --no-optional

seed:
	node bin/generate.js

migrate:
	NODE_ENV=staging ./node_modules/.bin/knex migrate:latest

restore:
	rm dev.sqlite3
	./node_modules/.bin/knex migrate:latest

repopulate:
	$(MAKE) restore
	bash bin/generate-planning-survey.sh
