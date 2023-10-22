create table warehouse(
id SERIAL PRIMARY KEY,
name varchar(32)
);
create table forklifter(
id SERIAL PRIMARY KEY,
warehouse_id int references warehouse(id),
current_point int,
next_point int,
task_id int references task(id),
status varchar(32) default ''
);
create table task (
id SERIAL PRIMARY KEY,
warehouse_id int references warehouse(id),
route_id int,
status varchar(32)
);
create table history(
id SERIAL PRIMARY KEY,
task_id int references task(id),
forklifter_id int references forklifter(id),
start_time timestamptz,
stop_time timestamptz
);
alter table forklifter
alter column id type int;
alter table forklifter
add column status varchar(32) default '';
create table route(
    id SERIAL primary key,
    route int
);

alter table forklifter
alter column id type int;
insert into forklifter (id,warehouse_id,status,current_point,next_point,task_id)
values(9,1,'working',2,3,10);
insert into forklifter (id,warehouse_id,status,current_point,next_point,task_id)
values(9,1,'working',2,3,10);
create table route(
    id SERIAL primary key,
    route int
);
alter table task
add column start_datetime timestamptz,
add column  stop_datetime timestamptz;
delete from task;
select * from forklifter order by id desc;
create table forklifter_distance(
warehouse_id int references warehouse(id),
forklifter_id int references forklifter(id),
 datetime timestamptz default now(),
distance int
) partition by range (datetime);