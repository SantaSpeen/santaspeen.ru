from flask import Flask, render_template
import os
import frontmatter
import json
from datetime import datetime
import markdown.extensions.fenced_code
import markdown.extensions.tables


app = Flask(__name__)


# Функция для загрузки данных из YAML-файла
def load_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = frontmatter.load(file)
    return data


# Функция для получения списка файлов в указанной директории, с сортировкой по дате создания
def get_sorted_files(directory):
    files = []
    for file_name in os.listdir(directory):
        file_path = os.path.join(directory, file_name)
        if file_name.endswith('.md') and os.path.isfile(file_path):
            created = os.path.getctime(file_path)
            files.append((file_path, created))
    files.sort(key=lambda x: x[1], reverse=True)  # Сортировка по дате создания в обратном порядке
    return files


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


# Роут для отображения списка блогов
@app.route('/blog')
def blog():
    md_files = get_sorted_files('blog')
    blog_list = []
    for file_path, created in md_files:
        data = load_data(file_path)
        title = data.get('title', 'No Title')
        edited = data.get('edited', '')
        # Используем название файла для переадресации, но отображаем тему
        blog_list.append(
            {'title': title, 'edited': edited, 'file_name': os.path.splitext(os.path.basename(file_path))[0]})
    return render_template('list.html', blog_list=blog_list)


# Роут для отображения содержимого блога
@app.route('/blog/<path:path>')
def blog_post(path):
    file_path = f'blog/{path}.md'
    try:
        data = load_data(file_path)
    except FileNotFoundError:
        return render_template('404.html')
    
    title = data.get('title', 'No Title')                           
    group = data.get('group', 'No Group')
    counter_data = {}

    # Загрузка данных из counters.json или создание нового счетчика
    try:
        with open('counters.json', 'r') as counter_file:
            counter_data = json.load(counter_file)
    except FileNotFoundError:
        pass

    # Обновление счетчика и сохранение
    counter_data[path] = counter_data.get(path, 0) + 1
    with open('counters.json', 'w') as counter_file:
        json.dump(counter_data, counter_file, indent=2)

    counter = counter_data[path]

    edited = data.get('edited', '')

    # Конвертация Markdown в HTML
    content = markdown.markdown(str(data).replace(" \\\n", "<br>").replace("{% ", "{ ").replace(" %}", " }"), extensions=["fenced_code", "tables"])

    return render_template('post.html', title=title, group=group, counter=counter, edited=edited, content=content)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
