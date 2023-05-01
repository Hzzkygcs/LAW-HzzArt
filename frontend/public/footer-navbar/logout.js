function logout() {
    localStorage.removeItem('x-jwt-token');
    Cookies.remove('x-jwt-token');
    window.location.reload();
}