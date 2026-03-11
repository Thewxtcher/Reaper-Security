import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { Client } from 'npm:ssh2@1.15.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { host, port, username, password, command } = await req.json();

    if (!host || !username || !command) {
      return Response.json({ error: 'host, username, and command are required' }, { status: 400 });
    }

    const result = await new Promise((resolve) => {
      const conn = new Client();
      let settled = false;

      const done = (val) => {
        if (!settled) { settled = true; resolve(val); }
      };

      const timeout = setTimeout(() => {
        conn.end();
        done({ error: 'Connection timed out after 15 seconds.' });
      }, 15000);

      conn.on('ready', () => {
        conn.exec(command, (err, stream) => {
          if (err) {
            clearTimeout(timeout);
            conn.end();
            done({ error: err.message });
            return;
          }

          let output = '';
          stream.on('data', (data) => { output += data.toString(); });
          stream.stderr.on('data', (data) => { output += data.toString(); });
          stream.on('close', () => {
            clearTimeout(timeout);
            conn.end();
            done({ output });
          });
        });
      });

      conn.on('error', (err) => {
        clearTimeout(timeout);
        done({ error: `SSH Error: ${err.message}` });
      });

      conn.connect({
        host,
        port: parseInt(port) || 22,
        username,
        password,
        readyTimeout: 12000,
        keepaliveInterval: 0,
      });
    });

    if (result.error) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json({ output: result.output });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});