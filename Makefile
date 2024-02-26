include .env

.PHONY: up
up:
	docker-compose -f docker-compose.yml up --build -d

.PHONY: down
down:
	docker-compose -f docker-compose.yml down