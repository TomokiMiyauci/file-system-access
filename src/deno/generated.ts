// deno-lint-ignore-file

import { dlopen, type FetchOptions } from "@denosaurs/plug";
import { symbols as fli } from "./binding.ts";
import denoJson from "../../deno.json" with { type: "json" };

const baseURL =
  `https://github.com/TomokiMiyauci/file-system-access/releases/download/${denoJson.version}`;

const options = {
  name: "file_dialog",
  url: baseURL,
  suffixes: {
    darwin: {
      aarch64: "_aarch64-apple-darwin",
      x86_64: "_x86_64-apple-darwin",
    },
    linux: {
      aarch64: "_aarch64-unknown-linux-gnu",
      x86_64: "_x86_64-unknown-linux-gnu",
    },
    windows: {
      aarch64: "_aarch64-pc-windows-msvc",
      x86_64: "_x86_64-pc-windows-msvc",
    },
  },
} satisfies FetchOptions;

const { symbols } = await dlopen(options, fli);

function __Dialog_new(): Dialog {
  const ret = symbols.__Dialog_new();
  return Dialog.__constructor(ret);
}

function __Dialog_pick_file(
  arg0: Deno.PointerObject | null,
): Deno.PointerObject | null {
  return symbols.__Dialog_pick_file(
    arg0,
  );
}

function __Dialog_pick_files(
  arg0: Deno.PointerObject | null,
): Deno.PointerObject | null {
  return symbols.__Dialog_pick_files(
    arg0,
  );
}

function __Dialog_pick_directory(
  arg0: Deno.PointerObject | null,
): Deno.PointerObject | null {
  return symbols.__Dialog_pick_directory(
    arg0,
  );
}

function __Dialog_set_directory(
  arg0: Deno.PointerObject | null,
  arg1: Uint8Array,
): Dialog {
  const ret = symbols.__Dialog_set_directory(
    arg0,
    arg1,
    // @ts-ignore
    arg1.byteLength,
  );
  return Dialog.__constructor(ret);
}

function __Dialog_add_filter(
  arg0: Deno.PointerObject | null,
  arg1: Uint8Array,
): Dialog {
  const ret = symbols.__Dialog_add_filter(
    arg0,
    arg1,
    // @ts-ignore
    arg1.byteLength,
  );
  return Dialog.__constructor(ret);
}

function __Dialog_dealloc(
  arg0: Deno.PointerObject | null,
): void {
  return symbols.__Dialog_dealloc(
    arg0,
  );
}

export class Dialog {
  ptr: Deno.PointerObject | null = null;

  static __constructor(ptr: Deno.PointerObject | null) {
    const self = Object.create(Dialog.prototype);
    self.ptr = ptr;
    return self;
  }

  [Symbol.dispose]() {
    this.dealloc();
    this.ptr = null;
  }

  constructor() {
    return __Dialog_new();
  }

  pick_file(): Deno.PointerObject | null {
    return __Dialog_pick_file(
      this.ptr,
    );
  }

  pick_files(): Deno.PointerObject | null {
    return __Dialog_pick_files(
      this.ptr,
    );
  }

  pick_directory(): Deno.PointerObject | null {
    return __Dialog_pick_directory(
      this.ptr,
    );
  }

  set_directory(arg0: Uint8Array): Dialog {
    return __Dialog_set_directory(
      this.ptr,
      arg0,
      // @ts-ignore
      arg0.byteLength,
    );
  }

  add_filter(arg0: Uint8Array): Dialog {
    return __Dialog_add_filter(
      this.ptr,
      arg0,
      // @ts-ignore
      arg0.byteLength,
    );
  }

  dealloc(): void {
    return __Dialog_dealloc(
      this.ptr,
    );
  }
}
