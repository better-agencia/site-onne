# Acessar o site pela rede local (LAN)

## Situação atual

Os servidores rodam em **WSL2** e escutam em `0.0.0.0`.
Para que celulares e outros computadores da mesma rede Wi-Fi acessem, foram criados
**port-forwards no Windows** + regras de firewall.

| Servidor | Porta | No próprio PC | Pela rede (celular) |
|---|---|---|---|
| **Preview (produção, `dist/`)** | **4322** | http://localhost:4322/ | **http://192.168.15.46:4322/** |
| Dev (`npm run dev`) | 4321 | http://localhost:4321/ | http://192.168.15.46:4321/ |
| IP interno do WSL | — | http://172.27.196.173:4322/ | — |

> O IP do Windows pode mudar se a rede Wi-Fi trocar. Confira com:
> `powershell.exe -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { \$_.InterfaceAlias -eq 'Wi-Fi' }).IPAddress"`

## Subir os servidores

```bash
cd "/mnt/c/Users/yankf/Documents/Agencia Better/ONNE/website"

# Preview (build de produção) — rode um build antes se mexeu no código
npm run build
npm run preview -- --host 0.0.0.0 --port 4322

# Dev (hot-reload + modo dev)
npm run dev:lan      # = astro dev --host 0.0.0.0 --port 4321
```

O Astro roda em background (daemon). Comandos úteis (troque `preview`/`dev`):

```bash
npx astro preview status   # ver se está no ar
npx astro preview logs     # acompanhar logs
npx astro preview stop     # parar
```

> No `/mnt/c` o Astro pode avisar "failed to start within 30s" e ainda assim subir.
> Se não subir, use direto:
> `setsid node node_modules/astro/bin/astro.mjs dev --port 4321 --host 0.0.0.0 > /tmp/onne-dev.log 2>&1 < /dev/null &`

## Port-forward (já configurado, só refazer se reiniciar a máquina / trocar de rede)

Executar em **PowerShell como Administrador** (UAC pode aparecer):

```powershell
netsh interface portproxy add v4tov4 listenport=4322 listenaddress=0.0.0.0 connectport=4322 connectaddress=172.27.196.173
New-NetFirewallRule -DisplayName ONNE-Preview-4322 -Direction Inbound -LocalPort 4322 -Protocol TCP -Action Allow

# opcional, para o dev:
netsh interface portproxy add v4tov4 listenport=4321 listenaddress=0.0.0.0 connectport=4321 connectaddress=172.27.196.173
New-NetFirewallRule -DisplayName ONNE-Dev-4321 -Direction Inbound -LocalPort 4321 -Protocol TCP -Action Allow
```

> O `connectaddress` é o IP do WSL. Se ele mudar, veja com `hostname -I` dentro do WSL
> e recrie a regra (remova a antiga com
> `netsh interface portproxy delete v4tov4 listenport=4322 listenaddress=0.0.0.0`).

Conferir:

```powershell
netsh interface portproxy show all
Get-NetFirewallRule -DisplayName ONNE-Preview-4322
```

## Testar

```bash
curl -I http://192.168.15.46:4322/sobre/
```

No celular, conectado à **mesma Wi-Fi**, abra `http://192.168.15.46:4322/`.

## Observações

- **Preview** serve o `dist/` (build de produção): sem hot-reload, sem modo dev.
  Se editar o código, rode `npm run build` de novo para o preview refletir.
- **Dev** tem hot-reload e mostra os números de seção/imagem do modo dev.
- O site usa `site: https://onnebr.com` no `astro.config.mjs`, mas os servidores
  locais respondem normalmente pelo host local (canonical/OG apontam para o domínio final).
- Celular em rede de operadora ou outra Wi-Fi não acessa; precisa ser a mesma rede.
