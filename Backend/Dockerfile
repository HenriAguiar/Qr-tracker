FROM python:3.9

WORKDIR /app

RUN pip install flask redis

COPY app.py /app/

CMD ["python", "app.py"]