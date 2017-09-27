# Twilius
> Codius image for a twilio sender

On second thought, it might be hard to make this a codius
image because it needs some secrets.

To set up the server:

```sh
$ export TWILIO_ACCOUNT="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$ export TWILIO_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$ export TWILIO_NUMBER="+1555XXXXXXX"

$ export ILP_PLUGIN='ilp-plugin-xrp-escrow'
$ export ILP_CREDENTIALS='{"server":"wss://s.altnet.rippletest.net:51233","secret":"..."}'

$ PORT=7000 node index.js
```

To use the server (with [`ilp-curl`](https://github.com/sharafian/ilp-curl)):

```
$ ilp-curl localhost:7000 --json -F to='+15551234567' -F text='hello'
```
