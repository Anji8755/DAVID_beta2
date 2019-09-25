from flask import Flask, request, jsonify
import json

import pandas as pd
app = Flask(__name__)
app.config["DEBUG"] = True

@app.route('/testapi',methods=['GET','POST'])
