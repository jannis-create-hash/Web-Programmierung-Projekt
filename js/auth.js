// ── Login ─────────────────────────────────────────────────────────────────────

function handleLogon() {
    var email    = $('#email').val();
    var password = $('#password').val();

    $.ajax({
        url:         BACKEND_URL + '/api/auth/logon',
        type:        'post',
        dataType:    'json',
        contentType: 'application/json',
        data:        JSON.stringify({ email: email, password: password }),
        success: function (data) {
            console.log('Login erfolgreich');
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'Dashboard.html';
        },
        error: function (xhr) {
            var msg = xhr.responseJSON ? xhr.responseJSON.error : 'Login fehlgeschlagen';
            $('#error-msg').text(msg).show();
            console.log('Fehler: ' + xhr.status + ' ' + msg);
        }
    });
}

// ── Register ──────────────────────────────────────────────────────────────────

function handleRegister() {
    var name     = $('#name').val();
    var email    = $('#email').val();
    var password = $('#password').val();

    $.ajax({
        url:         BACKEND_URL + '/api/auth/register',
        type:        'post',
        dataType:    'json',
        contentType: 'application/json',
        data:        JSON.stringify({ name: name, email: email, password: password }),
        success: function (data) {
            console.log('Registrierung erfolgreich');
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'Dashboard.html';
        },
        error: function (xhr) {
            var msg = xhr.responseJSON ? xhr.responseJSON.error : 'Registrierung fehlgeschlagen';
            $('#error-msg').text(msg).show();
            console.log('Fehler: ' + xhr.status + ' ' + msg);
        }
    });
}

// ── Logoff ────────────────────────────────────────────────────────────────────

function handleLogoff() {
    var token = localStorage.getItem('token');

    $.ajax({
        url:         BACKEND_URL + '/api/auth/logoff',
        type:        'post',
        dataType:    'json',
        contentType: 'application/json',
        data:        JSON.stringify({ token: token }),
        complete: function () {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '../HTML/Homepage.html';
        }
    });
}
