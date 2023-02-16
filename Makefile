NAME = transcendence

all: $(NAME)

$(NAME):
	@printf "ft_transcendence Project Started!!!\n"
	docker compose up

clean:
	docker compose down

fclean:
	docker stop $(docker ps -qa); \
	docker rm $(docker ps -qa); \
	docker rmi -f $(docker images -qa); \
	docker volume rm $(docker volume ls -q); \
	docker network rm $(docker network ls -q) 2>/dev/null

.PHONY: all clean fclean
