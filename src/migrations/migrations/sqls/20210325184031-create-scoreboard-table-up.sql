create table scoreboard
(
	id serial not null,
	name varchar not null,
	score int,
	"createdAt" varchar(30) default now(),
	"updatedAt" varchar(30) default now()
);

create unique index scoreboard_id_uindex
	on scoreboard (id);

alter table scoreboard
	add constraint table_name_pk
		primary key (id);