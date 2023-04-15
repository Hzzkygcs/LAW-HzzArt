import os
from flask import Flask, jsonify, request
from werkzeug.exceptions import Unauthorized

app = Flask(__name__)

# Define a dictionary to store service registration information
registered_services = {}

# Define a route for service registration
@app.route('/register', methods=['POST'])
def register_service():
    # Verify that the request comes from an authorized service
    service_token = request.headers.get('X-Service-Token')
    if service_token != os.environ.get('SERVICE_REGISTRY_TOKEN'):
        raise Unauthorized('Invalid service token')

    # Get the registration information from the request
    service_name = request.json.get('name')
    service_host = request.json.get('host')
    service_port = request.json.get('port')

    # Add the service to the registry
    registered_services[service_name] = {
        'host': service_host,
        'port': service_port
    }

    return jsonify({'status': 'ok'})

# Define a route to return the list of registered services
@app.route('/services')
def get_services():
    return jsonify(registered_services)

if __name__ == '__main__':
    # Get the SERVICE_REGISTRY_PORT and SERVICE_REGISTRY_TOKEN environment variables
    port = int(os.environ.get('SERVICE_REGISTRY_PORT', 9000))
    token = os.environ.get('SERVICE_REGISTRY_TOKEN')

    # Start the app with the specified port and token
    app.run(host='0.0.0.0', port=port, token=token)
