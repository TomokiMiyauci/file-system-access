export const symbols = {
  __Dialog_new: {
    parameters: [],
    result: "pointer",
    nonblocking: false,
  },
  __Dialog_pick_file: {
    parameters: [
      "pointer",
    ],
    result: "pointer",
    nonblocking: false,
  },
  __Dialog_pick_files: {
    parameters: [
      "pointer",
    ],
    result: "pointer",
    nonblocking: false,
  },
  __Dialog_pick_directory: {
    parameters: [
      "pointer",
    ],
    result: "pointer",
    nonblocking: false,
  },
  __Dialog_save_file: {
    parameters: [
      "pointer",
    ],
    result: "pointer",
    nonblocking: false,
  },
  __Dialog_set_directory: {
    parameters: [
      "pointer",
      "buffer",
      "usize",
    ],
    result: "pointer",
    nonblocking: false,
  },
  __Dialog_set_file_name: {
    parameters: [
      "pointer",
      "buffer",
      "usize",
    ],
    result: "pointer",
    nonblocking: false,
  },
  __Dialog_add_filter: {
    parameters: [
      "pointer",
      "buffer",
      "usize",
    ],
    result: "pointer",
    nonblocking: false,
  },
  __Dialog_dealloc: {
    parameters: [
      "pointer",
    ],
    result: "void",
    nonblocking: false,
  },
} satisfies Deno.ForeignLibraryInterface;
