from flask import Flask, render_template, jsonify
import google.generativeai as genai
import os
# export API_KEY='AIzaSyD4bNnAaVjEUaA1WZKpz39kThvrQTw3noU'

app = Flask(__name__)

@app.route('/')
@app.route('/<path:page>')
def index(page='dashboard'):
    data = {
        'heart_rate': [72, 75, 78, 76, 73, 77, 75],
        'blood_pressure': [120, 118, 119, 121, 120, 122, 119],
        'steps': [8000, 8500, 9000, 7000, 9500, 8000, 7500],
        'sleep': [7.5, 8, 6.5, 7, 8.5, 7, 6.5]
    }
    return render_template('base.html',data=data)

@app.route('/api/<path:page>')
def get_page_content(page):
    try:
        content = render_template(f'content/{page}.html')
        return jsonify({'content': content})
    except:
        return jsonify({'error': 'Page not found'}), 404


genai.configure(api_key=os.environ["API_KEY"])

model = genai.GenerativeModel('gemini-1.5-flash')

response = model.generate_content("Write a story about an AI and magic")
print(response.text, "vksngjabsjg")


if __name__ == '__main__':
    app.run(debug=True)

