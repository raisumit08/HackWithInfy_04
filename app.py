from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('base.html')

@app.route('/api/<page>')
def get_page_content(page):
    try:
        content = render_template(f'content/{page}.html')
        return jsonify({'content': content})
    except:
        return jsonify({'error': 'Page not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)