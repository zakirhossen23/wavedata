#!/bin/sh
cargo build-bpf --bpf-out-dir=../dist

seedfile() {
   mkdir -p "$1"
}

seedfile ../../../../../wavedata-api/contract/contracts/;
cp -r -f ../dist/ ../../../../../wavedata-api/contract/contracts/;
