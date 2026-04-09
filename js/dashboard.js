var token = localStorage.getItem('token');
var alleMitarbeiter = [];
var sortSpalte = 'id';
var sortAufsteigend = true;

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
            alleMitarbeiter = data.mitarbeiter;
            $('#stats-anzahl').text(alleMitarbeiter.length);
            tabelleRendern(alleMitarbeiter);
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

// ── Tabelle rendern ───────────────────────────────────────────────────────────

function tabelleRendern(liste) {
    var rows = '';
    if (liste.length === 0) {
        rows = '<tr><td colspan="5">Keine Mitarbeiter gefunden.</td></tr>';
    } else {
        $.each(liste, function (index, m) {
            rows += '<tr>' +
                '<td>' + m.id + '</td>' +
                '<td>' + m.vorname + '</td>' +
                '<td>' + m.nachname + '</td>' +
                '<td>' + m.abteilung + '</td>' +
                '<td>' +
                    '<button onclick="openEdit(' + m.id + ',\'' + m.vorname + '\',\'' + m.nachname + '\',\'' + m.abteilung + '\')">Bearbeiten</button>' +
                    '<button onclick="deleteMitarbeiter(' + m.id + ')" style="background-color:#dc2626;">Löschen</button>' +
                '</td>' +
            '</tr>';
        });
    }
    $('#mitarbeiter-tabelle tbody').html(rows);
}

// ── Suche / Filter ────────────────────────────────────────────────────────────

function filterTabelle() {
    var suche = $('#suchfeld').val().toLowerCase();
    var gefiltert = alleMitarbeiter.filter(function (m) {
        return m.vorname.toLowerCase().includes(suche) ||
               m.nachname.toLowerCase().includes(suche) ||
               m.abteilung.toLowerCase().includes(suche);
    });
    tabelleRendern(gefiltert);
}

// ── Sortierung ────────────────────────────────────────────────────────────────

function sortieren(spalte) {
    if (sortSpalte === spalte) {
        sortAufsteigend = !sortAufsteigend;
    } else {
        sortSpalte = spalte;
        sortAufsteigend = true;
    }
    var sortiert = alleMitarbeiter.slice().sort(function (a, b) {
        var x = String(a[spalte]).toLowerCase();
        var y = String(b[spalte]).toLowerCase();
        if (x < y) return sortAufsteigend ? -1 : 1;
        if (x > y) return sortAufsteigend ? 1 : -1;
        return 0;
    });
    tabelleRendern(sortiert);
}

// ── Start ─────────────────────────────────────────────────────────────────────

$(document).ready(function () {
    loadMitarbeiter();
});
