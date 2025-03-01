#!/bin/bash
cargo contract build --release;

seedfile() {
   mkdir -p "$(dirname "$1")"
   touch "$1"
}

seedfile ../../../../wavedata-api/contract/contracts/wavedata.json;
cp ./target/ink/wavedata.json ../../../../wavedata-api/contract/contracts/wavedata.json;
