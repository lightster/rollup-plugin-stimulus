install: init

.PHONY: test

init:
	docker-compose up -d
	docker-compose run --rm node npm install --no-save

test:
	docker-compose run --rm node npm run test
