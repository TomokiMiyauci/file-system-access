# file-system-access

[File System Access](https://wicg.github.io/file-system-access/), based on WICG
spec reference implementation.

## Usage

```ts
import {
  showDirectoryPicker,
  showOpenFilePicker,
  showSaveFilePicker,
} from "@miyauci/file-system-access/$RUNTIME";

const [handle] = await showOpenFilePicker();
```

### Deno

#### Unstable Features Flag

The following flags are required.

- `--unstable-ffi`

```ts
import { showSaveFilePicker } from "@miyauci/file-system-access/deno";

const handle = await showSaveFilePicker();
```

##### Permission Flags

It also requires the following permission.

- `--allow-env`(`DENO_DIR`, `HOME`)
- `--allow-net`(`github.com`)
- `--allow-ffi`
- `--allow-read`(path to binary cache, target directories and files)
- `--allow-write`(path to binary cache, target files)

#### Node.js

```ts
import { showDirectoryPicker } from "@miyauci/file-system-access/node";

const dir = await showDirectoryPicker();
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE) © 2024 Tomoki Miyauchi
