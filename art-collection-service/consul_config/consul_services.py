import consul


def register_service():
    # Create a Consul client
    client = consul.Consul()

    consul_ip_address = '34.69.73.195'
    this_ip_address = '34.69.73.195'
    this_port = 8085
    # Define the service details
    service = {
        'name': 'art-collection-service',  # TODO
        'service_id': 'art-collection-service',
        'address': consul_ip_address,
        'port': 8500,
        # 'check': {
        #     'http': f'http://{this_ip_address}:{this_port}/health',
        #     'interval': '10s',
        #     'timeout': '5s',
        # },
    }

    # Register the service with Consul
    client.agent.service.register(**service)
    print("success")

# Assuming thisServiceName, ip, and thisServicePort have been defined

# Call the async function to register the service
register_service()
