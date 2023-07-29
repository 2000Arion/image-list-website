const http = require('http')
const fs = require('fs')

let data = fs.readFileSync("config.json", "utf-8")
let pass = JSON.parse(data)

const port = pass.port
const allowedIpsArray = pass.admin_panel_enabled
// Hole das Array "links"
let itemsArray = pass.links;

// Erzeuge den HTML-Code für jedes Element im Array
let htmlCode = "";
for (let i = 0; i < itemsArray.length; i++) {
    const imageUrl = itemsArray[i];
    const imageId = `i${i}`;
    // Füge den HTML-Code für jedes Bild hinzu
    htmlCode += `        <img id="${imageId}" src="${imageUrl}" alt="⚠️ Das Bild konnte nicht gefunden werden. Du kannst trotzdem hier klicken, um den Link zu kopieren." onclick="copy('${imageId}')"><br>\n`;
}

let ipadresssettings = "";
let negativeipas = "";
for (let i = 0; i < allowedIpsArray.length; i++) {
    const slIpaddr = allowedIpsArray[i];
    let index = allowedIpsArray.indexOf(slIpaddr);
    if (index !== -1 && index === allowedIpsArray.length - 1) {
        //console.log("Das Element ist das letzte Element im Array.");
        ipadresssettings += `req.socket.remoteAddress == '${slIpaddr}'`
        negativeipas += `req.socket.remoteAddress != '${slIpaddr}'`
    } else {
        //console.log("Das Element ist nicht das letzte Element im Array.");
        ipadresssettings += `req.socket.remoteAddress == '${slIpaddr}' || `
        negativeipas += `req.socket.remoteAddress != '${slIpaddr}' || `
    }
}

// Lese die bestehende HTML-Datei
let existingHTML = `<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Discord CDN Test | arion2000.xyz</title>
    <link rel="icon" type="image/x-icon" href="https://lh3.googleusercontent.com/DRA2M-dAoOp06TK-y9kec0XlQQIMDCHmR7YsQEpQE8DdukbfDpo9PVgP15j6no1_jKDDTiWlzsdjX4k2G5VGSsU=w16383">
    <style>
        img {
            cursor: pointer;
            background-color: #5865F2;
            padding: 0.1%;
            border-color: #2B2D31;
            border-radius: 10px;
            margin: 0.3%;
            transition: 270ms;
        }

        img:hover {
            background-color: aqua;
            color: rgb(50, 50, 50)
        }

        body {
            background-color: #2B2D31;
            color: white;
            font-family: sans-serif;
            max-width: 100%;
            margin: 0 auto;
            /* Zentriert den Inhalt innerhalb des sichtbaren Bereichs */
        }

        #feedback {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin-top: 90vh;
            margin-bottom: 0;
            background-color: #5865F2;
            padding: 0.7%;
            cursor: default;
        }

        .help_btn {
            cursor: default;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin-top: 0;
            background-color: #5865F2;
            padding: 0.5%;
            border-color: #2B2D31;
            margin: 0.3%;
            transition: 270ms;
        }

        .globalcontentview {
            margin-bottom: 10vh;
        }
    </style>
    <script>
        function scrollToBottom() {
            // Die Höhe der gesamten Seite (einschließlich des sichtbaren Bereichs) erhalten
            const gesamtHoehe = document.body.scrollHeight;

            // Die Höhe des sichtbaren Bereichs im Browserfenster erhalten
            const sichtbareHoehe = window.innerHeight;

            // Die vertikale Scroll-Position auf den Wert des Abstands zwischen dem oberen Bildschirmrand und dem unteren Ende setzen
            window.scrollTo(0, gesamtHoehe - sichtbareHoehe - -100);
        }

        function load() {
            if (window.location.hash == '#response_type=ad_end_req') {
                scrollToBottom()
                window.history.pushState('new', 'title', '/');
                window.location.reload()
            }
        }

        function copy(srcId) {
            document.getElementById('feedback').innerHTML = '⚠️ Lade...'
            /*if (window.location.hostname == 'img.localhost' && window.location.pathname == '/index.html') {
                window.location.replace = 'http://img.localhost/';
            } else if (window.location.hostname != 'img.localhost') {
                window.location.href = 'http://img.localhost/';
            }*/
            // Den Inhalt des src-Attributs des Bildes abrufen
            const imgId = document.getElementById(srcId);
            navigator.clipboard.writeText(imgId.src);
            document.getElementById('feedback').innerHTML = '✅ Der Link <a target="_blank" href="' + imgId.src + '">(' + imgId.src + ')</a> wurde kopiert. <br>➡️ Du kannst ihn überall über <b><u>STRG + V</u></b> oder über das <b><u>Rechtsklick-Menü</u></b> einfügen.'
        }
    </script>
</head>

<body link="#99f0e6" vlink="#99f0e6" alink="#ffffff" onload="load()">
    <h2 class="help_btn">🖼️ Discord CDN Test&nbsp;|&nbsp;Seite 1</h2>
    <div class="globalcontentview">
{% content %}
    </div>
    <h3 id="feedback">❔ Klicke auf ein Bild, um den Link zu diesem zu kopieren. Alle Bilder sind auf dem CDN von Discord
        gehostet. Irgendwann werden diese Bilder vorraussichtlich nicht mehr einsehbar sein. Mit dieser Webseite soll
        getestet werden, wann das der Fall ist.</h3>
</body>

</html>`

