### THIS PROJECT HAS BEEN DISCONTINUED.

Read more [here](https://github.com/pauloddr/gfa-guides/blob/master/README.md).

Original README archived below.

---

# @gfa/datastore-adapter

[__Google Datastore__](https://github.com/googleapis/nodejs-datastore) adapter for [__@gfa/*__] components.

## Development

Tests are run against the official [Datastore Emulator](https://cloud.google.com/datastore/docs/tools/datastore-emulator).

Before running tests, start the emulator with the following options and export the proper environment variables:

```bash
gcloud beta emulators datastore start --consistency 1.0 --no-store-on-disk &
$(gcloud beta emulators datastore env-init)
```

`--consistency 1.0` is required, otherwise tests will fail because saving resources may be delayed (inconsistent).

`--no-store-on-disk` because we don't need to store data as far as testing goes.

`&` at the end of the command to run the emulator in the background.

`env-init` will export environment variables which will be automatically picked up by the official Datastore library without any additional configuration.

If for some reason you need to wipe emulator data, run in terminal:

```bash
curl -X POST http://$DATASTORE_EMULATOR_HOST/reset
```
