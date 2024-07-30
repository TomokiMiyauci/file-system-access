use deno_bindgen::deno_bindgen;
use rfd::FileDialog;
use serde_json::json;
use serde_json::Value;
use std::ffi::c_char;
use std::ffi::CString;
use std::path::Path;
use std::str;

#[deno_bindgen]
pub struct Dialog {
    dialog: FileDialog,
}

#[deno_bindgen]
impl Dialog {
    #[constructor]
    fn new() -> Dialog {
        Dialog {
            dialog: FileDialog::new(),
        }
    }

    pub fn pick_file(&self) -> *mut c_char {
        let path_buf = self.dialog.clone().pick_file();

        let result = match path_buf {
            Some(path) => json!({
              "success": true,
              "data": path
            }),
            None => json!({
              "success": false
            }),
        };

        let c_string = CString::new(result.to_string()).unwrap();

        c_string.into_raw()
    }

    pub fn pick_files(&self) -> *mut c_char {
        let files = self.dialog.clone().pick_files();

        let result = match files {
            Some(path) => json!({
              "success": true,
              "data": path
            }),
            None => json!({
              "success": false
            }),
        };

        let c_string = CString::new(result.to_string()).unwrap();

        c_string.into_raw()
    }

    pub fn pick_directory(&self) -> *mut c_char {
        let path_buf = self.dialog.clone().pick_folder();

        let result = match path_buf {
            Some(path) => json!({
              "success": true,
              "data": path
            }),
            None => json!({
              "success": false
            }),
        };

        let c_string = CString::new(result.to_string()).unwrap();

        c_string.into_raw()
    }

    pub fn set_directory(&self, p: &[u8]) -> Dialog {
        let path_str = str::from_utf8(p).expect("Invalid UTF-8 sequence");
        let path = Path::new(path_str);

        let dialog = self.dialog.clone().set_directory(path);

        Dialog { dialog }
    }

    pub fn add_filter(&self, extensions: &[u8]) -> Dialog {
        // let name = str::from_utf8(name).expect("Invalid UTF-8 sequence");
        let json = str::from_utf8(extensions).expect("Invalid UTF-8 sequence");
        let parsed: Value = serde_json::from_str(json).unwrap();

        let x = parsed.as_array().unwrap();
        let y: Vec<&str> = x.iter().filter_map(|v| v.as_str()).collect();

        let dialog = self.dialog.clone().add_filter("fff", &y);

        Dialog { dialog }
    }
}
