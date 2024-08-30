# file-system-access

[File System Access](https://wicg.github.io/file-system-access/), based on WICG
spec reference implementation.

## Usage

`createFileSystemAccess` binds the
[File System Access API](https://wicg.github.io/file-system-access/). This
requires [user agent](#user-agent).

```ts
import {
  createFileSystemAccess,
  type UserAgent,
} from "@miyauci/file-system-access";

declare const UA: UserAgent;
const { showOpenFilePicker } = createFileSystemAccess(UA);

const [handle] = await showOpenFilePicker();
```

`createFileSystemAccess` returns the following API:

- [showOpenFilePicker](https://wicg.github.io/file-system-access/#api-showopenfilepicker)
- [showSaveFilePicker](https://wicg.github.io/file-system-access/#api-showsavefilepicker)
- [showDirectoryPicker](https://wicg.github.io/file-system-access/#api-showdirectorypicker)

### User Agent

`UserAgent` is different for each runtime. Only execution at the respective
runtime is guaranteed.

#### Deno

```ts
import { UserAgent } from "@miyauci/file-system-access/deno";

const UA = new UserAgent();
```

When using `UserAgent`, the following flags are required.

- `--unstable-ffi`

##### Permission Flags

It also requires the following permission.

- `--allow-env`(`DENO_DIR`, `HOME`)
- `--allow-net`(`github.com`)
- `--allow-ffi`
- `--allow-read`(path to binary cache, target directories and files)
- `--allow-write`(path to binary cache, target files)

#### Node.js

```ts
import { UserAgent } from "@miyauci/file-system-access/node";

const UA = new UserAgent();
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE) © 2024 Tomoki Miyauchi
