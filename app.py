from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<page>')
def render_page(page):
    return render_template(f'content/{page}.html')

if __name__ == '__main__':
    app.run(debug=True)