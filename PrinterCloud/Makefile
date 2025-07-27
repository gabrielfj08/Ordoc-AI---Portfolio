STEP=1

server:
	docker compose up

bundle:
	docker compose run --rm web bundle

console:
	docker compose run --rm web rails console

rollback: 
	docker compose run --rm web rails db:rollback STEP=$(STEP)

web:
	docker compose run --rm web $(COMMAND)

create:
	docker compose run --rm web rails db:create

migrate:
	docker compose run --rm web rails db:migrate

seed:
	docker compose run --rm web rails db:seed

routes:
	docker compose run --rm web rails routes

drop:
	docker compose run --rm web rails db:drop

setup: drop create migrate seed

rspec:
	docker compose run --rm web rspec $(TEST)

bash:
	docker compose run --rm web bash