// Ersetze "{% content %}" mit dem generierten HTML-Code
existingHTML = existingHTML.replace("{% content %}", htmlCode);

// Speichere die aktualisierte HTML-Datei
fs.writeFileSync("file.html", existingHTML, "utf-8");


/*else if (ipadresssettings) {
            console.log(ipadresssettings)
            console.log(req.socket.remoteAddress)
            fs.readFile('admin.html', function (error, data) {
                if (error) {
                    res.writeHead(404)
                    res.write('Error: Datei nicht gefunden oder nicht abgerufen.')
                } else {
                    res.write(data)
                }
                res.end()
            })
            console.log(negativeipas)
            console.log(req.socket.remoteAddress)
            fs.readFile('file.html', function (error, data) {
                if (error) {
                    res.writeHead(404)
                    res.write('Error: Datei nicht gefunden oder nicht abgerufen.')
                } else {
                    res.write(data)
                }
                res.end()
            })
        }*/

const server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    if (req.url == '/admin' && ipadresssettings) {
        //if (ipadresssettings) {
        //console.log(ipadresssettings)
        //console.log(req.socket.remoteAddress)
        fs.readFile('admin.html', function (error, data) {
            if (error) {
                res.writeHead(404)
                res.write('Error: Datei nicht gefunden oder nicht abgerufen.')
            } else {
                res.write(data)
            }
            res.end()
        })
        //}
    } else if (req.method === 'POST' && req.url === '/send-link') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const linkData = JSON.parse(body);
            const link = linkData.link;

            // Füge den Link zur config.json-Datei hinzu
            fs.readFile('config.json', 'utf8', (err, data) => {
                if (err) {
                    console.error('Fehler beim Lesen der config.json:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false }));
                    return;
                }

                const config = JSON.parse(data);

                // Überprüfe, ob der Link bereits in der JSON-Datei vorhanden ist
                if (config.links.includes(link)) {
                    console.log('Link ist bereits vorhanden:', link);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Link ist bereits vorhanden.' }));
                    return;
                }

                config.links.push(link);

                fs.writeFile('config.json', JSON.stringify(config, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error('Fehler beim Schreiben der config.json:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false }));
                        return;
                    }

                    console.log('Link wurde zur config.json hinzugefügt:', link);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                });
            });
        });
    } else if (req.method === 'POST' && req.url === '/delete-link') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            const deleteLinkData = JSON.parse(body);
            const deleteLink = deleteLinkData.link;

            // Lies die config.json-Datei, um vorhandene Links zu überprüfen
            fs.readFile('config.json', 'utf8', (err, data) => {
                if (err) {
                    console.error('Fehler beim Lesen der config.json:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false }));
                    return;
                }

                const config = JSON.parse(data);

                // Überprüfe, ob der Link in der JSON-Datei vorhanden ist
                const linkIndex = config.links.indexOf(deleteLink);
                if (linkIndex === -1) {
                    console.log('Link wurde nicht gefunden:', deleteLink);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false }));
                    return;
                }

                // Entferne den Link aus der JSON-Datei
                config.links.splice(linkIndex, 1);

                // Schreibe die aktualisierte JSON-Datei zurück
                fs.writeFile('config.json', JSON.stringify(config, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error('Fehler beim Schreiben der config.json:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false }));
                        return;
                    }

                    console.log('Link wurde aus der config.json entfernt:', deleteLink);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                });
            });
        });
    } else {
        fs.readFile('file.html', function (error, data) {
            if (error) {
                res.writeHead(404)
                res.write('Error: Datei nicht gefunden oder nicht abgerufen.')
            } else {
                res.write(data)
            }
            res.end()
        })
    }
})

server.listen(port, function (error) {
    if (error) {
        console.error('Etwas ist schiefgelaufen', error)
    } else {
        console.log('Server läuft auf dem Port ' + port)
    }
})