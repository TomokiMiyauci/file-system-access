# file-system-access

[File System Access](https://wicg.github.io/file-system-access/) ponyfill for
server side runtime.

This allows the native file dialog and the file system handle API to be used on
the server side.

Complies with
[WICG, File System Access](https://github.com/WICG/file-system-access) and
[File System Standard](https://github.com/whatwg/fs).

## Usage

`FileSystemAccess` binds the
[File System Access API](https://wicg.github.io/file-system-access/). The
constructor requires [adaptor](#adaptors).

```ts
import { type Adaptor, FileSystemAccess } from "@miyauci/file-system-access";

declare const adaptor: Adaptor;
const { showOpenFilePicker } = new FileSystemAccess(adaptor);

const [handle] = await showOpenFilePicker();
```

### Adaptors

Adaptor is an abstraction that absorbs runtime differences.

#### Deno

Adaptor for deno runtime with asynchronous BLOB.

```ts
import { DenoAdaptor } from "@miyauci/file-system-access/deno";
import { FileSystemAccess } from "@miyauci/file-system-access";

const adaptor = new DenoAdaptor();
const { showOpenFilePicker } = new FileSystemAccess(adaptor);
```

When using `DenoAdaptor`, the following flags are required.

- `--unstable-ffi`

##### Permissions

It also requires the following permission.

- `--allow-env`(`DENO_DIR`, `HOME`)
- `--allow-net`(`github.com`)
- `--allow-ffi`
- `--allow-read`(path to binary cache, target directories and files)
- `--allow-write`(path to binary cache, target files)

#### Bun

// TODO

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE) © 2024 Tomoki Miyauchi
