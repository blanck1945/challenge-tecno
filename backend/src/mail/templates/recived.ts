export const recived = (name: string, message: string) => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gracias por contactarnos</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            font-size: 24px;
            color: #2c3e50;
        }
        .content {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
        .footer a {
            color: #3498db;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="header">
            ¡Gracias por contactarnos, ${name}!
        </h2>
        <div class="content">
            <p>Muchas gracias ${name} por contactarte con nosotros.</p>
            <p>A la brevedad vamos a responder a tu mensaje.</p>
            <p>Muchas gracias por usar nuestra plataforma y por haberte puesto en contacto con nosotros.</p>
        </div>
        <p>tu Mensaje ${message}            
        </p>
        <div class="footer">
            <p>Si tienes alguna duda, no dudes en responder a este correo.</p>
        </div>
        <p>Saludos, <br>
            El equipo de Urbano
        </p>
    </div>
</body>
</html>
`;
};
