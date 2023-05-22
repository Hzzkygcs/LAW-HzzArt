import os
import typing
from random import randint, choice
from threading import Thread
from time import sleep
import urllib.parse

import consul

import requests
import stun

from consul_config.catch_exception_as_warning import catch_all_exceptions_as_log
from consul_config.this_service_info import get_this_service_port, get_this_service_name

CONSUL_CURRENTLY_INITIALIZATION_PROGRESS_ENUM = 'waiting'
CONSUL_CURRENTLY_FAILED_ENUM = 'failed'
CONSUL_SINGLETON = None


def get_healthy_service_host_url(service_name, fallback, relative_path="", trailing_slash=False):
    services = get_consul_services(service_name)
    choosen = fallback
    if len(services) > 0:
        choosen = choice(services)
        choosen = choosen['Service']
        ip, port = choosen['Address'], choosen['Port']
        choosen = f"http://{ip}:{port}"
    ret = urllib.parse.urljoin(choosen, relative_path)
    if trailing_slash and not ret.endswith('/'):
        ret += '/'
    if not trailing_slash and ret.endswith('/'):
        ret = ret[:-1]
    print(f"Getting service {service_name}: {ret}")
    return ret


@catch_all_exceptions_as_log(default_value=[])
def get_consul_services(service_name):
    client: consul.Consul = get_consul_singleton()
    if client is None:
        return []
    services = client.health.service(service_name, passing=True)
    if services is not None:
        _, services = services
    return services


def initialize_consul(on_success=lambda: 0):
    def func():
        if get_consul_singleton() is not None:
            on_success()

    thread = Thread(target=func, daemon=True)
    thread.start()




def consul_init_failed(e):
    global CONSUL_SINGLETON
    CONSUL_SINGLETON = CONSUL_CURRENTLY_FAILED_ENUM
    return None


@catch_all_exceptions_as_log(catch_func=consul_init_failed)
def get_consul_singleton() -> typing.Optional[consul.Consul]:
    global CONSUL_SINGLETON
    if CONSUL_SINGLETON == CONSUL_CURRENTLY_FAILED_ENUM:
        return None

    if waiting_consul_initialization() is not False:
        return waiting_consul_initialization()
    CONSUL_SINGLETON = CONSUL_CURRENTLY_INITIALIZATION_PROGRESS_ENUM
    CONSUL_SINGLETON = register_service()
    return CONSUL_SINGLETON


def waiting_consul_initialization(wait=False):
    if CONSUL_SINGLETON is None:
        return False
    if isinstance(CONSUL_SINGLETON, consul.Consul):
        return CONSUL_SINGLETON
    if not wait:
        return False
    while CONSUL_SINGLETON == CONSUL_CURRENTLY_INITIALIZATION_PROGRESS_ENUM:
        print("Consul already begin its initialization process. Waiting...")
        sleep(0.1)
    if CONSUL_SINGLETON == CONSUL_CURRENTLY_FAILED_ENUM:
        return False
    return CONSUL_SINGLETON


def register_service():
    this_ip_address = get_this_ip_addr()
    this_port = int(get_this_service_port())
    this_service_name = get_this_service_name()

    consul_ip_address, consul_port = get_consul_server_ipaddr_and_port()
    client = consul.Consul(host=consul_ip_address, port=consul_port)

    this_service_client_id = getInstanceId(this_service_name, this_ip_address)
    service = {
        'name': this_service_name,
        'service_id': this_service_client_id,
        'address': this_ip_address,
        'port': this_port,
        'check': {
            'http': f'http://{this_ip_address}:{this_port}/health',
            'interval': '15s',
            'timeout': '5s',
        },
    }
    print(f"Registering {this_service_client_id} with {this_ip_address}:{this_port} "
          f"to consul {this_service_client_id}:{consul_port}")
    client.agent.service.register(**service)
    print(f"Registered successfully: {this_service_client_id}")
    return client


def get_this_ip_addr():
    nat_type, external_ip, external_port = stun.get_ip_info()
    print(external_ip)
    return external_ip


def get_consul_server_ipaddr_and_port():
    result = requests.get(os.environ['HZZART_NAVIGATOR_SERVER'])
    json_data = result.json()
    return json_data['EurekaElkStack']['value'], int(json_data['EurekaElkStack']['consulport']['value'])


def getInstanceId(serviceName, ipAddress):
    return f"{serviceName}-{ipAddress}-{process.env.HOSTNAME}"


if __name__ == "__main__":
    get_healthy_service_host_url('authentication-service', '')
