# include .env
# export

environment ?= "development"
ACTIVATE_ENV = $(. .env)

node_modules:
	npm ci --no-optional

seed:
	node bin/generate.js

migrate:
	NODE_ENV=$(environment) ./node_modules/.bin/knex migrate:latest

restore:
	rm dev.sqlite3
	./node_modules/.bin/knex migrate:latest

demo:
	cat database/demo-data.sqlite.sql | sqlite3 dev.sqlite3
