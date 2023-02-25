NAME = transcendence

all: $(NAME)

$(NAME):
	@printf "ft_transcendence Project Started!!!\n"
	docker compose up -d

clean:
	docker compose down

fclean:
	docker-compose -f ./docker-compose.yml down --rmi all --volumes --remove-orphans

front-log:
	docker logs -f frontend

back-log:
	docker logs -f frontend

front:
	docker exec -it frontend bash

back:
	docker exec -it backend bash

logs:
	docker-compose logs

ps:
	docker-compose ps

.PHONY: all clean fclean
