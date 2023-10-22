from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
import rest_framework.status as status
from rest_framework.parsers import JSONParser
import psycopg2
conn = psycopg2.connect(database="postgres", user="postgres", password="1234",  host="127.0.0.1", port="5433")
import datetime
@api_view(["GET","POST"])
def warehouse(request):
    if request.method == "POST":
        name = request.data['name']
        try:
            cursor = conn.cursor()
            cursor.execute(f"insert into warehouse (name) values('{name}')")
            conn.commit()
            cursor.close()
        except:
            cursor.execute("ROLLBACK")
            conn.commit()
            cursor.close()
            return Response({"message": "bad data"},status.HTTP_400_BAD_REQUEST)
        return Response({"message": "object created"})
    if request.method == "GET":
        try:
            cursor = conn.cursor()
            cursor.execute("select row_to_json(warehouse) from warehouse")
            records = cursor.fetchall()
            cursor.close()
        except:
            cursor.execute("ROLLBACK")
            conn.commit()
            cursor.close()
            return Response({"message": "bad data"},status.HTTP_400_BAD_REQUEST)
        return Response([i[0] for i in records])


@api_view(["GET","POST"])
def task(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        id = data['id']
        warehouse_id = data['warehouse_id']
        path_id = data['path_id']
        task_status = data['status']
        start_time = data['start_time']
        if start_time != 'Null':
            start_time = f"'{start_time}'::timestamptz"
        finish_time = data['finish_time']
        if finish_time != 'Null':
            finish_time = f"'{finish_time}'::timestamptz"
        try:
            cursor = conn.cursor()
            cursor.execute(f"DO\
                $do$\
                BEGIN\
                    IF EXISTS (select id from task where id = {id}) THEN\
                    update task set warehouse_id ={warehouse_id},  route_id = {path_id}, status = '{task_status}',\
                     start_datetime = {start_time},stop_datetime = {finish_time}\
                     where id = {id};\
                ELSE\
                    insert into task (id,warehouse_id,route_id,status,start_datetime,stop_datetime) values({id},{warehouse_id},{path_id},'{task_status}',\
                    {start_time},{finish_time});\
                END IF;\
                END\
                $do$")
            conn.commit()
            cursor.close()
        except:
            cursor.execute("ROLLBACK")
            conn.commit()
            cursor.close()
            return Response({"message": f"DO\
                $do$\
                BEGIN\
                    IF EXISTS (select id from task where id = {id}) THEN\
                    update task set warehouse_id ={warehouse_id},  route_id = {path_id}, status = '{task_status}',\
                     start_datetime = {start_time},stop_datetime = {finish_time}\
                     where id = {id};\
                ELSE\
                    insert into task (id,warehouse_id,route_id,status,start_datetime,stop_datetime) values({id},{warehouse_id},{path_id},'{task_status}',\
                    {start_time},{finish_time});\
                END IF;\
                END\
                $do$"},status.HTTP_400_BAD_REQUEST)
        return Response({"message": "object created"})
    if request.method == "GET":
        id = request.GET.get('id')
        try:
            cursor = conn.cursor()
            cursor.execute(f"select row_to_json(warehouse) from warehouse where id = {id}")
            records = cursor.fetchall()
            cursor.close()
        except:
            cursor.execute("ROLLBACK")
            conn.commit()
            cursor.close()
            return Response({"message": "bad data"},status.HTTP_400_BAD_REQUEST)
        return Response(records[0][0])

@csrf_exempt
@api_view(["GET"])
def tasklist(request):
    warehouse_id = request.GET.get('warehouse_id')
    try:
        cursor = conn.cursor()
        cursor.execute(f"select row_to_json(task) from warehouse where warehouse_id = {warehouse_id}")
        records = cursor.fetchall()
        cursor.close()
    except:
        cursor.execute("ROLLBACK")
        conn.commit()
        cursor.close()
        return Response({"message": "bad data"},status.HTTP_400_BAD_REQUEST)
    return Response([i[0] for i in records])

@csrf_exempt
@api_view(["GET","POST"])
def forklifter(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        id = data['id']
        warehouse_id = data['warehouse_id']
        flstatus = data['status']
        current_point = data['current_point']
        next_point = data['next_point']
        task = data['task']
        distance = data['distance']
        date = data['date']
        partition_name = date.split(" ")[0].replace(".","_")
        next_point_time = data['next_point_time']
        last_service_date = data['last_service_date']
        next_service_date = data['next_service_date']
        # if current_point in [1,2,5,8] and next_point in [1,2,5,8]:
        #     distance = 5
        # if current_point in [9,8,6,5,3,2] and next_point in [9,8,6,5,3,2]:
        #     distance = 10
        # if current_point in [10,9,7,6,4,3] and next_point in [10,9,7,6,4,3]:
        #     distance = 15  не поняли можно ли модифицировать сильно исходный скрипт
        try:
            cursor = conn.cursor()
            cursor.execute(f"DO\
            $do$\
            BEGIN\
            if (extract(month from (select datetime from forklifter_distance order by datetime desc limit 1)) is null)\
            then CREATE TABLE forklifter_{partition_name} PARTITION OF forklifter_distance\
            FOR VALUES FROM ('{date}'::date) TO ('{date}'::date + interval '1 month' - interval '1 day');\
            else\
            if (extract(month from (select datetime from forklifter_distance order by datetime desc limit 1))\
            != extract(month from '{date}'::timestamp))\
            then CREATE TABLE forklifter_{partition_name} PARTITION OF forklifter_distance\
            FOR VALUES FROM ('{date}'::date) TO ('{date}'::date + interval '1 month' - interval '1 day');\
            end if;\
            end if;\
            end\
            $do$;")
            conn.commit()
            cursor.close()
        except:
            cursor.execute("ROLLBACK")
            conn.commit()
            cursor.close()
            # return Response({'message': f"DO\
            # $do$\
            # BEGIN\
            # if (extract(month from (select datetime from forklifter_distance order by datetime desc limit 1)) is null)\
            # then CREATE TABLE forklifter_{partition_name} PARTITION OF forklifter_distance\
            # FOR VALUES FROM ('{date}'::timestamptz - interval '1 month') TO ('{date}'::timestamptz);\
            # else\
            # if (extract(month from (select datetime from forklifter_distance order by datetime desc limit 1))\
            # != extract(month from '{date}'::timestamp))\
            # then CREATE TABLE forklifter_{partition_name} PARTITION OF forklifter_distance\
            # FOR VALUES FROM ('{date}'::timestamptz - interval '1 month') TO ('{date}'::timestamptz);\
            # end if;\
            # end if;\
            # end\
            # $do$;"}, status.HTTP_400_BAD_REQUEST)
        try:
            cursor = conn.cursor()
            cursor.execute(f"DO\
            $do$\
            BEGIN\
            IF EXISTS (select id from forklifter where id = {id}) THEN\
            update forklifter set warehouse_id = {warehouse_id}, status = '{flstatus}' ,\
            current_point={current_point} ,next_point = {next_point},task_id = {task} where id = {id};\
            insert into forklifter_distance (warehouse_id,forklifter_id,distance,datetime)\
            values({warehouse_id},{id},{distance},'{date}'::timestamptz);\
            ELSE\
            insert into forklifter (id,warehouse_id,status,current_point,next_point,task_id,\
            next_service_date,last_service_date,next_point_time)\
            values({id},{warehouse_id},'{flstatus}',{current_point},{next_point},{task},\
            '{next_service_date}'::date,'{last_service_date}'::date,'{next_point_time}'::date);\
            insert into forklifter_distance (warehouse_id,forklifter_id,distance,datetime)\
            values({warehouse_id},{id},{distance},'{date}'::timestamptz\
            );\
            END IF;\
            END\
            $do$")
            conn.commit()
            cursor.close()
        except:
            cursor.execute("ROLLBACK")
            conn.commit()
            cursor.close()
            return Response({'message':f"DO\
            $do$\
            BEGIN\
            IF EXISTS (select id from forklifter where id = {id}) THEN\
            update forklifter set warehouse_id = {warehouse_id}, status = '{flstatus}' ,\
            current_point={current_point} ,next_point = {next_point},task_id = {task} where id = {id};\
            insert into forklifter_distance (warehouse_id,forklifter_id,distance,datetime)\
            values({warehouse_id},{id},{distance},'{date}'::timestamptz);\
            ELSE\
            insert into forklifter (id,warehouse_id,status,current_point,next_point,task_id,\
            next_service_date,last_service_date,next_point_time)\
            values({id},{warehouse_id},'{flstatus}',{current_point},{next_point},{task},\
            '{next_service_date}'::date,'{last_service_date}'::date,'{next_point_time}'::date);\
            insert into forklifter_distance (warehouse_id,forklifter_id,distance,datetime)\
            values({warehouse_id},{id},{distance},'{date}'::timestamptz\
            );\
            END IF;\
            END\
            $do$"},status.HTTP_400_BAD_REQUEST)
        return Response({"message": "object created"})
    if request.method == "GET":
        id = request.GET.get('id')
        warehouse_id = request.GET.get('warehouse_id')
        try:
            cursor = conn.cursor()
            cursor.execute(f"select row_to_json(forklifter) from forklifter where id = {id}\
             and warehouse_id = {warehouse_id}")
            records = cursor.fetchall()
            cursor.close()
        except:
            cursor.execute("ROLLBACK")
            conn.commit()
            cursor.close()
            return Response({"message": "bad data"},status.HTTP_400_BAD_REQUEST)
        return Response([i[0] for i in records])

@csrf_exempt
@api_view(["GET"])
def forklifterlist(request):
        id = request.GET.get('id')
        warehouse_id = request.GET.get('warehouse_id')
        try:
            cursor = conn.cursor()
            cursor.execute(f"select row_to_json(forklifter) from forklifter where warehouse_id = {warehouse_id}")
            records = cursor.fetchall()
            cursor.close()
        except:
            cursor.execute("ROLLBACK")
            conn.commit()
            cursor.close()
            return Response({"message": "bad data"},status.HTTP_400_BAD_REQUEST)
        return Response([i[0] for i in records])

@csrf_exempt
@api_view(["GET"])
def distance(request):
    forklifter_id = request.GET.get('forklifter_id')
    warehouse_id = request.GET.get('warehouse_id')
    start_datetime = request.GET.get('start_datetime')
    stop_datetime = request.GET.get('stop_datetime')
    try:
        cursor = conn.cursor()
        cursor.execute(f"select sum(distance) from forklifter_distance where warehouse_id = {warehouse_id}\
                        and forklifter_id = {forklifter_id} and {start_datetime}=< 'datetime'::timestamptz and\
                         datetime <'{stop_datetime}'::timestamptz ")
        records = cursor.fetchall()
        cursor.close()
    except:
        cursor.execute("ROLLBACK")
        conn.commit()
        cursor.close()
        return Response({"message": "bad data"}, status.HTTP_400_BAD_REQUEST)
    return Response(records[0][0])

@csrf_exempt
@api_view(["GET"])
def work_time(request):
    forklifter_id = request.GET.get('forklifter_id')
    warehouse_id = request.GET.get('warehouse_id')
    try:
        cursor = conn.cursor()
        cursor.execute(f"select sum(stop_datetime-start_datetime) from task where\
        (select id from forklifter where task_id = task.id) = {forklifter_id} and  warehouse_id = {warehouse_id}")
        records = cursor.fetchall()
        cursor.close()
    except:
        cursor.execute("ROLLBACK")
        conn.commit()
        cursor.close()
        return Response({"message": "bad data"}, status.HTTP_400_BAD_REQUEST)
    return Response([{"forklifter_id":forklifter_id,"warehouse_id":warehouse_id,"work_time":i[0]} for i in records])
