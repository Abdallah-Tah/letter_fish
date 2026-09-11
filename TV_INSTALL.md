# Samsung TV installation

Target: Samsung UN55MU6290 (2017), Tizen 3.0.
App ID `LtrFish001.LetterFishing`, package ID `LtrFish001`.

Enable Developer Mode on the TV (Apps → press 1,2,3,4,5) and set Host PC IP to
your Mac's LAN address. The TV's own address is assigned by DHCP and moves.

## With tvctl.sh

```
tvctl.sh deploy --project .
```

Builds, signs, pushes, installs and launches, discovering the TV on the LAN.

## By hand

```
tizen package -t wgt -s <signing-profile> -o /tmp/fishing -- .
sdb connect <tv-ip>
sdb push /tmp/fishing/LetterFishing.wgt /home/owner/share/tmp/LetterFishing.wgt
sdb shell 0 vd_appinstall LtrFish001 /home/owner/share/tmp/LetterFishing.wgt
sdb shell 0 was_execute LtrFish001.LetterFishing
```

Note that `vd_appinstall` takes the **package** ID (`LtrFish001`) while
`was_execute` takes the **application** ID (`LtrFish001.LetterFishing`). Plain
`sdb shell <cmd>` returns `closed` on retail firmware — only the `shell 0 <verb>`
form works. If a push fails with `failed to open sync channel`, the sdb server
is stale: `sdb kill-server`, then reconnect.

The `.wgt` filename must contain no spaces or the TV installer fails silently.

## Controls

Left/Right choose a fish · OK catches · Up repeats the audio · Back returns to
the menu, and from the menu exits the app.
