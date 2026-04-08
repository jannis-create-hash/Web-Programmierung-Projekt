var token = localStorage.getItem('token');

// Nicht eingeloggt → zurück zum Login
if (!token) {
    window.location.href = 'LogIn.html';
}

// ── Mitarbeiter laden ─────────────────────────────────────────────────────────

function loadMitarbeiter() {
    $.ajax({
        url:         BACKEND_URL + '/api/mitarbeiter',
        type:        'get',
        dataType:    'json',
        contentType: 'application/json',
        headers:     { 'Authorization': 'Bearer ' + token },
        success: function (data) {
            console.log('Mitarbeiter geladen');
            var rows = '';
            $.each(data.mitarbeiter, function (index, m) {
                rows += '<tr>' +
                    '<td>' + m.id       + '</td>' +
                    '<td>' + m.vorname  + '</td>' +
                    '<td>' + m.nachname + '</td>' +
                    '<td>' + m.abteilung + '</td>' +
                    '<td>' +
                        '<button onclick="openEdit(' + m.id + ',\'' + m.vorname + '\',\'' + m.nachname + '\',\'' + m.abteilung + '\')">Bearbeiten</button> ' +
                        '<button onclick="deleteMitarbeiter(' + m.id + ')">Löschen</button>' +
                    '</td>' +
                '</tr>';
            });
            $('#mitarbeiter-tabelle tbody').html(rows);
        },
        error: function (xhr) {
            console.log('Fehler beim Laden: ' + xhr.status);
        }
    });
}

// ── Mitarbeiter hinzufügen ────────────────────────────────────────────────────

function addMitarbeiter() {
    var mitarbeiter = {
        vorname:   $('#add-vorname').val(),
        nachname:  $('#add-nachname').val(),
        abteilung: $('#add-abteilung').val()
    };

    $.ajax({
        url:         BACKEND_URL + '/api/mitarbeiter',
        type:        'post',
        dataType:    'json',
        contentType: 'application/json',
        data:        JSON.stringify({ token: token, mitarbeiter: mitarbeiter }),
        success: function (data) {
            console.log('Mitarbeiter hinzugefügt');
            document.getElementById('popupAdd').close();
            $('#add-vorname, #add-nachname, #add-abteilung').val('');
            loadMitarbeiter();
        },
        error: function (xhr) {
            console.log('Fehler: ' + xhr.status);
            alert('Fehler beim Hinzufügen');
        }
    });
}

// ── Mitarbeiter bearbeiten ────────────────────────────────────────────────────

function openEdit(id, vorname, nachname, abteilung) {
    $('#edit-id').val(id);
    $('#edit-vorname').val(vorname);
    $('#edit-nachname').val(nachname);
    $('#edit-abteilung').val(abteilung);
    document.getElementById('popupEdit').showModal();
}

function editMitarbeiter() {
    var id = $('#edit-id').val();
    var mitarbeiter = {
        vorname:   $('#edit-vorname').val(),
        nachname:  $('#edit-nachname').val(),
        abteilung: $('#edit-abteilung').val()
    };

    $.ajax({
        url:         BACKEND_URL + '/api/mitarbeiter/' + id,
        type:        'put',
        dataType:    'json',
        contentType: 'application/json',
        data:        JSON.stringify({ token: token, mitarbeiter: mitarbeiter }),
        success: function (data) {
            console.log('Mitarbeiter aktualisiert');
            document.getElementById('popupEdit').close();
            loadMitarbeiter();
        },
        error: function (xhr) {
            console.log('Fehler: ' + xhr.status);
            alert('Fehler beim Bearbeiten');
        }
    });
}

// ── Mitarbeiter löschen ───────────────────────────────────────────────────────

function deleteMitarbeiter(id) {
    $('#delete-id').val(id);
    document.getElementById('popupDelete').showModal();
}

function confirmDelete() {
    var id = $('#delete-id').val();

    $.ajax({
        url:         BACKEND_URL + '/api/mitarbeiter/' + id,
        type:        'delete',
        dataType:    'json',
        contentType: 'application/json',
        data:        JSON.stringify({ token: token }),
        success: function (data) {
            console.log('Mitarbeiter gelöscht');
            document.getElementById('popupDelete').close();
            loadMitarbeiter();
        },
        error: function (xhr) {
            console.log('Fehler: ' + xhr.status);
            alert('Fehler beim Löschen');
        }
    });
}

// ── Start ─────────────────────────────────────────────────────────────────────

$(document).ready(function () {
    loadMitarbeiter();
});
