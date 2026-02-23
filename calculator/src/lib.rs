use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: f64, b: f64) -> f64 {
    a + b
}

#[wasm_bindgen]
pub fn subtract(a: f64, b: f64) -> f64 {
    a - b
}

#[wasm_bindgen]
pub fn multiply(a: f64, b: f64) -> f64 {
    a * b
}

#[wasm_bindgen]
pub fn divide(a: f64, b: f64) -> f64 {
    if b == 0.0 {
        f64::NAN
    } else {
        a / b
    }
}

#[wasm_bindgen]
pub fn sqrt_a(a: f64) -> f64 {
    if a < 0.0 {
        f64::NAN
    } else {
        a.sqrt()
    }
}

#[wasm_bindgen]
pub fn power(a: f64, b: f64) -> f64 {
    a.powf(b)
}

#[wasm_bindgen]
pub fn percentage(a: f64, b: f64) -> f64 {
    a * b / 100.0
}

#[wasm_bindgen]
pub fn modulo(a: f64, b: f64) -> f64 {
    if b == 0.0 {
        f64::NAN
    } else {
        a % b
    }
}
